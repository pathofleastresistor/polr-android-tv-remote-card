/**
 * Fail on exports nothing imports.
 *
 * tsc's noUnusedLocals stops at the module boundary, so an export whose last
 * caller goes away keeps compiling and keeps shipping. Custom elements and the
 * card's own entry points are exported for their side effects rather than to be
 * imported, so they are allowed.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "src";
/** Exported to be registered or read by Home Assistant, not by us. */
const ALLOWED = new Set([
  "CARD_VERSION",
  "PolrAndroidTvRemoteCard",
  "PolrAndroidTvRemoteCardEditor",
  "PolrAtvNavPad",
  "NavDirection",
]);

const files = readdirSync(SRC)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => join(SRC, f));
const sources = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));
const tests = readdirSync("test")
  .filter((f) => f.endsWith(".mjs"))
  .map((f) => readFileSync(join("test", f), "utf8"))
  .join("\n");

const unused = [];
for (const [file, text] of sources) {
  const exported = [...text.matchAll(/^export (?:const|function|class|type|interface) (\w+)/gm)]
    .map((m) => m[1])
    .filter((name) => !ALLOWED.has(name));

  for (const name of exported) {
    const used = [...sources]
      .filter(([other]) => other !== file)
      .some(([, other]) => new RegExp(`\\b${name}\\b`).test(other));
    if (!used && !new RegExp(`\\b${name}\\b`).test(tests)) {
      unused.push(`${file}: ${name}`);
    }
  }
}

if (unused.length) {
  console.error("Exports with no importer and no test:\n  " + unused.join("\n  "));
  process.exit(1);
}
console.log("no unreferenced exports");
