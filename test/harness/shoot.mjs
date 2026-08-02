/**
 * Screenshot the harness in light and dark, and report console errors.
 *
 *   node test/harness/shoot.mjs [outdir]
 *
 * Not part of `npm test` — it needs a browser. It exists because a remote is a
 * layout-heavy card: unit tests can prove which service a button calls, but
 * only a picture proves the d-pad is round and the app grid is not stranding
 * two tiles in a quarter of the card.
 */

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import puppeteer from "puppeteer";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(process.argv[2] ?? resolve(here, "shots"));
mkdirSync(outDir, { recursive: true });

const page_url = (dark) =>
  `${pathToFileURL(resolve(here, "index.html")).href}${dark ? "?dark" : ""}`;

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--allow-file-access-from-files", "--no-sandbox"],
});

let failed = false;
for (const dark of [false, true]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1200, deviceScaleFactor: 2 });

  page.on("console", (message) => {
    if (message.type() === "error") {
      failed = true;
      console.error(`[console.error] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    failed = true;
    console.error(`[pageerror] ${error.message}`);
  });

  await page.goto(page_url(dark), { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.title === "ready", { timeout: 10_000 });

  // The v1 bug this guards against: getConfigElement() returned an element
  // that was never defined, so HA's editor rendered an empty box. Nothing in
  // the type system catches it — the tag name is a string.
  const checks = await page.evaluate(() => {
    const card = customElements.get("polr-android-tv-remote-card");
    const editorTag = card
      .getConfigElement()
      .tagName.toLowerCase();
    return {
      cardDefined: Boolean(card),
      editorTag,
      editorDefined: Boolean(customElements.get(editorTag)),
      stubHasEntity: Boolean(card.getStubConfig({ states: { "remote.a": {} } }).entity),
      padDefined: Boolean(customElements.get("polr-atv-nav-pad")),
    };
  });
  for (const [name, ok] of Object.entries(checks)) {
    if (ok === false) {
      failed = true;
      console.error(`[check] ${name} failed`);
    }
  }
  if (!checks.editorDefined) {
    console.error(`[check] <${checks.editorTag}> is not a defined custom element`);
  }

  // Gestures: a tap must fire, a scroll across a button must not. Only worth
  // running once; the check is behavioural, not visual.
  if (!dark) {
    const gestures = await page.evaluate(async () => {
      const card = document.querySelector("polr-android-tv-remote-card");
      const tile = card.shadowRoot.querySelector(".app-tile");
      const box = tile.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      const send = (type, cx, cy) =>
        tile.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true, composed: true, cancelable: true,
            clientX: cx, clientY: cy, button: 0, pointerId: 1, pointerType: "touch",
          }),
        );
      const settle = () => new Promise((r) => setTimeout(r, 60));

      window.__calls = [];
      send("pointerdown", x, y);
      send("pointerup", x, y);
      await settle();
      const onTap = window.__calls.length;

      // A thumb landing on the tile and dragging up the page to scroll.
      window.__calls = [];
      send("pointerdown", x, y);
      send("pointermove", x, y - 40);
      send("pointerup", x, y - 40);
      await settle();
      const onScroll = window.__calls.length;

      // The browser taking the gesture over for scrolling mid-press.
      window.__calls = [];
      send("pointerdown", x, y);
      send("pointercancel", x, y);
      send("pointerup", x, y);
      await settle();
      const onCancel = window.__calls.length;

      return { onTap, onScroll, onCancel };
    });

    for (const [name, actual, want] of [
      ["a tap", gestures.onTap, 1],
      ["scrolling across a button", gestures.onScroll, 0],
      ["a cancelled press", gestures.onCancel, 0],
    ]) {
      if (actual !== want) {
        failed = true;
        console.error(`[gesture] ${name} should send ${want} call(s), sent ${actual}`);
      }
    }
    console.log(
      `gestures: tap=${gestures.onTap} scroll=${gestures.onScroll} cancel=${gestures.onCancel}`,
    );
  }

  const file = resolve(outDir, dark ? "dark.png" : "light.png");
  await page.screenshot({ path: file, fullPage: true });
  console.log(`wrote ${file}`);
  await page.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
