/**
 * The press controller, driven through the real controls it is wired to.
 *
 *   node test/harness/press.mjs
 *
 * src/press.ts is the most stateful code in the card and the least visible when
 * it goes wrong: a button that repeats when it should not, or a tap swallowed
 * by the double-tap window, reads as a flaky remote rather than as a bug. The
 * scroll-versus-tap failure that prompted the code was reported from the field,
 * not caught by a test.
 *
 * Nothing here reaches into the directive. Every case dispatches the events a
 * thumb or a keyboard really produces, at a real button in the harness, and
 * reads back what the card asked Home Assistant to do -- so a press that stops
 * reaching its service call fails here even if the state machine is immaculate.
 *
 * Time is faked rather than waited out: the directive schedules through
 * `window.setTimeout` and `window.setInterval`, so replacing those lets a
 * forty-repeat hold resolve at once and identically every run. Waiting it out
 * would put ten seconds into CI and still race on a loaded runner.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import puppeteer from "puppeteer";

const here = dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--allow-file-access-from-files", "--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 1200 });

let failed = false;
page.on("pageerror", (error) => {
  failed = true;
  console.error(`[pageerror] ${error.message}`);
});

await page.goto(pathToFileURL(resolve(here, "index.html")).href, {
  waitUntil: "networkidle0",
});
await page.waitForFunction(() => document.title === "ready", { timeout: 10_000 });

/**
 * A fake clock, and the vocabulary the cases are written in.
 *
 * Installed inside the page rather than passed in, because the directive reads
 * `window.setTimeout` at the moment it schedules -- which is after this runs.
 */
await page.evaluate(() => {
  // Kept before the clock is replaced: the test runner still needs a real one
  // to let the page breathe between cases.
  const realSetTimeout = window.setTimeout.bind(window);
  window.__settle = () => new Promise((done) => realSetTimeout(done, 0));

  const clock = { now: 0, seq: 0, timers: new Map() };

  window.setTimeout = (fn, ms = 0) => {
    const id = ++clock.seq;
    clock.timers.set(id, { at: clock.now + ms, fn, every: null });
    return id;
  };
  window.setInterval = (fn, ms = 0) => {
    const id = ++clock.seq;
    clock.timers.set(id, { at: clock.now + ms, fn, every: ms });
    return id;
  };
  window.clearTimeout = (id) => clock.timers.delete(id);
  window.clearInterval = (id) => clock.timers.delete(id);

  /**
   * Run every timer due within `ms`, in time order, as a browser would.
   *
   * Awaits between callbacks so queued microtasks run, which matters more than
   * it looks: the directive clears its in-flight guard on a microtask, so a
   * clock that fired forty repeats in one synchronous burst would see thirty-
   * nine of them coalesced and prove nothing.
   */
  window.__tick = async (ms) => {
    const until = clock.now + ms;
    for (;;) {
      let next = null;
      for (const [id, timer] of clock.timers) {
        if (timer.at <= until && (next === null || timer.at < next[1].at)) {
          next = [id, timer];
        }
      }
      if (!next) break;
      const [id, timer] = next;
      clock.now = timer.at;
      if (timer.every === null) clock.timers.delete(id);
      else timer.at = clock.now + timer.every;
      timer.fn();
      await null;
    }
    clock.now = until;
  };

  /** A control of the card in the named harness case, by its accessible name. */
  window.__control = (title, label) => {
    const kase = [...document.querySelectorAll(".case")].find(
      (c) => c.querySelector("h2")?.textContent === title,
    );
    if (!kase) throw new Error(`no harness case "${title}"`);
    const card = kase.querySelector("polr-android-tv-remote-card");
    const found = [...card.shadowRoot.querySelectorAll("button")].find(
      (el) => (el.getAttribute("aria-label") ?? "") === label,
    );
    if (!found) throw new Error(`no control "${label}" in "${title}"`);
    return found;
  };

  window.__send = (el, type, { dx = 0, dy = 0, button = 0 } = {}) => {
    const box = el.getBoundingClientRect();
    el.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        composed: true,
        cancelable: true,
        clientX: box.left + box.width / 2 + dx,
        clientY: box.top + box.height / 2 + dy,
        button,
        pointerId: 1,
        pointerType: "touch",
      }),
    );
  };

  window.__key = (el, type, { key = "Enter", repeat = false } = {}) => {
    el.dispatchEvent(
      new KeyboardEvent(type, {
        bubbles: true,
        composed: true,
        cancelable: true,
        key,
        repeat,
      }),
    );
  };

  /** What the card has asked of Home Assistant since the last reset. */
  window.__sent = () =>
    (window.__calls ?? []).map(([domain, service]) => `${domain}.${service}`);
  window.__reset = () => {
    window.__calls = [];
  };
});

const results = [];

/**
 * One case.
 *
 * `body` runs inside the page with the harness case title as its argument, and
 * returns what was recorded; `want` is compared as JSON so a mismatch prints
 * both sides.
 */
const check = async (name, title, body, want) => {
  await page.evaluate(() => window.__reset());
  let got;
  try {
    got = await page.evaluate(body, title);
  } catch (error) {
    got = `threw: ${error.message}`;
  }
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) {
    failed = true;
    console.error(
      `[press] ${name}\n  want ${JSON.stringify(want)}\n  got  ${JSON.stringify(got)}`,
    );
  }
  results.push({ name, ok });
  // Real time, so the in-flight guard from the last case cannot leak into the
  // next one and swallow its first press.
  await page.evaluate(() => window.__settle());
};

/** A plain card: volume up taps, volume down repeats, nothing else is wired. */
const PLAIN = "buttons + apps";
/** The same card with a hold action on volume up and a double tap on home. */
const GESTURES = "gestures: hold and double tap";

/* ------------------------------------------------------------------ taps -- */

await check(
  "a tap fires on release, not on touch",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume up");
    window.__send(el, "pointerdown");
    const onDown = window.__sent().length;
    window.__send(el, "pointerup");
    return { onDown, afterRelease: window.__sent().length };
  },
  { onDown: 0, afterRelease: 1 },
);

await check(
  "presses from one tick are coalesced, so a slow websocket cannot be flooded",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume up");
    for (let i = 0; i < 3; i += 1) {
      window.__send(el, "pointerdown");
      window.__send(el, "pointerup");
    }
    return window.__sent().length;
  },
  1,
);

await check(
  "the browser claiming the gesture for a scroll abandons the press",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume up");
    window.__send(el, "pointerdown");
    window.__send(el, "pointercancel");
    window.__send(el, "pointerup");
    await window.__tick(2000);
    return window.__sent().length;
  },
  0,
);

await check(
  "a right-click does not drive the TV",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume up");
    window.__send(el, "pointerdown", { button: 2 });
    window.__send(el, "pointerup", { button: 2 });
    await window.__tick(2000);
    return window.__sent().length;
  },
  0,
);

/* ------------------------------------------------------------------ hold -- */

await check(
  "a hold past the threshold fires the hold action and suppresses the tap",
  GESTURES,
  async (title) => {
    const el = window.__control(title, "Volume up");
    window.__send(el, "pointerdown");
    await window.__tick(500);
    const atThreshold = window.__sent();
    window.__send(el, "pointerup");
    return { atThreshold, afterRelease: window.__sent() };
  },
  { atThreshold: ["script.held"], afterRelease: ["script.held"] },
);

await check(
  "releasing a moment before the threshold is a tap, and never the hold",
  GESTURES,
  async (title) => {
    const el = window.__control(title, "Volume up");
    window.__send(el, "pointerdown");
    await window.__tick(499);
    const beforeRelease = window.__sent();
    window.__send(el, "pointerup");
    await window.__tick(2000);
    return { beforeRelease, after: window.__sent() };
  },
  { beforeRelease: [], after: ["media_player.volume_up"] },
);

await check(
  "a press dragged off the button fires nothing, however long it is held",
  GESTURES,
  async (title) => {
    const el = window.__control(title, "Volume up");
    window.__send(el, "pointerdown");
    window.__send(el, "pointermove", { dy: 40 });
    await window.__tick(2000);
    window.__send(el, "pointerup");
    return window.__sent().length;
  },
  0,
);

/* ------------------------------------------------------------ double tap -- */

await check(
  "a double tap fires the double-tap action once, and no single tap",
  GESTURES,
  async (title) => {
    const el = window.__control(title, "Home");
    window.__send(el, "pointerdown");
    window.__send(el, "pointerup");
    await window.__tick(100);
    window.__send(el, "pointerdown");
    window.__send(el, "pointerup");
    await window.__tick(2000);
    return window.__sent();
  },
  ["script.double"],
);

await check(
  "a single tap on that same button still lands, once the window has passed",
  GESTURES,
  async (title) => {
    const el = window.__control(title, "Home");
    window.__send(el, "pointerdown");
    window.__send(el, "pointerup");
    const beforeWindow = window.__sent();
    await window.__tick(250);
    return { beforeWindow, after: window.__sent() };
  },
  { beforeWindow: [], after: ["remote.send_command"] },
);

/* ---------------------------------------------------------------- repeat -- */

await check(
  "holding a repeat button fires once at the delay, then every interval",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume down");
    window.__send(el, "pointerdown");
    await window.__tick(499);
    const beforeDelay = window.__sent().length;
    await window.__tick(1);
    const atDelay = window.__sent().length;
    await window.__tick(220 * 3);
    const afterThree = window.__sent().length;
    window.__send(el, "pointerup");
    await window.__tick(2000);
    return { beforeDelay, atDelay, afterThree, afterRelease: window.__sent().length };
  },
  { beforeDelay: 0, atDelay: 1, afterThree: 4, afterRelease: 4 },
);

await check(
  "repeat stops at its backstop rather than flooding while a pointer is stuck",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume down");
    window.__send(el, "pointerdown");
    // Room for two hundred intervals; the cap is what ends it, not the clock.
    await window.__tick(500 + 220 * 200);
    return window.__sent().length;
  },
  // The press at the delay, then MAX_REPEATS of them.
  41,
);

await check(
  "a repeat button released early is an ordinary tap",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume down");
    window.__send(el, "pointerdown");
    await window.__tick(200);
    window.__send(el, "pointerup");
    await window.__tick(2000);
    return window.__sent().length;
  },
  1,
);

/* -------------------------------------------------------------- keyboard -- */

await check(
  "Enter fires at once: a key press cannot turn into a scroll",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume up");
    window.__key(el, "keydown");
    const onDown = window.__sent().length;
    window.__key(el, "keyup");
    return { onDown, afterRelease: window.__sent().length };
  },
  { onDown: 1, afterRelease: 1 },
);

await check(
  "the OS key-repeat stream does not multiply presses",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume up");
    window.__key(el, "keydown");
    for (let i = 0; i < 10; i += 1) {
      // A microtask between each, or the in-flight guard coalesces them and
      // the case passes without the repeat guard doing anything at all. It
      // did exactly that until a mutant with no guard still went green.
      await null;
      window.__key(el, "keydown", { repeat: true });
    }
    window.__key(el, "keyup");
    return window.__sent().length;
  },
  1,
);

await check(
  "a held key repeats on the card's own cadence, and stops on release",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume down");
    window.__key(el, "keydown");
    const immediate = window.__sent().length;
    await window.__tick(500 + 220 * 2);
    const held = window.__sent().length;
    window.__key(el, "keyup");
    await window.__tick(2000);
    return { immediate, held, afterRelease: window.__sent().length };
  },
  { immediate: 1, held: 3, afterRelease: 3 },
);

await check(
  "a key that is neither Enter nor Space does nothing",
  PLAIN,
  async (title) => {
    const el = window.__control(title, "Volume up");
    window.__key(el, "keydown", { key: "a" });
    window.__key(el, "keyup", { key: "a" });
    return window.__sent().length;
  },
  0,
);

const passed = results.filter((r) => r.ok).length;
console.log(
  failed
    ? `press: ${passed}/${results.length} cases`
    : `press: ${results.length} cases — taps, hold, double tap, repeat, keyboard`,
);

await browser.close();
process.exit(failed ? 1 : 0);
