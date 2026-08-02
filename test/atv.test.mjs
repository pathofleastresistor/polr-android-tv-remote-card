/**
 * Pairing, feature masking, and the exact service call each button makes.
 *
 * The pairing tests use the real entity ids from the author's system, including
 * the mismatched `remote.gym_tv` / `media_player.gym_tv_2` pair that makes
 * string-munging the entity id wrong.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  FEATURE,
  KEYS,
  can,
  describeAction,
  pressButton,
  readDevice,
  resolvePlayer,
  runAppAction,
  sendText,
} from "./.build/atv.mjs";
import { normalizeConfig } from "./.build/config.mjs";

const FULL_FEATURES =
  FEATURE.PAUSE |
  FEATURE.VOLUME_STEP |
  FEATURE.VOLUME_MUTE |
  FEATURE.PREVIOUS_TRACK |
  FEATURE.NEXT_TRACK |
  FEATURE.TURN_ON |
  FEATURE.TURN_OFF |
  FEATURE.PLAY |
  FEATURE.STOP |
  FEATURE.PLAY_MEDIA;

/** A hass double that records every service call. */
const makeHass = ({ entities = {}, states = {} } = {}) => {
  const calls = [];
  return {
    calls,
    entities,
    states,
    callService(domain, service, data, target) {
      calls.push({ domain, service, data, target });
      return Promise.resolve({ context: { id: "test" } });
    },
  };
};

/** The three-TV fixture, mirroring the real registry. */
const fixture = ({ playerState = "on", playerAttrs = {}, remoteState = "on" } = {}) => {
  const entities = {
    "remote.main_tv": { entity_id: "remote.main_tv", platform: "androidtv_remote", device_id: "dev-main" },
    "media_player.main_tv": { entity_id: "media_player.main_tv", platform: "androidtv_remote", device_id: "dev-main" },
    // Deliberately mismatched suffix — the whole reason pairing is by device.
    "remote.gym_tv": { entity_id: "remote.gym_tv", platform: "androidtv_remote", device_id: "dev-gym" },
    "media_player.gym_tv_2": { entity_id: "media_player.gym_tv_2", platform: "androidtv_remote", device_id: "dev-gym" },
    // No media_player on this device at all.
    "remote.orphan_tv": { entity_id: "remote.orphan_tv", platform: "androidtv_remote", device_id: "dev-orphan" },
  };

  const states = {
    "remote.main_tv": {
      entity_id: "remote.main_tv",
      state: remoteState,
      attributes: {
        friendly_name: "Main TV",
        activity_list: ["Netflix", "YouTube"],
        current_activity: "Netflix",
      },
    },
    "media_player.main_tv": {
      entity_id: "media_player.main_tv",
      state: playerState,
      attributes: {
        friendly_name: "Main TV",
        supported_features: FULL_FEATURES,
        app_name: "Netflix",
        volume_level: 0.4,
        is_volume_muted: false,
        ...playerAttrs,
      },
    },
    "remote.gym_tv": { entity_id: "remote.gym_tv", state: "on", attributes: {} },
    "media_player.gym_tv_2": {
      entity_id: "media_player.gym_tv_2",
      state: "on",
      attributes: { supported_features: FULL_FEATURES },
    },
    "remote.orphan_tv": { entity_id: "remote.orphan_tv", state: "on", attributes: {} },
  };

  return makeHass({ entities, states });
};

const config = (extra) =>
  normalizeConfig({ type: "custom:polr-android-tv-remote-card", entity: "remote.main_tv", ...extra });

test("a media_player on the same device is paired to the remote", () => {
  const hass = fixture();
  assert.equal(resolvePlayer(hass, config()), "media_player.main_tv");
});

test("pairing survives mismatched entity ids", () => {
  // remote.gym_tv -> media_player.gym_tv_2. Any string-munging approach fails.
  const hass = fixture();
  assert.equal(
    resolvePlayer(hass, config({ entity: "remote.gym_tv" })),
    "media_player.gym_tv_2",
  );
});

test("an explicit media_player_entity wins over the device lookup", () => {
  const hass = fixture();
  assert.equal(
    resolvePlayer(hass, config({ media_player_entity: "media_player.chromecast" })),
    "media_player.chromecast",
  );
});

test("a device with no media_player pairs to null rather than guessing", () => {
  const hass = fixture();
  assert.equal(resolvePlayer(hass, config({ entity: "remote.orphan_tv" })), null);
});

test("an empty entity registry pairs to null instead of throwing", () => {
  const hass = makeHass({ states: { "remote.main_tv": { entity_id: "remote.main_tv", state: "on", attributes: {} } } });
  assert.equal(resolvePlayer(hass, config()), null);
});

test("readDevice reads state, app, volume and activities", () => {
  const device = readDevice(fixture({ playerState: "playing" }), config());
  assert.equal(device.found, true);
  assert.equal(device.available, true);
  assert.equal(device.on, true);
  assert.equal(device.playing, true);
  assert.equal(device.appName, "Netflix");
  assert.equal(device.volume, 0.4);
  assert.equal(device.muted, false);
  assert.equal(device.name, "Main TV");
  assert.deepEqual(device.activities, ["Netflix", "YouTube"]);
});

test("a player in state off reports the TV as off", () => {
  const device = readDevice(fixture({ playerState: "off" }), config());
  assert.equal(device.on, false);
});

test("an unavailable player falls back to the remote for power", () => {
  const hass = fixture({ playerState: "unavailable" });
  const device = readDevice(hass, config());
  assert.equal(device.available, false);
  assert.equal(device.on, true, "remote.main_tv is still on");
});

test("a missing remote entity is reported, not thrown", () => {
  const hass = makeHass();
  const device = readDevice(hass, config({ entity: "remote.gone" }));
  assert.equal(device.found, false);
  assert.equal(device.available, false);
});

test("supported_features masking hides what the player cannot do", () => {
  const hass = fixture({
    playerAttrs: {
      supported_features: FULL_FEATURES & ~(FEATURE.NEXT_TRACK | FEATURE.PREVIOUS_TRACK),
    },
  });
  const device = readDevice(hass, config());
  assert.equal(can(device, FEATURE.PAUSE), true);
  assert.equal(can(device, FEATURE.NEXT_TRACK), false);
  assert.equal(can(device, FEATURE.PREVIOUS_TRACK), false);
  // The real integration supports neither of these; the card must not assume.
  assert.equal(can(device, FEATURE.VOLUME_SET), false);
});

test("d-pad presses go to remote.send_command with v1's key codes", async () => {
  const hass = fixture();
  const device = readDevice(hass, config());
  for (const [button, key] of Object.entries({
    up: "DPAD_UP",
    down: "DPAD_DOWN",
    left: "DPAD_LEFT",
    right: "DPAD_RIGHT",
    center: "DPAD_CENTER",
    home: "HOME",
    back: "BACK",
  })) {
    hass.calls.length = 0;
    await pressButton(hass, config(), device, button);
    assert.deepEqual(hass.calls[0], {
      domain: "remote",
      service: "send_command",
      data: { entity_id: "remote.main_tv", command: key },
      target: undefined,
    });
  }
});

test("mute sends v1's MUTE key when no player is paired", async () => {
  const hass = fixture();
  const cfg = config({ entity: "remote.orphan_tv" });
  const device = readDevice(hass, cfg);
  await pressButton(hass, cfg, device, "volume_mute");
  assert.equal(hass.calls[0].data.command, "MUTE");
  assert.equal(KEYS.volume_mute, "MUTE");
});

test("mute uses the player and inverts the current mute state", async () => {
  const hass = fixture({ playerAttrs: { is_volume_muted: false } });
  const device = readDevice(hass, config());
  await pressButton(hass, config(), device, "volume_mute");
  assert.deepEqual(hass.calls[0], {
    domain: "media_player",
    service: "volume_mute",
    data: { entity_id: "media_player.main_tv", is_volume_muted: true },
    target: undefined,
  });
});

test("volume steps go through the player when it supports VOLUME_STEP", async () => {
  const hass = fixture();
  const device = readDevice(hass, config());
  await pressButton(hass, config(), device, "volume_up");
  assert.equal(hass.calls[0].domain, "media_player");
  assert.equal(hass.calls[0].service, "volume_up");
});

test("volume falls back to key codes when the player lacks VOLUME_STEP", async () => {
  const hass = fixture({ playerAttrs: { supported_features: FEATURE.PAUSE } });
  const device = readDevice(hass, config());
  await pressButton(hass, config(), device, "volume_up");
  assert.equal(hass.calls[0].service, "send_command");
  assert.equal(hass.calls[0].data.command, "VOLUME_UP");
});

test("next/previous fall back to key codes on a reduced player", async () => {
  const hass = fixture({
    playerAttrs: { supported_features: FULL_FEATURES & ~FEATURE.NEXT_TRACK },
  });
  const device = readDevice(hass, config());
  await pressButton(hass, config(), device, "next");
  assert.equal(hass.calls[0].data.command, "MEDIA_NEXT");
});

test("power toggles the player, in the direction it is not currently in", async () => {
  const on = fixture({ playerState: "on" });
  await pressButton(on, config(), readDevice(on, config()), "power");
  assert.equal(on.calls[0].service, "turn_off");

  const off = fixture({ playerState: "off" });
  await pressButton(off, config(), readDevice(off, config()), "power");
  assert.equal(off.calls[0].service, "turn_on");
});

test("power falls back to the remote entity when unpaired", async () => {
  const hass = fixture();
  const cfg = config({ entity: "remote.orphan_tv" });
  await pressButton(hass, cfg, readDevice(hass, cfg), "power");
  assert.deepEqual(hass.calls[0], {
    domain: "remote",
    service: "turn_off",
    data: { entity_id: "remote.orphan_tv" },
    target: undefined,
  });
});

test("an override replaces the button entirely", async () => {
  const hass = fixture();
  const cfg = config({
    up: { service: "remote.send_command", data: { command: "up", entity_id: "remote.ir" } },
  });
  await pressButton(hass, cfg, readDevice(hass, cfg), "up");
  assert.deepEqual(hass.calls, [
    {
      domain: "remote",
      service: "send_command",
      data: { command: "up", entity_id: "remote.ir" },
      target: undefined,
    },
  ]);
});

test("an override may carry a target", async () => {
  const hass = fixture();
  const cfg = config({
    overrides: { home: { service: "script.turn_on", target: { entity_id: "script.movie" } } },
  });
  await pressButton(hass, cfg, readDevice(hass, cfg), "home");
  assert.deepEqual(hass.calls[0].target, { entity_id: "script.movie" });
});

test("text is sent as a text:-prefixed command", async () => {
  const hass = fixture();
  await sendText(hass, readDevice(hass, config()), "the bear");
  assert.deepEqual(hass.calls[0], {
    domain: "remote",
    service: "send_command",
    data: { entity_id: "remote.main_tv", command: "text:the bear" },
    target: undefined,
  });
});

test("an activity app launches via remote.turn_on", async () => {
  const hass = fixture();
  await runAppAction(hass, readDevice(hass, config()), {
    action: "activity",
    activity: "https://www.netflix.com/title",
  });
  assert.deepEqual(hass.calls[0], {
    domain: "remote",
    service: "turn_on",
    data: { entity_id: "remote.main_tv", activity: "https://www.netflix.com/title" },
    target: undefined,
  });
});

test("an app-id app launches via media_player.play_media", async () => {
  const hass = fixture();
  await runAppAction(hass, readDevice(hass, config()), {
    action: "app",
    app_id: "com.netflix.ninja",
  });
  assert.deepEqual(hass.calls[0].data, {
    entity_id: "media_player.main_tv",
    media_content_type: "app",
    media_content_id: "com.netflix.ninja",
  });
});

test("an app-id app without a paired player rejects rather than calling nothing", async () => {
  const hass = fixture();
  const cfg = config({ entity: "remote.orphan_tv" });
  await assert.rejects(
    () => runAppAction(hass, readDevice(hass, cfg), { action: "app", app_id: "x" }),
    /media_player/,
  );
  assert.equal(hass.calls.length, 0);
});

test("a service app calls the service it names", async () => {
  const hass = fixture();
  await runAppAction(hass, readDevice(hass, config()), {
    action: "service",
    service: "script.movie_night",
    data: { brightness: 10 },
  });
  assert.deepEqual(hass.calls[0], {
    domain: "script",
    service: "movie_night",
    data: { brightness: 10 },
    target: undefined,
  });
});

test("a malformed service name rejects instead of calling a wrong service", async () => {
  const hass = fixture();
  await assert.rejects(
    () => runAppAction(hass, readDevice(hass, config()), { action: "service", service: "oops" }),
    /invalid service/,
  );
  assert.equal(hass.calls.length, 0);
});

test("describeAction summarises every action kind", () => {
  assert.equal(describeAction({ action: "activity", activity: "HULU" }), "Launch HULU");
  assert.equal(describeAction({ action: "app", app_id: "com.x" }), "Open app com.x");
  assert.equal(describeAction({ action: "key", key: "GUIDE" }), "Send GUIDE");
  assert.equal(describeAction({ action: "service", service: "script.x" }), "Call script.x");
});
