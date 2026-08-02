/**
 * One test per row of the v1 -> v2 mapping table in the README.
 *
 * This file is the safety net for everyone still running a 2023 config,
 * including the author, whose live dashboard is v1. A failure here means
 * somebody's remote stopped working.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { BRANDS, DEFAULTS, balancedColumns, normalizeConfig, stripLegacyKeys, _resetWarnings } from "./.build/config.mjs";

const TYPE = "custom:polr-android-tv-remote-card";
const base = (extra) => ({ type: TYPE, ...extra });

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

test("remote: default maps to the buttons pad with no separate nav row", () => {
  // v1's default pad already inlined power/home/back/favorite, so adding a
  // navigation row would duplicate them.
  const config = normalizeConfig(base({ entity_id: "remote.atv", remote: "default" }));
  assert.equal(config.pad, "buttons");
  assert.equal(config.show_navigation_row, false);
});

test("an absent remote key is treated as default", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv" }));
  assert.equal(config.pad, DEFAULTS.pad);
  assert.equal(config.show_navigation_row, true);
});

test("remote: touch maps to the touchpad, with the nav row v1 drew", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", remote: "touch" }));
  assert.equal(config.pad, "touchpad");
  assert.equal(config.show_navigation_row, true);
});

test("remote: dpad maps to the dpad", () => {
  const config = normalizeConfig(base({ entity_id: "remote.atv", remote: "dpad" }));
  assert.equal(config.pad, "dpad");
  assert.equal(config.show_navigation_row, true);
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
    assert.deepEqual(config.overrides[id], call(id), `override ${id}`);
  }
  assert.deepEqual(config.overrides.favorite, call("fav"));
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
  assert.deepEqual(config.overrides.volume_up, call("volumeup"));
  assert.deepEqual(config.overrides.volume_down, call("volumedown"));
  assert.deepEqual(config.overrides.volume_mute, call("volumemute"));
});

test("an explicit v2 override wins over the v1 key of the same button", () => {
  const config = normalizeConfig(
    base({
      entity_id: "remote.atv",
      volumeup: { service: "script.old" },
      overrides: { volume_up: { service: "script.new" } },
    }),
  );
  assert.deepEqual(config.overrides.volume_up, { service: "script.new" });
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
  assert.deepEqual(config.overrides.power, ir("power"));
  assert.deepEqual(config.overrides.volume_up, ir("volumeup"));
  assert.deepEqual(config.overrides.volume_down, ir("volumedown"));
  // volumemute was not overridden, so the card handles it itself.
  assert.equal(config.overrides.volume_mute, undefined);
});

test("app columns balance instead of stranding a tile on its own row", () => {
  // The failure this exists to prevent: six apps laid out as five plus one.
  assert.equal(balancedColumns(6), 3);
  assert.equal(balancedColumns(8), 4);
  assert.equal(balancedColumns(1), 1);
  assert.equal(balancedColumns(4), 4);
  assert.equal(balancedColumns(5), 5);
  assert.equal(balancedColumns(10), 5);
  assert.equal(balancedColumns(12), 4);
  for (let n = 1; n <= 24; n += 1) {
    assert.ok(balancedColumns(n) <= 5, `n=${n} exceeds the 5-column cap`);
  }
});
