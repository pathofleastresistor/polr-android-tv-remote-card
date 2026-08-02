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

  const file = resolve(outDir, dark ? "dark.png" : "light.png");
  await page.screenshot({ path: file, fullPage: true });
  console.log(`wrote ${file}`);
  await page.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
