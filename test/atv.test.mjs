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
  canVolume,
  hasExternalVolume,
  hasVolumeState,
  isActive,
  describeAction,
  pressButton,
  readDevice,
  resolvePlayer,
  runAppAction,
  sendKey,
  sendText,
} from "./.build/atv.mjs";
import { brandFor, normalizeConfig } from "./.build/config.mjs";

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

/**
 * Overrides run through the action layer, which takes an element to dispatch
 * more-info events from. Service-call actions never touch it, so a stub with
 * dispatchEvent is enough and keeps these tests free of a DOM.
 */
const node = () => ({ dispatchEvent: () => true });

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

test("the pairing cannot be overridden, and ignores a stale config key", () => {
  // media_player_entity was dropped: the integration puts both entities on one
  // device, so there is nothing ambiguous to override.
  const hass = fixture();
  assert.equal(
    resolvePlayer(hass, config({ media_player_entity: "media_player.chromecast" })),
    "media_player.main_tv",
  );
});

test("no media title or artwork is read, because the integration sets neither", () => {
  const hass = fixture({
    playerAttrs: { media_title: "The Diplomat", entity_picture: "/art.png" },
  });
  const device = readDevice(hass, config());
  assert.equal(device.mediaTitle, undefined);
  assert.equal(device.picture, undefined);
});

test("a device with no media_player pairs to null rather than guessing", () => {
  const hass = fixture();
  assert.equal(resolvePlayer(hass, config({ entity: "remote.orphan_tv" })), null);
});

test("an empty entity registry pairs to null instead of throwing", () => {
  const hass = makeHass({ states: { "remote.main_tv": { entity_id: "remote.main_tv", state: "on", attributes: {} } } });
  assert.equal(resolvePlayer(hass, config()), null);
});

test("readDevice reads state, app and volume", () => {
  const device = readDevice(fixture({ playerState: "playing" }), config());
  assert.equal(device.found, true);
  assert.equal(device.available, true);
  assert.equal(device.on, true);
  assert.equal(device.playing, true);
  assert.equal(device.appName, "Netflix");
  assert.equal(device.volume, 0.4);
  assert.equal(device.muted, false);
  assert.equal(device.name, "Main TV");
});

test("the card exposes no list of apps on the TV, because none exists", () => {
  // activity_list only ever holds what someone typed into the integration's
  // options; nothing enumerates installed apps. Surfacing it in the editor read
  // as app discovery, so it was removed rather than hidden.
  const device = readDevice(fixture(), config());
  assert.equal(device.activities, undefined);
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
  await pressButton(hass, cfg, readDevice(hass, cfg), "up", node());
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
  await pressButton(hass, cfg, readDevice(hass, cfg), "home", node());
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
    action: { action: "activity", activity: "https://www.netflix.com/title" },
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
    action: { action: "app", app_id: "com.netflix.ninja" },
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
    () => runAppAction(hass, readDevice(hass, cfg), { action: { action: "app", app_id: "x" } }),
    /media_player/,
  );
  assert.equal(hass.calls.length, 0);
});

test("a service app calls the service it names", async () => {
  const hass = fixture();
  await runAppAction(hass, readDevice(hass, config()), {
    action: { action: "service", service: "script.movie_night", data: { brightness: 10 } },
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
    () =>
      runAppAction(hass, readDevice(hass, config()), {
        action: { action: "service", service: "oops" },
      }),
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


/* ------------------------------------------------------------------------ *
 * Volume state, and the soundbar case.
 *
 * androidtv_remote only sets volume_level when the TV reports a non-zero max
 * in its volume info. A TV handing audio to a soundbar over ARC reports none,
 * so there is no level and no mute flag to read -- and the card must neither
 * display a level it does not have nor assume an unmuted state.
 * ------------------------------------------------------------------------ */

test("a TV that reports no volume info has no volume state to show", () => {
  const hass = fixture({ playerAttrs: { volume_level: null, is_volume_muted: null } });
  const device = readDevice(hass, config());
  assert.equal(device.volume, undefined);
  assert.equal(device.muted, undefined, "unknown, which is not the same as unmuted");
  assert.equal(hasVolumeState(device), false);
});

test("mute falls back to the toggle key when the mute state is unknown", async () => {
  // media_player.volume_mute is absolute. Guessing "not muted" would mean every
  // press mutes and none ever unmutes.
  const hass = fixture({ playerAttrs: { volume_level: null, is_volume_muted: null } });
  const device = readDevice(hass, config());
  await pressButton(hass, config(), device, "volume_mute");
  assert.deepEqual(hass.calls[0], {
    domain: "remote",
    service: "send_command",
    data: { entity_id: "remote.main_tv", command: "MUTE" },
    target: undefined,
  });
});

test("volume_entity redirects the volume buttons to a soundbar", async () => {
  const hass = fixture();
  hass.states["media_player.soundbar"] = {
    entity_id: "media_player.soundbar",
    state: "on",
    attributes: {
      supported_features: FEATURE.VOLUME_STEP | FEATURE.VOLUME_MUTE | FEATURE.VOLUME_SET,
      volume_level: 0.62,
      is_volume_muted: false,
    },
  };
  const cfg = config({ volume_entity: "media_player.soundbar" });
  const device = readDevice(hass, cfg);

  assert.equal(device.volumeId, "media_player.soundbar");
  assert.equal(device.volume, 0.62, "level comes from the soundbar, not the TV");

  await pressButton(hass, cfg, device, "volume_up");
  assert.deepEqual(hass.calls[0], {
    domain: "media_player",
    service: "volume_up",
    data: { entity_id: "media_player.soundbar" },
    target: undefined,
  });

  hass.calls.length = 0;
  await pressButton(hass, cfg, device, "volume_mute");
  assert.deepEqual(hass.calls[0].data, {
    entity_id: "media_player.soundbar",
    is_volume_muted: true,
  });
});

test("volume_entity does not disturb the rest of the card", async () => {
  const hass = fixture();
  hass.states["media_player.soundbar"] = {
    entity_id: "media_player.soundbar",
    state: "on",
    attributes: { supported_features: FEATURE.VOLUME_STEP },
  };
  const cfg = config({ volume_entity: "media_player.soundbar" });
  const device = readDevice(hass, cfg);

  assert.equal(device.playerId, "media_player.main_tv");
  await pressButton(hass, cfg, device, "play_pause");
  assert.equal(hass.calls[0].data.entity_id, "media_player.main_tv");
});

test("a volume override still beats volume_entity", async () => {
  const hass = fixture();
  const cfg = config({
    volume_entity: "media_player.soundbar",
    volumeup: { service: "script.louder" },
  });
  await pressButton(hass, cfg, readDevice(hass, cfg), "volume_up", node());
  assert.deepEqual(hass.calls, [
    { domain: "script", service: "louder", data: {}, target: undefined },
  ]);
});

/* ------------------------------------------------------------------------ *
 * Volume that outlives the TV.
 *
 * A soundbar does not sleep when the set does, so the card keeps the volume row
 * on an off TV -- but only where volume demonstrably goes somewhere other than
 * the TV. On a plain TV the keys would reach a sleeping set, and a row that
 * cannot work is worse than no row.
 * ------------------------------------------------------------------------ */

test("volume routed to the TV's own player is not external", () => {
  const hass = fixture();
  assert.equal(hasExternalVolume(config(), readDevice(hass, config())), false);
});

test("volume_entity pointing elsewhere is external", () => {
  const hass = fixture();
  hass.states["media_player.soundbar"] = {
    entity_id: "media_player.soundbar",
    state: "on",
    attributes: { supported_features: FEATURE.VOLUME_STEP, volume_level: 0.62 },
  };
  const cfg = config({ volume_entity: "media_player.soundbar" });
  assert.equal(hasExternalVolume(cfg, readDevice(hass, cfg)), true);
});

test("volume_entity aimed back at the paired player is not external", () => {
  // Spelling out the player the card would have chosen anyway changes nothing:
  // the keys still go to the TV, so an off TV still has no volume row.
  const hass = fixture();
  const cfg = config({ volume_entity: "media_player.main_tv" });
  assert.equal(hasExternalVolume(cfg, readDevice(hass, cfg)), false);
});

test("an IR bridge on one volume button is external", () => {
  // The Sofabaton case: three pressable entities, no media player in sight.
  const hass = fixture();
  const cfg = config({ overrides: { volume_up: "button.baton_volume_up" } });
  assert.equal(hasExternalVolume(cfg, readDevice(hass, cfg)), true);
});

test("an override the card would not run does not make volume external", () => {
  // A hold-only override still leaves the tap sending a key code to the TV, and
  // `action: none` deliberately does nothing at all. Neither reaches a soundbar.
  const hass = fixture();
  const holdOnly = config({ overrides: { volume_up: { hold_action: { action: "more-info" } } } });
  assert.equal(hasExternalVolume(holdOnly, readDevice(hass, holdOnly)), false);

  const inert = config({ overrides: { volume_mute: { tap_action: { action: "none" } } } });
  assert.equal(hasExternalVolume(inert, readDevice(hass, inert)), false);
});

test("external volume is readable while the TV is off", () => {
  // The whole point: the soundbar is playing, the set is not, and the card can
  // still show and change the level.
  const hass = fixture({ playerState: "off", remoteState: "off" });
  hass.states["media_player.soundbar"] = {
    entity_id: "media_player.soundbar",
    state: "playing",
    attributes: {
      supported_features: FEATURE.VOLUME_STEP,
      volume_level: 0.31,
      is_volume_muted: false,
    },
  };
  const cfg = config({ volume_entity: "media_player.soundbar" });
  const device = readDevice(hass, cfg);

  assert.equal(device.on, false);
  assert.equal(hasExternalVolume(cfg, device), true);
  assert.equal(hasVolumeState(device), true);
  assert.equal(device.volume, 0.31);
});

/* ------------------------------------------------------------------------ *
 * What the header calls the app.
 *
 * androidtv_remote names an app only when you have named it yourself in the
 * integration's options; everything else arrives as a package id, so a header
 * that shows what the TV reports shows "com.netflix.ninja" on a TV that is
 * plainly playing Netflix.
 * ------------------------------------------------------------------------ */

test("a package id the card knows becomes the app's name", () => {
  const hass = fixture({ playerAttrs: { app_name: "com.netflix.ninja" } });
  assert.equal(readDevice(hass, config()).appName, "Netflix");
});

test("a package id only the brand list knows agrees with the logo beside it", () => {
  // brandFor already matches this id -- it is how the header finds the logo --
  // so the label has to come out of the same match, not a second opinion.
  const hass = fixture({ playerAttrs: { app_name: "com.disney.disneyplus" } });
  const device = readDevice(hass, config());
  assert.equal(device.appName, "Disney+");
  assert.equal(brandFor(device.appName), "disneyplus");
});

test("an unknown package id is left alone rather than guessed at", () => {
  // "Android" for com.google.android.something would read as a name and be
  // wrong, which is worse than the id -- and the id is what you type into the
  // integration's own naming options.
  const hass = fixture({ playerAttrs: { app_name: "com.example.someapp" } });
  assert.equal(readDevice(hass, config()).appName, "com.example.someapp");
});

test("a name the integration already resolved is untouched", () => {
  for (const name of ["Netflix", "Prime Video", "Some App 2"]) {
    const hass = fixture({ playerAttrs: { app_name: name } });
    assert.equal(readDevice(hass, config()).appName, name);
  }
});

test("the launcher reads as the home screen, not as a package", () => {
  const hass = fixture({ playerAttrs: { app_name: null } });
  hass.states["remote.main_tv"].attributes.current_activity =
    "com.google.android.tvlauncher";
  assert.equal(readDevice(hass, config()).appName, "Home screen");
});

test("current_activity is translated too, not only app_name", () => {
  const hass = fixture({ playerAttrs: { app_name: null } });
  hass.states["remote.main_tv"].attributes.current_activity =
    "com.peacocktv.peacockandroid";
  assert.equal(readDevice(hass, config()).appName, "Peacock");
});

test("app_id is exposed so the editor can capture the running app", () => {
  const hass = fixture({ playerAttrs: { app_id: "com.netflix.ninja" } });
  assert.equal(readDevice(hass, config()).appId, "com.netflix.ninja");
});


test("rewind and fast forward are key codes, with no media_player route", async () => {
  // media_player's only seek service takes an absolute position, which a TV
  // cannot report, so these never go through the player even when one is paired.
  const hass = fixture();
  const device = readDevice(hass, config());
  await pressButton(hass, config(), device, "rewind");
  await pressButton(hass, config(), device, "fast_forward");
  assert.deepEqual(hass.calls.map((c) => [c.domain, c.data.command]), [
    ["remote", "MEDIA_REWIND"],
    ["remote", "MEDIA_FAST_FORWARD"],
  ]);
});

/* ------------------------------------------------------------------------ *
 * Power overrides.
 *
 * Power is the one button with real default behaviour of its own -- it reads
 * the current state and toggles -- so an override has to short-circuit that,
 * not merge with it. The author's Main TV switches through an RF blaster.
 * ------------------------------------------------------------------------ */

test("a power override replaces the toggle entirely", async () => {
  const hass = fixture({ playerState: "on" });
  const cfg = config({
    power: {
      service: "remote.send_command",
      data: { command: "power", device: "livingroomtv", entity_id: "remote.living_room_rf" },
    },
  });
  await pressButton(hass, cfg, readDevice(hass, cfg), "power", node());
  assert.deepEqual(hass.calls, [
    {
      domain: "remote",
      service: "send_command",
      data: { command: "power", device: "livingroomtv", entity_id: "remote.living_room_rf" },
      target: undefined,
    },
  ]);
});

test("a power override fires the same whether the TV reads on or off", async () => {
  // The blaster sends one toggle code; the card must not decide between
  // turn_on and turn_off on its behalf.
  for (const playerState of ["on", "off"]) {
    const hass = fixture({ playerState });
    const cfg = config({ power: "button.blaster_power" });
    await pressButton(hass, cfg, readDevice(hass, cfg), "power", node());
    assert.deepEqual(hass.calls[0], {
      domain: "button",
      service: "press",
      data: {},
      target: { entity_id: "button.blaster_power" },
    });
  }
});

test("an override still applies when no element was passed", async () => {
  // runAction only needs a node for more-info. Gating the override on one made
  // it silently fall through to the button's default behaviour.
  const hass = fixture({ playerState: "on" });
  const cfg = config({ power: "button.blaster_power" });
  await pressButton(hass, cfg, readDevice(hass, cfg), "power");
  assert.equal(hass.calls[0].service, "press", "override ran without a node");
});

test("power still toggles when it has no override", async () => {
  const hass = fixture({ playerState: "on" });
  await pressButton(hass, config(), readDevice(hass, config()), "power", node());
  assert.equal(hass.calls[0].service, "turn_off");
});

test("favourite does nothing without an override, rather than sending a stray key", () => {
  // It is the one button with no key code: it exists only to run whatever the
  // user pointed it at, and only renders when they have.
  const hass = fixture();
  return pressButton(hass, config(), readDevice(hass, config()), "favorite", node()).then(
    () => assert.equal(hass.calls.length, 0),
  );
});

test("canVolume reads the volume target's features, not the TV's", () => {
  const hass = fixture({ playerAttrs: { supported_features: 0 } });
  hass.states["media_player.soundbar"] = {
    entity_id: "media_player.soundbar",
    state: "on",
    attributes: { supported_features: FEATURE.VOLUME_STEP | FEATURE.VOLUME_MUTE },
  };
  const cfg = config({ volume_entity: "media_player.soundbar" });
  const device = readDevice(hass, cfg);
  assert.equal(canVolume(device, FEATURE.VOLUME_STEP), true);
  assert.equal(can(device, FEATURE.VOLUME_STEP), false, "the TV itself cannot");
});

test("sendKey targets the remote entity", async () => {
  const hass = fixture();
  await sendKey(hass, readDevice(hass, config()), "GUIDE");
  assert.deepEqual(hass.calls[0].data, { entity_id: "remote.main_tv", command: "GUIDE" });
});

/* ------------------------------------------------------------------------ *
 * Tile state.
 * ------------------------------------------------------------------------ */

test("isActive treats the usual off-ish states as off", () => {
  const hass = makeHass({
    states: Object.fromEntries(
      ["off", "unavailable", "unknown", "idle", "standby", "none"].map((state) => [
        `x.${state}`,
        { entity_id: `x.${state}`, state, attributes: {} },
      ]),
    ),
  });
  for (const state of ["off", "unavailable", "unknown", "idle", "standby", "none"]) {
    assert.equal(isActive(hass, `x.${state}`), false, state);
  }
});

test("isActive treats anything else as on, whatever the domain", () => {
  const hass = makeHass({
    states: {
      "switch.a": { entity_id: "switch.a", state: "on", attributes: {} },
      "media_player.a": { entity_id: "media_player.a", state: "playing", attributes: {} },
      "cover.a": { entity_id: "cover.a", state: "open", attributes: {} },
    },
  });
  for (const id of ["switch.a", "media_player.a", "cover.a"]) {
    assert.equal(isActive(hass, id), true, id);
  }
});

test("isActive compares case-insensitively, which is what a select needs", () => {
  // A select's state is the literal option name. The Sofabaton activity reads
  // "Off" or "Google TV", so a case-sensitive check would call "Off" active.
  const hass = makeHass({
    states: {
      "select.activity": { entity_id: "select.activity", state: "Off", attributes: {} },
    },
  });
  assert.equal(isActive(hass, "select.activity"), false);

  hass.states["select.activity"].state = "Google TV";
  assert.equal(isActive(hass, "select.activity"), true);
});

test("a tile with no entity, or one that does not exist, is never lit", () => {
  // Not "off" — the card genuinely cannot know, and an IR button has no entity.
  const hass = makeHass();
  assert.equal(isActive(hass, undefined), false);
  assert.equal(isActive(hass, "media_player.gone"), false);
});

/* ------------------------------------------------------------------------ *
 * Tile actions are the full Home Assistant vocabulary.
 *
 * The three shorthands (activity, app, key) stay, but "call an action" is now
 * a real HA action rather than a bare service name — which is what lets the
 * editor offer the same interactions selector the button overrides use.
 * ------------------------------------------------------------------------ */

test("a tile can perform any HA action, with data and a target", async () => {
  const hass = fixture();
  const device = readDevice(hass, config());
  await runAppAction(hass, device, {
    action: {
      action: "perform-action",
      perform_action: "select.select_option",
      target: { entity_id: "select.baton_activity" },
      data: { option: "Google TV" },
    },
  }, node());
  assert.deepEqual(hass.calls[0], {
    domain: "select",
    service: "select_option",
    data: { option: "Google TV" },
    target: { entity_id: "select.baton_activity" },
  });
});

test("v1's bare {action: service} tiles still run", async () => {
  const hass = fixture();
  const device = readDevice(hass, config());
  await runAppAction(hass, device, {
    action: { action: "service", service: "script.movie_night", data: { room: "media" } },
  }, node());
  assert.deepEqual(hass.calls[0], {
    domain: "script",
    service: "movie_night",
    data: { room: "media" },
    target: undefined,
  });
});

test("a tile can toggle, which needs the fallback entity", async () => {
  const hass = fixture();
  const device = readDevice(hass, config());
  await runAppAction(hass, device, { action: { action: "toggle" } }, node());
  assert.deepEqual(hass.calls[0].data, { entity_id: "remote.main_tv" });
});

/* ------------------------------------------------------------------------ *
 * Which entity a bare action lands on.
 *
 * HA's interactions editor has no entity field for "more info": in HA's own
 * cards the dialog is always the card's entity. Here the card's entity is a
 * remote, so a section button's dialog opened the one thing the button was
 * certainly not about -- never the receiver it lights up for.
 * ------------------------------------------------------------------------ */

/** A node double that records the more-info dialogs it is asked to open. */
const dialogNode = () => {
  const opened = [];
  return {
    opened,
    dispatchEvent(event) {
      if (event.type === "hass-more-info") opened.push(event.detail.entityId);
      return true;
    },
  };
};

test("more info on a tile opens the tile's own entity", async () => {
  const hass = fixture();
  const device = readDevice(hass, config());
  const el = dialogNode();
  await runAppAction(
    hass,
    device,
    { entity: "media_player.soundbar", action: { action: "more-info" } },
    el,
  );
  assert.deepEqual(el.opened, ["media_player.soundbar"]);
});

test("an entity on the action beats the tile's own", async () => {
  const hass = fixture();
  const device = readDevice(hass, config());
  const el = dialogNode();
  await runAppAction(
    hass,
    device,
    {
      entity: "media_player.soundbar",
      action: { action: "more-info", entity: "media_player.projector" },
    },
    el,
  );
  assert.deepEqual(el.opened, ["media_player.projector"]);
});

test("a tile with nothing to name falls back to the card's remote", async () => {
  const hass = fixture();
  const device = readDevice(hass, config());
  const el = dialogNode();
  await runAppAction(hass, device, { action: { action: "more-info" } }, el);
  assert.deepEqual(el.opened, ["remote.main_tv"]);
});

test("toggle follows the same order as more info", async () => {
  // Same reasoning, and HA's config has nowhere to name an entity for toggle at
  // all -- so the tile's own is the only way to mean anything but the remote.
  const hass = fixture();
  const device = readDevice(hass, config());
  await runAppAction(
    hass,
    device,
    { entity: "media_player.projector", action: { action: "toggle" } },
    node(),
  );
  assert.deepEqual(hass.calls[0], {
    domain: "homeassistant",
    service: "toggle",
    data: { entity_id: "media_player.projector" },
    target: undefined,
  });
});

test("the three shorthands are untouched", async () => {
  const hass = fixture();
  const device = readDevice(hass, config());
  await runAppAction(hass, device, { action: { action: "key", key: "GUIDE" } }, node());
  assert.equal(hass.calls[0].data.command, "GUIDE");

  hass.calls.length = 0;
  await runAppAction(hass, device, { action: { action: "activity", activity: "HULU" } }, node());
  assert.equal(hass.calls[0].data.activity, "HULU");
});

test("describeAction summarises the new kinds for the editor list", () => {
  assert.equal(
    describeAction({ action: "perform-action", perform_action: "script.x" }),
    "Call script.x",
  );
  assert.equal(describeAction({ action: "navigate", navigation_path: "/tv" }), "Go to /tv");
  assert.equal(describeAction({ action: "toggle" }), "Toggle the TV");
  assert.equal(describeAction({ action: "none" }), "Do nothing");
});

test("the list row names the entity a bare action will land on", () => {
  // "Toggle the TV" on a button that toggles a projector is a row lying about
  // what it does, and the row is all the editor shows until you open it.
  assert.equal(
    describeAction({ action: "toggle" }, "media_player.projector"),
    "Toggle media_player.projector",
  );
  assert.equal(
    describeAction({ action: "more-info" }, "media_player.soundbar"),
    "Show media_player.soundbar",
  );
  assert.equal(
    describeAction({ action: "more-info", entity: "media_player.turntable" }, "media_player.soundbar"),
    "Show media_player.turntable",
    "the action's own entity wins, as it does when the button is pressed",
  );
  // A tile with nothing to name keeps the old wording: the card's remote.
  assert.equal(describeAction({ action: "more-info" }), "Show more info");
});
