/**
 * One test per row of the v1 -> v2 mapping table in the README.
 *
 * This file is the safety net for everyone still running a 2023 config,
 * including the author, whose live dashboard is v1. A failure here means
 * somebody's remote stopped working.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  BRANDS,
  BRAND_IDS,
  DEFAULTS,
  brandFor,
  entityAction,
  normalizeConfig,
  stripLegacyKeys,
  _resetWarnings,
} from "./.build/config.mjs";

const TYPE = "custom:polr-android-tv-remote-card";
const base = (extra) => ({ type: TYPE, ...extra });

/** Overrides normalise to HA interactions; a service call becomes the tap. */
const tap = ({ service, data, target }) => ({
  tap_action: {
    action: "perform-action",
    perform_action: service,
    ...(data ? { data } : {}),
    ...(target ? { target } : {}),
  },
});

test.beforeEach(() => _resetWarnings());

test("entity_id becomes entity", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv" }));
  assert.equal(config.entity, "remote.atv");
});

test("explicit entity wins over a stale entity_id", () => {
  const config = normalizeConfig(base({ entity: "remote.new", entity_id: "remote.old" }));
  assert.equal(config.entity, "remote.new");
});

test("a config with neither entity nor entity_id throws", () => {
  assert.throws(() => normalizeConfig(base({})), /'entity' is required/);
});

test("remote: default maps to the buttons pad", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", remote: "default" }));
  assert.equal(config.pad, "buttons");
});

test("an absent remote key is treated as default", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv" }));
  assert.equal(config.pad, DEFAULTS.pad);
});

test("remote: touch maps to the touchpad", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", remote: "touch" }));
  assert.equal(config.pad, "touchpad");
});

test("remote: dpad maps to the dpad", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", remote: "dpad" }));
  assert.equal(config.pad, "dpad");
});

test("show_navigation_row is dropped: the row is always drawn", () => {
  const stripped = stripLegacyKeys(
    normalizeConfig(base({ entity: "remote.atv", show_navigation_row: false })),
  );
  assert.equal(stripped.show_navigation_row, undefined);
});

test("an unknown remote style falls back to the default pad", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", remote: "nonsense" }));
  assert.equal(config.pad, DEFAULTS.pad);
});

test("a v2 pad wins over a v1 remote key", () => {
  const config = normalizeConfig(base({ entity: "remote.atv", remote: "touch", pad: "dpad" }));
  assert.equal(config.pad, "dpad");
});

test("volume: false becomes show_volume: false", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", volume: false }));
  assert.equal(config.show_volume, false);
});

test("volume defaults to shown, matching v1", () => {
  assert.equal(normalizeConfig(base({ entity_id: "remote.atv" })).show_volume, true);
  assert.equal(
    normalizeConfig(base({ entity_id: "remote.atv", volume: true })).show_volume,
    true,
  );
});

test("every bare brand string becomes the activity v1 launched", () => {
  const config = normalizeConfig(
    base({ entity_id: "remote.atv", apps: Object.keys(BRANDS) }),
  );
  assert.equal(config.apps.length, 6);
  for (const [index, id] of Object.keys(BRANDS).entries()) {
    const app = config.apps[index];
    assert.equal(app.icon, `brand:${id}`);
    assert.equal(app.name, BRANDS[id].label);
    assert.deepEqual(app.action, { action: "activity", activity: BRANDS[id].activity });
  }
});

test("the brand deep links are byte-identical to v1", () => {
  // Hardcoded rather than derived from BRANDS: this asserts the constants, and
  // Hulu is deliberately a bare app name rather than a URL, as v1 sent.
  assert.equal(BRANDS.disneyplus.activity, "https://www.disneyplus.com");
  assert.equal(BRANDS.hbomax.activity, "https://play.hbomax.com");
  assert.equal(BRANDS.hulu.activity, "HULU");
  assert.equal(BRANDS.netflix.activity, "https://www.netflix.com/title");
  assert.equal(BRANDS.prime.activity, "https://app.primevideo.com");
  assert.equal(BRANDS.youtube.activity, "https://www.youtube.com");
});

test("{icon, url} becomes an activity action", () => {
  const config = normalizeConfig(
    base({
      entity_id: "remote.atv",
      apps: [{ icon: "mdi:youtube", url: "https://www.youtube.com" }],
    }),
  );
  assert.deepEqual(config.apps[0], {
    icon: "mdi:youtube",
    action: { action: "activity", activity: "https://www.youtube.com" },
  });
});

test("{icon, service, data} becomes a service action", () => {
  const config = normalizeConfig(
    base({
      entity_id: "remote.atv",
      apps: [
        {
          icon: "mdi:volume-low",
          service: "remote.send_command",
          data: { command: "volumedown", entity_id: "remote.ir" },
        },
      ],
    }),
  );
  assert.deepEqual(config.apps[0], {
    icon: "mdi:volume-low",
    action: {
      action: "service",
      service: "remote.send_command",
      data: { command: "volumedown", entity_id: "remote.ir" },
    },
  });
});

test("an unrecognised bare app string becomes an activity instead of crashing", () => {
  // v1 fell through to _render_custom() here and threw reading app.icon.
  const config = normalizeConfig(base({ entity_id: "remote.atv", apps: ["plex"] }));
  assert.deepEqual(config.apps[0].action, { action: "activity", activity: "plex" });
  assert.equal(config.apps[0].icon, "mdi:application");
});

test("an app entry with no url, service or action is dropped, not fatal", () => {
  const config = normalizeConfig(
    base({ entity_id: "remote.atv", apps: [{ icon: "mdi:tv" }, "netflix"] }),
  );
  assert.equal(config.apps.length, 1);
  assert.equal(config.apps[0].name, "Netflix");
});

test("v2 app entries pass through untouched", () => {
  const app = { name: "Plex", icon: "mdi:plex", action: { action: "key", key: "PLEX" } };
  const config = normalizeConfig(base({ entity: "remote.atv", apps: [app] }));
  assert.deepEqual(config.apps[0], app);
});

test("the nine same-named override keys move into overrides", () => {
  const call = (command) => ({
    service: "remote.send_command",
    data: { command, entity_id: "remote.ir" },
  });
  const config = normalizeConfig(
    base({
      entity_id: "remote.atv",
      up: call("up"),
      down: call("down"),
      left: call("left"),
      right: call("right"),
      center: call("center"),
      power: call("power"),
      home: call("home"),
      back: call("back"),
      favorite: call("fav"),
    }),
  );
  for (const id of ["up", "down", "left", "right", "center", "power", "home", "back"]) {
    assert.deepEqual(config.overrides[id], tap(call(id)), `override ${id}`);
  }
  assert.deepEqual(config.overrides.favorite, tap(call("fav")));
});

test("the three renamed volume override keys move across", () => {
  const call = (command) => ({ service: "remote.send_command", data: { command } });
  const config = normalizeConfig(
    base({
      entity_id: "remote.atv",
      volumeup: call("volumeup"),
      volumedown: call("volumedown"),
      volumemute: call("volumemute"),
    }),
  );
  assert.deepEqual(config.overrides.volume_up, tap(call("volumeup")));
  assert.deepEqual(config.overrides.volume_down, tap(call("volumedown")));
  assert.deepEqual(config.overrides.volume_mute, tap(call("volumemute")));
});

test("an explicit v2 override wins over the v1 key of the same button", () => {
  const config = normalizeConfig(
    base({
      entity_id: "remote.atv",
      volumeup: { service: "script.old" },
      overrides: { volume_up: { service: "script.new" } },
    }),
  );
  assert.deepEqual(config.overrides.volume_up, tap({ service: "script.new" }));
});

test("an override that is not a service call is ignored, not fatal", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", up: "DPAD_UP" }));
  assert.equal(config.overrides.up, undefined);
});

test("the favourite button appears only when it has an override", () => {
  // v1 always drew it on the default pad and threw on press when unconfigured.
  assert.equal(normalizeConfig(base({ entity_id: "remote.atv" })).show_favorite, false);
  assert.equal(
    normalizeConfig(base({ entity_id: "remote.atv", favorite: { service: "script.fav" } }))
      .show_favorite,
    true,
  );
});

test("unknown keys survive normalisation", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", future_option: 42 }));
  assert.equal(config.future_option, 42);
});

test("normalizeConfig does not mutate its input", () => {
  const raw = base({ entity_id: "remote.atv", apps: ["netflix"] });
  const snapshot = JSON.parse(JSON.stringify(raw));
  normalizeConfig(raw);
  assert.deepEqual(raw, snapshot);
});

test("stripLegacyKeys removes only v1 keys", () => {
  const stripped = stripLegacyKeys({
    type: TYPE,
    entity: "remote.atv",
    entity_id: "remote.atv",
    remote: "touch",
    volume: false,
    volumeup: { service: "script.x" },
    show_volume: false,
    // Derived from overrides.favorite; writing it would go stale.
    show_favorite: true,
  });
  assert.deepEqual(stripped, { type: TYPE, entity: "remote.atv", show_volume: false });
});

test("the README's v1 example still resolves", () => {
  const config = normalizeConfig({
    type: TYPE,
    entity_id: "remote.android_tv_remote",
    remote: "touch",
    apps: [
      "disneyplus",
      "hbomax",
      "netflix",
      "prime",
      { icon: "mdi:youtube", url: "https://www.youtube.com" },
    ],
  });
  assert.equal(config.entity, "remote.android_tv_remote");
  assert.equal(config.pad, "touchpad");
  assert.equal(config.apps.length, 5);
  assert.equal(config.apps[0].action.activity, "https://www.disneyplus.com");
  assert.equal(config.apps[4].action.activity, "https://www.youtube.com");
  assert.equal(config.show_volume, true);
});

test("the README's v1 customisation example still resolves", () => {
  const ir = (command) => ({
    service: "remote.send_command",
    data: {
      command,
      device: "livingroomtv",
      entity_id: "remote.living_room_ir_repeater",
    },
  });
  const config = normalizeConfig({
    type: TYPE,
    entity_id: "remote.atvremote_2",
    remote: "touch",
    apps: [{ ...ir("volumedown"), icon: "mdi:volume-low" }],
    power: ir("power"),
    up: ir("up"),
    down: ir("down"),
    left: ir("left"),
    right: ir("right"),
    back: ir("back"),
    center: ir("center"),
    favorite: ir("volumedown"),
    volumedown: ir("volumedown"),
    volumeup: ir("volumeup"),
  });

  assert.equal(config.pad, "touchpad");
  assert.equal(config.apps.length, 1);
  assert.equal(config.apps[0].action.action, "service");
  assert.equal(config.apps[0].action.service, "remote.send_command");
  assert.equal(config.apps[0].icon, "mdi:volume-low");
  assert.equal(config.show_favorite, true);
  assert.deepEqual(config.overrides.power, tap(ir("power")));
  assert.deepEqual(config.overrides.volume_up, tap(ir("volumeup")));
  assert.deepEqual(config.overrides.volume_down, tap(ir("volumedown")));
  // volumemute was not overridden, so the card handles it itself.
  assert.equal(config.overrides.volume_mute, undefined);
});

test("app_columns caps a row at five buttons by default", () => {
  assert.equal(DEFAULTS.app_columns, 5);
  assert.equal(normalizeConfig(base({ entity: "remote.atv" })).app_columns, 5);
  assert.equal(
    normalizeConfig(base({ entity: "remote.atv", app_columns: 3 })).app_columns,
    3,
  );
});

test("a nonsensical app_columns falls back to the default", () => {
  // "auto" was the v2-beta spelling, before the tiles became fixed-width.
  for (const value of ["auto", 0, -2, null]) {
    assert.equal(
      normalizeConfig(base({ entity: "remote.atv", app_columns: value })).app_columns,
      5,
      `app_columns: ${JSON.stringify(value)}`,
    );
  }
});


/* ------------------------------------------------------------------------ *
 * Overrides as bare entity ids.
 *
 * IR bridges expose one pressable entity per command rather than a
 * media_player -- a Sofabaton X1S gives button.<name>_volume_up,
 * _volume_down and _volume_mute -- so a single volume_entity cannot cover
 * them and three full service calls is a lot of YAML for "press this".
 * ------------------------------------------------------------------------ */

test("a bare button entity becomes button.press on that entity", () => {
  assert.deepEqual(entityAction("button.media_room_baton_volume_up"), {
    service: "button.press",
    target: { entity_id: "button.media_room_baton_volume_up" },
  });
});

test("each pressable domain maps to its own service", () => {
  assert.equal(entityAction("input_button.x").service, "input_button.press");
  assert.equal(entityAction("script.x").service, "script.turn_on");
  assert.equal(entityAction("scene.x").service, "scene.turn_on");
  assert.equal(entityAction("automation.x").service, "automation.trigger");
});

test("a domain with no obvious press is refused rather than guessed", () => {
  // A remote needs a command, a light needs a target state: there is no
  // single sensible "press" for either.
  assert.equal(entityAction("remote.living_room_ir"), null);
  assert.equal(entityAction("light.lamp"), null);
  assert.equal(entityAction("nonsense"), null);
});

test("the three Sofabaton volume buttons configure in one line each", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.media_room_tv",
      overrides: {
        volume_up: "button.media_room_baton_volume_up",
        volume_down: "button.media_room_baton_volume_down",
        volume_mute: "button.media_room_baton_volume_mute",
      },
    }),
  );
  assert.deepEqual(config.overrides.volume_up, {
    tap_action: {
      action: "perform-action",
      perform_action: "button.press",
      target: { entity_id: "button.media_room_baton_volume_up" },
    },
  });
  assert.deepEqual(config.overrides.volume_mute.tap_action.target, {
    entity_id: "button.media_room_baton_volume_mute",
  });
});

test("an entity override that cannot be pressed is dropped, not fatal", () => {
  const config = normalizeConfig(
    base({ entity: "remote.atv", overrides: { volume_up: "light.lamp" } }),
  );
  assert.equal(config.overrides.volume_up, undefined);
});

test("full service-call overrides still work alongside entity ones", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      overrides: {
        volume_up: "button.up",
        volume_mute: { service: "script.mute", data: { room: "media" } },
      },
    }),
  );
  assert.equal(config.overrides.volume_up.tap_action.perform_action, "button.press");
  assert.deepEqual(config.overrides.volume_mute, {
    tap_action: {
      action: "perform-action",
      perform_action: "script.mute",
      data: { room: "media" },
    },
  });
});

/* ------------------------------------------------------------------------ *
 * HA's standard interactions.
 *
 * Every override shape converges on {tap_action, hold_action,
 * double_tap_action}, so the runtime has one shape to handle and the editor's
 * ui_action selectors have something to bind to.
 * ------------------------------------------------------------------------ */

test("interactions pass through as written", () => {
  const actions = {
    tap_action: { action: "perform-action", perform_action: "script.louder" },
    hold_action: { action: "more-info" },
    double_tap_action: { action: "navigate", navigation_path: "/lovelace/tv" },
  };
  const config = normalizeConfig(
    base({ entity: "remote.atv", overrides: { volume_up: actions } }),
  );
  assert.deepEqual(config.overrides.volume_up, actions);
});

test("a bare entity id becomes a tap action, leaving hold free", () => {
  const config = normalizeConfig(
    base({ entity: "remote.atv", overrides: { volume_up: "button.up" } }),
  );
  assert.deepEqual(config.overrides.volume_up, {
    tap_action: {
      action: "perform-action",
      perform_action: "button.press",
      target: { entity_id: "button.up" },
    },
  });
  assert.equal(config.overrides.volume_up.hold_action, undefined);
});

test("an override may configure hold alone, leaving tap at its default", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      overrides: { power: { hold_action: { action: "more-info" } } },
    }),
  );
  assert.equal(config.overrides.power.tap_action, undefined);
  assert.deepEqual(config.overrides.power.hold_action, { action: "more-info" });
});

test("action: none is kept, so a button can be deliberately inert", () => {
  const config = normalizeConfig(
    base({ entity: "remote.atv", overrides: { menu: { tap_action: { action: "none" } } } }),
  );
  assert.deepEqual(config.overrides.menu.tap_action, { action: "none" });
});

test("a garbage override is dropped rather than half-applied", () => {
  const config = normalizeConfig(
    base({ entity: "remote.atv", overrides: { menu: { nonsense: true } } }),
  );
  assert.equal(config.overrides.menu, undefined);
});

/* ------------------------------------------------------------------------ *
 * The unreleased `general-improvements` branch.
 *
 * It never shipped to HACS, but it was built and run locally — the author's
 * own three dashboards are configured with these keys, not v1's. The configs
 * below are copied verbatim out of a live .storage/lovelace.lovelace, which is
 * the only migration that actually has to be right.
 * ------------------------------------------------------------------------ */

const IR = (command, entity = "remote.living_room_rf") => ({
  service: "remote.send_command",
  data: { command, device: "livingroomtv", entity_id: entity },
});

test("branch booleans map onto their v2 equivalents", () => {
  const config = normalizeConfig(
    base({
      entity_id: "remote.main_tv",
      showRemote: false,
      showApps: false,
      showVolume: false,
      showMedia: false,
      showURLSearch: true,
    }),
  );
  assert.equal(config.show_nav, false);
  assert.equal(config.show_apps, false);
  assert.equal(config.show_volume, false);
  assert.equal(config.show_transport, false);
  assert.equal(config.show_text_input, true, "showURLSearch became the text field");
});

test("media_controls picks which transport buttons are drawn", () => {
  const config = normalizeConfig(
    base({ entity: "remote.atv", media_controls: ["play_pause", "next"] }),
  );
  assert.deepEqual(config.transport_buttons, ["play_pause", "next"]);
});

test("an unknown media_control is dropped rather than rendered blank", () => {
  const config = normalizeConfig(
    base({ entity: "remote.atv", media_controls: ["play_pause", "record"] }),
  );
  assert.deepEqual(config.transport_buttons, ["play_pause"]);
});

test("the author's live Main TV card migrates intact", () => {
  const config = normalizeConfig({
    type: TYPE,
    entity_id: "remote.main_tv",
    remote: "default",
    apps: [
      { icon: "mdi:apple", url: "https://tv.apple.com" },
      "netflix",
      { icon: "mdi:youtube", url: "https://www.youtube.com" },
      { icon: "mdi:movie", url: "https://play.max.com" },
      "disneyplus",
    ],
    power: IR("power"),
    volumedown: IR("volumedown"),
    volumeup: IR("volumeup"),
    volumemute: IR("mute"),
    showRemote: true,
    showBasic: true,
    showApps: true,
    showVolume: true,
    showMedia: true,
    media_controls: ["previous", "rewind", "play_pause", "fast_forward", "next"],
    showURLSearch: false,
  });

  assert.equal(config.entity, "remote.main_tv");
  assert.equal(config.pad, "buttons");
  assert.equal(config.show_apps, true);
  assert.equal(config.show_volume, true);
  assert.equal(config.show_transport, true);
  assert.equal(config.show_text_input, false);
  assert.deepEqual(config.transport_buttons, [
    "previous",
    "rewind",
    "play_pause",
    "fast_forward",
    "next",
  ]);

  // Five apps, in order, with the two brands resolved and three custom URLs.
  assert.equal(config.apps.length, 5);
  assert.equal(config.apps[0].action.activity, "https://tv.apple.com");
  assert.equal(config.apps[1].icon, "brand:netflix");
  assert.equal(config.apps[3].action.activity, "https://play.max.com");
  assert.equal(config.apps[4].icon, "brand:disneyplus");

  // The RF repeater keeps driving power and volume.
  assert.deepEqual(config.overrides.power, tap(IR("power")));
  assert.deepEqual(config.overrides.volume_up, tap(IR("volumeup")));
  assert.deepEqual(config.overrides.volume_down, tap(IR("volumedown")));
  assert.deepEqual(config.overrides.volume_mute, tap(IR("mute")));
});

test("the author's live Gym TV card keeps its URL search as a text field", () => {
  const config = normalizeConfig({
    type: TYPE,
    entity_id: "remote.gym_tv",
    remote: "default",
    apps: ["netflix"],
    showBasic: true,
    showRemote: true,
    showApps: true,
    showVolume: true,
    showMedia: true,
    media_controls: ["previous", "rewind", "play_pause", "fast_forward", "next"],
    showURLSearch: true,
  });
  assert.equal(config.show_text_input, true);
  // Gym TV has no volume override: it falls through to the TV itself.
  assert.equal(config.overrides.volume_up, undefined);
});

test("the author's live Media Room card keeps its Sofabaton volume codes", () => {
  const baton = (command) => ({
    service: "remote.send_command",
    data: { entity_id: "remote.media_room_baton_remote", device: "3", command },
  });
  const config = normalizeConfig({
    type: TYPE,
    entity_id: "remote.media_room_tv",
    remote: "default",
    apps: ["netflix"],
    volumeup: baton(32),
    volumedown: baton(31),
    volumemute: baton(28),
  });
  assert.deepEqual(config.overrides.volume_up, tap(baton(32)));
  assert.deepEqual(config.overrides.volume_down, tap(baton(31)));
  assert.deepEqual(config.overrides.volume_mute, tap(baton(28)));
});

test("branch keys are stripped when the editor writes back", () => {
  const stripped = stripLegacyKeys(
    normalizeConfig(base({ entity: "remote.atv", showURLSearch: true, showBasic: true })),
  );
  for (const key of ["showRemote", "showApps", "showVolume", "showMedia", "showURLSearch", "showBasic", "media_controls"]) {
    assert.equal(stripped[key], undefined, `${key} should not survive`);
  }
  assert.equal(stripped.show_text_input, true);
});

test("brandFor matches the names a TV actually reports", () => {
  // app_name is whatever the TV feels like calling the app, so matching is
  // normalised to letters: "Disney+" and "Prime Video" have to land.
  assert.equal(brandFor("Netflix"), "netflix");
  assert.equal(brandFor("Disney+"), "disneyplus");
  assert.equal(brandFor("Prime Video"), "prime");
  assert.equal(brandFor("HBO Max"), "hbomax");
  assert.equal(brandFor("YouTube"), "youtube");
  assert.equal(brandFor("hulu"), "hulu");
});

test("brandFor returns nothing rather than guessing", () => {
  for (const name of ["Plex", "", undefined, "   ", "12345"]) {
    assert.equal(brandFor(name), undefined, `${JSON.stringify(name)} should not match`);
  }
});

test("every brand id has a label and an activity", () => {
  // The logos live in a lit module that cannot load without a DOM; the harness
  // renders all six chips in the editor, which is where a missing one shows up.
  assert.ok(BRAND_IDS.length > 0);
  for (const id of BRAND_IDS) {
    assert.ok(BRANDS[id]?.label, `${id} has no label`);
    assert.ok(BRANDS[id]?.activity, `${id} has no activity`);
  }
});
