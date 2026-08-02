/**
 * Home Assistant's action vocabulary.
 *
 * This is the layer every override and every app tile funnels through, and it
 * was the largest untested surface in the card: only `perform-action` was
 * exercised, and only indirectly through pressButton. The rest -- navigate,
 * url, toggle, more-info, none, and the legacy `call-service` spelling -- had
 * no coverage at all despite being reachable from the editor's own selector.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  isActionConfig,
  isActionable,
  runAction,
  serviceAction,
  splitService,
} from "./.build/actions.mjs";

/** A hass double that records every service call. */
const makeHass = () => {
  const calls = [];
  return {
    calls,
    callService(domain, service, data, target) {
      calls.push({ domain, service, data, target });
      return Promise.resolve({ context: { id: "test" } });
    },
  };
};

/** An element double that records dispatched events. */
const makeNode = () => {
  const events = [];
  return {
    events,
    dispatchEvent(event) {
      events.push({ type: event.type, detail: event.detail });
      return true;
    },
  };
};

/* ----------------------------------------------------------------- guards -- */

test("isActionConfig accepts only objects carrying an action", () => {
  assert.equal(isActionConfig({ action: "toggle" }), true);
  assert.equal(isActionConfig({ service: "script.x" }), false);
  assert.equal(isActionConfig("toggle"), false);
  assert.equal(isActionConfig(null), false);
  assert.equal(isActionConfig([{ action: "toggle" }]), false);
});

test("action: none is a valid config but not an actionable one", () => {
  // The distinction matters: `none` must suppress a button's default rather
  // than be treated as "nothing configured, carry on".
  assert.equal(isActionConfig({ action: "none" }), true);
  assert.equal(isActionable({ action: "none" }), false);
  assert.equal(isActionable(undefined), false);
  assert.equal(isActionable({ action: "toggle" }), true);
});

test("serviceAction omits empty data and target rather than sending them", () => {
  assert.deepEqual(serviceAction("button.press"), {
    action: "perform-action",
    perform_action: "button.press",
  });
  assert.deepEqual(serviceAction("script.x", { a: 1 }, { entity_id: "script.x" }), {
    action: "perform-action",
    perform_action: "script.x",
    data: { a: 1 },
    target: { entity_id: "script.x" },
  });
});

/* ---------------------------------------------------------------- running -- */

test("perform-action calls the named service", async () => {
  const hass = makeHass();
  await runAction(makeNode(), hass, {
    action: "perform-action",
    perform_action: "remote.send_command",
    data: { command: "POWER" },
    target: { entity_id: "remote.tv" },
  });
  assert.deepEqual(hass.calls[0], {
    domain: "remote",
    service: "send_command",
    data: { command: "POWER" },
    target: { entity_id: "remote.tv" },
  });
});

test("the legacy call-service spelling still works", async () => {
  // Pre-2024.8 configs use `service` and `service_data`. HA still accepts them,
  // so anything copied from an old blueprint or forum post must keep working.
  const hass = makeHass();
  await runAction(makeNode(), hass, {
    action: "call-service",
    service: "script.movie_night",
    service_data: { brightness: 10 },
  });
  assert.deepEqual(hass.calls[0], {
    domain: "script",
    service: "movie_night",
    data: { brightness: 10 },
    target: undefined,
  });
});

test("call-service prefers data over service_data when both are present", async () => {
  const hass = makeHass();
  await runAction(makeNode(), hass, {
    action: "call-service",
    service: "script.x",
    data: { new: true },
    service_data: { old: true },
  });
  assert.deepEqual(hass.calls[0].data, { new: true });
});

test("a malformed service name rejects rather than calling something wrong", async () => {
  const hass = makeHass();
  for (const name of ["oops", "", "too.many.parts."]) {
    await assert.rejects(
      () => runAction(makeNode(), hass, { action: "perform-action", perform_action: name }),
      /invalid action/,
      `"${name}" should be refused`,
    );
  }
  assert.equal(hass.calls.length, 0);
});

test("action: none does nothing at all", async () => {
  const hass = makeHass();
  const node = makeNode();
  await runAction(node, hass, { action: "none" });
  assert.equal(hass.calls.length, 0);
  assert.equal(node.events.length, 0);
});

test("toggle acts on the fallback entity", async () => {
  const hass = makeHass();
  await runAction(makeNode(), hass, { action: "toggle" }, "remote.tv");
  assert.deepEqual(hass.calls[0], {
    domain: "homeassistant",
    service: "toggle",
    data: { entity_id: "remote.tv" },
    target: undefined,
  });
});

test("toggle with no entity to act on is a no-op, not a crash", async () => {
  const hass = makeHass();
  await runAction(makeNode(), hass, { action: "toggle" });
  assert.equal(hass.calls.length, 0);
});

test("more-info opens the dialog for its entity, else the fallback", async () => {
  const hass = makeHass();

  const explicit = makeNode();
  await runAction(explicit, hass, { action: "more-info", entity: "light.lamp" }, "remote.tv");
  assert.deepEqual(explicit.events[0], {
    type: "hass-more-info",
    detail: { entityId: "light.lamp" },
  });

  const fallback = makeNode();
  await runAction(fallback, hass, { action: "more-info" }, "remote.tv");
  assert.equal(fallback.events[0].detail.entityId, "remote.tv");
});

test("more-info without an element is a no-op rather than a throw", async () => {
  // runAction takes an optional node precisely so an override is never skipped
  // for want of one; the dialog is the only thing that actually needs it.
  await runAction(undefined, makeHass(), { action: "more-info" }, "remote.tv");
});

test("navigate pushes history and tells the router", async () => {
  const pushed = [];
  const dispatched = [];
  const priorHistory = globalThis.history;
  const priorWindow = globalThis.window;
  globalThis.history = { pushState: (_s, _t, path) => pushed.push(path) };
  globalThis.window = { dispatchEvent: (e) => dispatched.push(e.type) };
  globalThis.CustomEvent ??= class {
    constructor(type, init) {
      this.type = type;
      Object.assign(this, init);
    }
  };

  try {
    await runAction(makeNode(), makeHass(), {
      action: "navigate",
      navigation_path: "/lovelace/tv",
    });
    assert.deepEqual(pushed, ["/lovelace/tv"]);
    // HA's router listens on window, so the event cannot go through the element.
    assert.deepEqual(dispatched, ["location-changed"]);
  } finally {
    globalThis.history = priorHistory;
    globalThis.window = priorWindow;
  }
});

test("url opens in a new tab without leaking the referrer", async () => {
  const opened = [];
  const priorWindow = globalThis.window;
  globalThis.window = { open: (...args) => opened.push(args) };
  try {
    await runAction(makeNode(), makeHass(), {
      action: "url",
      url_path: "https://example.com",
    });
    assert.deepEqual(opened, [["https://example.com", "_blank", "noreferrer"]]);
  } finally {
    globalThis.window = priorWindow;
  }
});

test("splitService accepts only domain.service", () => {
  assert.deepEqual(splitService("remote.send_command"), ["remote", "send_command"]);
  for (const bad of ["oops", "", ".", "a.", ".b", "a.b.c", "a.b.c.", undefined]) {
    assert.equal(splitService(bad), null, `${JSON.stringify(bad)} should be refused`);
  }
});
