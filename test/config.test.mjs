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

/**
 * The sections of a resolved config.
 *
 * Sections used to be their own list; they are blocks of `layout` now, so that
 * one list is the whole answer to what a card draws and in what order. What
 * these tests assert about them -- normalisation, survival, malformed entries
 * dropped -- is unchanged, so they read the same things out of the new place.
 */
const sectionsOf = (config) => config.layout.filter((block) => block.type === "section");

/** Visible blocks, in the order the card draws them; sections by name. */
const orderOf = (config) =>
  config.layout.filter((block) => !block.hidden).map((block) => block.name ?? block.type);

/** Is this block drawn? What the five retired show_* flags now mean. */
const shows = (config, type) =>
  config.layout.some((block) => block.type === type && !block.hidden);

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

test("volume: false hides the volume block", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", volume: false }));
  assert.equal(shows(config, "volume"), false);
  // Hidden, not gone: the editor needs a row to turn it back on from.
  assert.equal(
    config.layout.some((block) => block.type === "volume"),
    true,
  );
});

test("volume defaults to shown, matching v1", () => {
  assert.equal(shows(normalizeConfig(base({ entity_id: "remote.atv" })), "volume"), true);
  assert.equal(
    shows(normalizeConfig(base({ entity_id: "remote.atv", volume: true })), "volume"),
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
  assert.equal(shows(config, "volume"), true);
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
  assert.equal(shows(config, "pad"), false);
  assert.equal(shows(config, "apps"), false);
  assert.equal(shows(config, "volume"), false);
  assert.equal(shows(config, "transport"), false);
  assert.equal(shows(config, "text"), true, "showURLSearch became the text field");
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
  assert.equal(shows(config, "apps"), true);
  assert.equal(shows(config, "volume"), true);
  assert.equal(shows(config, "transport"), true);
  assert.equal(shows(config, "text"), false);
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
  assert.equal(shows(config, "text"), true);
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
  // showURLSearch meant the text field, and that is what it still means.
  assert.equal(shows(stripped, "text"), true);
});

/* ------------------------------------------------------------------------ *
 * layout: one list for what a card draws, and in what order.
 *
 * The remote used to be pinned above everything a user could add, because the
 * template said so -- a receiver row could never sit above the d-pad however
 * the config was written.
 * ------------------------------------------------------------------------ */

test("without a layout the order is the one the card always drew", () => {
  const config = normalizeConfig(
    base({ entity: "remote.atv", sections: [{ name: "Home theater", buttons: [] }] }),
  );
  assert.deepEqual(orderOf(config), [
    "pad",
    "navigation",
    "transport",
    "volume",
    "Home theater",
    "apps",
  ]);
});

test("a layout puts the blocks where it says, sections included", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      layout: [
        { type: "section", name: "Home theater", buttons: [{ icon: "mdi:power", url: "x" }] },
        "volume",
        "pad",
        "apps",
      ],
    }),
  );
  assert.deepEqual(orderOf(config), ["Home theater", "volume", "pad", "apps"]);
  assert.equal(sectionsOf(config)[0].buttons.length, 1, "its buttons normalise as ever");
});

test("a block the layout leaves out is hidden, and lands at the end to be found", () => {
  const config = normalizeConfig(base({ entity: "remote.atv", layout: ["volume"] }));
  assert.deepEqual(orderOf(config), ["volume"]);
  // Every built-in is still in the list: a list of only what is on cannot
  // offer to turn anything back on.
  assert.deepEqual(
    config.layout.map((block) => block.type),
    ["volume", "pad", "navigation", "transport", "text", "apps"],
  );
  assert.equal(config.layout.filter((block) => block.hidden).length, 5);
});

test("hidden keeps its place rather than dropping out of the list", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      layout: ["volume", { type: "pad", hidden: true }, "navigation"],
    }),
  );
  assert.deepEqual(orderOf(config), ["volume", "navigation"]);
  assert.equal(config.layout[1].type, "pad", "still second, so showing it puts it back here");
});

test("a layout is the whole answer: the old flags do not argue with it", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      show_volume: false,
      show_apps: false,
      layout: ["volume", "apps"],
    }),
  );
  assert.deepEqual(orderOf(config), ["volume", "apps"]);
});

test("sections are ignored once a layout exists, so nothing renders twice", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      sections: [{ name: "Old", buttons: [] }],
      layout: [{ type: "section", name: "New", buttons: [] }],
    }),
  );
  assert.deepEqual(
    sectionsOf(config).map((section) => section.name),
    ["New"],
  );
});

test("a bare section object in a layout is read as one", () => {
  // The `sections:` shape pasted straight into a layout, with no type: key.
  const config = normalizeConfig(
    base({ entity: "remote.atv", layout: [{ name: "Pasted", buttons: [] }, "apps"] }),
  );
  assert.deepEqual(orderOf(config), ["Pasted", "apps"]);
});

test("a block named twice is drawn once", () => {
  _resetWarnings();
  const config = normalizeConfig(
    base({ entity: "remote.atv", layout: ["volume", "volume", "apps"] }),
  );
  assert.deepEqual(orderOf(config), ["volume", "apps"]);
});

test("junk in a layout is skipped, not fatal", () => {
  _resetWarnings();
  const config = normalizeConfig(
    base({ entity: "remote.atv", layout: ["volume", "nonsense", 7, { type: "wat" }] }),
  );
  assert.deepEqual(orderOf(config), ["volume"]);
});

test("a layout survives the round-trip HA performs on every edit", () => {
  const before = normalizeConfig(
    base({ entity: "remote.atv", layout: ["volume", "pad", { type: "section", name: "A", buttons: [] }] }),
  );
  const after = normalizeConfig(stripLegacyKeys(before));
  assert.deepEqual(orderOf(after), orderOf(before));
  assert.deepEqual(orderOf(normalizeConfig(stripLegacyKeys(after))), orderOf(before));
});

test("any block can carry a name", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      layout: [
        { type: "volume", name: "Sound" },
        { type: "pad", name: "" },
        { type: "section", name: "Home theater", buttons: [] },
        "apps",
      ],
    }),
  );
  const names = config.layout.map((block) => block.name);
  assert.equal(names[0], "Sound");
  assert.equal(names[1], undefined, "an empty name is no name");
  assert.equal(names[2], "Home theater");
  assert.equal(names[3], undefined);
  assert.equal(sectionsOf(config)[0].buttons.length, 0, "and nothing else moved");
});

test("title, which only ever reached a beta, is read as the name it became", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      layout: [
        { type: "volume", title: "Sound" },
        { type: "section", title: "Home theater", buttons: [] },
      ],
    }),
  );
  assert.equal(config.layout[0].name, "Sound");
  assert.equal(sectionsOf(config)[0].name, "Home theater");
  assert.equal(config.layout[0].title, undefined, "and does not come back out");
});

test("a section's own name wins over a title beside it", () => {
  // Both spellings in one block can only come from a beta config that was
  // edited by hand. The one with history behind it is the one that survives.
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      layout: [{ type: "section", name: "Home theater", title: "Theater", buttons: [] }],
    }),
  );
  assert.equal(sectionsOf(config)[0].name, "Home theater");
});

test("a name survives the round-trip HA performs", () => {
  const before = normalizeConfig(
    base({ entity: "remote.atv", layout: [{ type: "volume", name: "Sound" }] }),
  );
  const after = normalizeConfig(stripLegacyKeys(before));
  assert.equal(after.layout[0].name, "Sound");
});

test("sections keep the name they were written with, untouched", () => {
  // The oldest spelling in the config: `sections:` with names, from before
  // layout existed. Nothing here may lose that value.
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      show_section_labels: true,
      sections: [{ name: "Home theater", buttons: [] }],
    }),
  );
  assert.equal(sectionsOf(config)[0].name, "Home theater");
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

/* ------------------------------------------------------------------------ *
 * Custom sections.
 *
 * The app launcher is the built-in one; these are user-defined rows of the same
 * tiles. Motivated by a home theatre whose power is four separate controls, one
 * of which (an IR-only soundbar) has no entity at all.
 * ------------------------------------------------------------------------ */

test("a section normalises its buttons like apps, keeping entity", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.media_room_tv",
      sections: [
        {
          name: "Home theater",
          buttons: [
            {
              name: "Movie mode",
              icon: "mdi:theater",
              entity: "select.media_room_baton_activity",
              action: {
                action: "service",
                service: "select.select_option",
                target: { entity_id: "select.media_room_baton_activity" },
                data: { option: "Google TV" },
              },
            },
            // No entity: an IR command has no state to read.
            { name: "Soundbar", icon: "mdi:soundbar", url: "IR" },
          ],
        },
      ],
    }),
  );

  const sections = sectionsOf(config);
  assert.equal(sections.length, 1);
  assert.equal(sections[0].name, "Home theater");
  assert.equal(sections[0].buttons.length, 2);
  assert.equal(sections[0].buttons[0].entity, "select.media_room_baton_activity");
  assert.equal(sections[0].buttons[1].entity, undefined);
  assert.equal(sections[0].buttons[1].action.activity, "IR");
});

test("an empty section survives normalisation", () => {
  // The bug this exists to prevent: "Add section" in the editor emits a section
  // with no buttons yet, HA hands the config straight back through setConfig,
  // and dropping empties here deleted it before it could be filled — so the
  // button appeared to do nothing at all.
  const config = normalizeConfig(
    base({ entity: "remote.atv", sections: [{ name: "New section", buttons: [] }] }),
  );
  assert.equal(sectionsOf(config).length, 1);
  assert.deepEqual(sectionsOf(config)[0], { type: "section", name: "New section", buttons: [] });
});

test("adding a section in the editor survives the round-trip HA performs", () => {
  // setConfig -> emit -> setConfig is exactly what happens on every edit.
  const before = normalizeConfig(base({ entity: "remote.atv" }));
  const emitted = stripLegacyKeys({
    ...before,
    layout: [...before.layout, { type: "section", name: "New section", buttons: [] }],
  });
  const after = normalizeConfig(emitted);
  assert.equal(sectionsOf(after).length, 1, "the new section must still be there");

  // And again, since the editor re-emits on every subsequent keystroke.
  assert.equal(sectionsOf(normalizeConfig(stripLegacyKeys(after))).length, 1);
});

test("malformed sections and buttons are still dropped", () => {
  _resetWarnings();
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      sections: [
        { name: "Keeps good buttons", buttons: [{ name: "nope" }, { icon: "mdi:power", url: "x" }] },
        "not an object",
      ],
    }),
  );
  assert.equal(sectionsOf(config).length, 1);
  assert.equal(sectionsOf(config)[0].buttons.length, 1, "the malformed button is gone");
});

test("absent sections yield an empty list", () => {
  assert.deepEqual(sectionsOf(normalizeConfig(base({ entity: "remote.atv" }))), []);
});

test("a section may override columns, otherwise it inherits app_columns", () => {
  const config = normalizeConfig(
    base({
      entity: "remote.atv",
      app_columns: 4,
      sections: [
        { name: "A", columns: 2, buttons: [{ icon: "mdi:power", url: "x" }] },
        { name: "B", buttons: [{ icon: "mdi:power", url: "x" }] },
      ],
    }),
  );
  assert.equal(sectionsOf(config)[0].columns, 2);
  assert.equal(sectionsOf(config)[1].columns, undefined, "falls back at render time");
  assert.equal(config.app_columns, 4);
});

test("sections survive stripLegacyKeys, as layout blocks", () => {
  const stripped = stripLegacyKeys(
    normalizeConfig(
      base({ entity: "remote.atv", sections: [{ name: "A", buttons: [{ icon: "mdi:power", url: "x" }] }] }),
    ),
  );
  assert.equal(sectionsOf(stripped).length, 1);
  assert.equal(stripped.sections, undefined, "the input spelling does not come back out");
});
