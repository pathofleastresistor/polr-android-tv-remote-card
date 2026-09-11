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

    // The off-state "Turn on" button is a second entry point to power, and must
    // honour a power override exactly as the header button does — otherwise a
    // blaster-driven TV turns on through the wrong path.
    const power = await page.evaluate(async () => {
      const kase = [...document.querySelectorAll(".case")].find(
        (c) => c.querySelector("h2")?.textContent === "TV off + power override",
      );
      const card = kase.querySelector("polr-android-tv-remote-card");
      const btn = [...card.shadowRoot.querySelectorAll(".control-button")].find((b) =>
        b.textContent.includes("Turn on"),
      );
      if (!btn) return { error: "no Turn on button" };
      const box = btn.getBoundingClientRect();
      const send = (type) =>
        btn.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true, composed: true, cancelable: true,
            clientX: box.left + 5, clientY: box.top + 5,
            button: 0, pointerId: 1, pointerType: "touch",
          }),
        );
      window.__calls = [];
      send("pointerdown");
      send("pointerup");
      await new Promise((r) => setTimeout(r, 60));
      return { calls: window.__calls };
    });

    const call = power.calls?.[0];
    const usedOverride = call?.[0] === "remote" && call?.[1] === "send_command";
    if (!usedOverride) {
      failed = true;
      console.error(
        `[power] "Turn on" ignored the override, called ${JSON.stringify(call ?? power)}`,
      );
    }
    console.log(`power override via "Turn on": ${usedOverride ? "ok" : "FAILED"}`);
  }

  // Accessibility is a claim the README makes, so it is checked rather than
  // asserted: v1 wired click handlers onto bare divs, and nothing but a test
  // stops that creeping back.
  if (!dark) {
    const a11y = await page.evaluate(() => {
      const card = document.querySelector("polr-android-tv-remote-card");
      const root = card.shadowRoot;
      const pad = root.querySelector("polr-atv-nav-pad")?.shadowRoot;
      const controls = [
        ...root.querySelectorAll("button, [role='button'], input, [tabindex]"),
        ...(pad ? pad.querySelectorAll("button, [role='application'], [tabindex]") : []),
      ];
      const describe = (el) => el.className || el.tagName;
      return {
        count: controls.length,
        unlabelled: controls
          .filter(
            (el) =>
              !el.getAttribute("aria-label") &&
              !el.textContent.trim() &&
              !el.getAttribute("placeholder"),
          )
          .map(describe),
        unfocusable: controls
          .filter((el) => el.tagName !== "BUTTON" && el.tabIndex < 0)
          .map(describe),
        liveRegion: Boolean(root.querySelector("[aria-live]")),
      };
    });

    if (a11y.count < 10) {
      failed = true;
      console.error(`[a11y] only ${a11y.count} controls found — did the card render?`);
    }
    for (const [what, list] of [
      ["unlabelled", a11y.unlabelled],
      ["not keyboard focusable", a11y.unfocusable],
    ]) {
      if (list.length) {
        failed = true;
        console.error(`[a11y] ${list.length} controls ${what}: ${list.join(", ")}`);
      }
    }
    if (!a11y.liveRegion) {
      failed = true;
      console.error("[a11y] the now-playing line lost its aria-live region");
    }
    console.log(
      `a11y: ${a11y.count} controls, all labelled and focusable, live region present`,
    );
  }

  // The editor's tile-list machinery is shared by the app launcher and every
  // custom section. Nothing but this proves a section survives being edited:
  // the lists were one hardcoded `apps` list until sections arrived.
  if (!dark) {
    const roundTrip = await page.evaluate(async () => {
      const editor = document.createElement("polr-android-tv-remote-card-editor");
      const source = {
        type: "custom:polr-android-tv-remote-card",
        entity: "remote.main_tv",
        apps: [{ name: "Netflix", icon: "brand:netflix",
          action: { action: "activity", activity: "https://www.netflix.com/title" } }],
        sections: [{ name: "Home theater", buttons: [
          { name: "Projector", icon: "mdi:projector", entity: "media_player.projector",
            action: { action: "service", service: "media_player.toggle" } },
          { name: "Soundbar", icon: "mdi:soundbar",
            action: { action: "service", service: "remote.send_command" } },
        ] }],
      };
      editor.hass = document.querySelector("polr-android-tv-remote-card").hass;
      editor.setConfig(source);
      document.body.appendChild(editor);
      await editor.updateComplete;

      let emitted;
      editor.addEventListener("config-changed", (e) => { emitted = e.detail.config; });

      // Drive the real controls, not the methods behind them. Calling
      // _renameSection directly is what let "Add section" ship broken: the
      // method worked, the button did not.
      const clickByText = (text) => {
        const el = [...editor.shadowRoot.querySelectorAll("button")].find((b) =>
          b.textContent.trim().toLowerCase().includes(text),
        );
        if (!el) throw new Error(`no button matching "${text}"`);
        el.click();
      };

      clickByText("add section");
      await editor.updateComplete;
      // HA echoes every change back through setConfig; without that the editor
      // is testing its own optimism rather than the round-trip.
      if (emitted) editor.setConfig(emitted);
      await editor.updateComplete;
      const sectionsAfterAdd = emitted?.sections?.length;

      const nameInput = [...editor.shadowRoot.querySelectorAll("input")].find(
        (i) => i.value === "Theater" || i.value === "Home theater",
      );
      if (nameInput) {
        nameInput.value = "Theater";
        nameInput.dispatchEvent(new Event("change", { bubbles: true }));
        await editor.updateComplete;
      }

      const section = emitted?.sections?.[0];
      return {
        sectionsAfterAdd,
        renamed: section?.name,
        buttonCount: section?.buttons?.length,
        entityKept: section?.buttons?.[0]?.entity,
        blindButtonStaysBlind: section?.buttons?.[1]?.entity ?? null,
        appsUntouched: emitted?.apps?.[0]?.icon,
      };
    });

    const expected = {
      // Two: the one from the config, plus the one the button added.
      sectionsAfterAdd: 2,
      renamed: "Theater",
      buttonCount: 2,
      entityKept: "media_player.projector",
      blindButtonStaysBlind: null,
      appsUntouched: "brand:netflix",
    };
    for (const [key, want] of Object.entries(expected)) {
      if (roundTrip[key] !== want) {
        failed = true;
        console.error(
          `[editor] ${key}: expected ${JSON.stringify(want)}, got ${JSON.stringify(roundTrip[key])}`,
        );
      }
    }
    console.log("editor round-trip: sections survive an edit, apps untouched");
  }

  // The editor's spacing is a claim like any other, and the kind that rots
  // quietly: every part of these panels is a card component that pads itself,
  // so a new row added later brings its own inset and its own margin back with
  // it. What is asserted is the rhythm, not the pixels: one left edge per
  // stack, and gaps from the 4 / 8 / 16 scale.
  if (!dark) {
    const spacing = await page.evaluate(async () => {
      const kase = [...document.querySelectorAll(".case")].find(
        (c) => c.querySelector("h2")?.textContent === "editor: sections",
      );
      const editor = kase.querySelector("polr-android-tv-remote-card-editor");
      const name = (el) => el.className || el.tagName.toLowerCase();

      // Open a row's inline form: it is the one surface only reachable by
      // clicking, and the one whose padding was silently stripped once because
      // nothing here looked inside it.
      const pencil = editor.shadowRoot
        .querySelector(".section-block ul.list > li.row")
        .querySelector("button[title='Edit']");
      pencil.click();
      await editor.updateComplete;

      // A heading hugs what follows it, so 8 is as legal as the 16 between
      // blocks; inside a section block everything is 8; rows are 4 apart. The
      // inset is what each stack owes its children on both sides: 0 where the
      // parent is a bare stack, 12 where it is a padded surface.
      const measure = (parent, allowed, inset, label) => {
        const kids = [...parent.children];
        const boxes = kids.map((el) => el.getBoundingClientRect());
        const box = parent.getBoundingClientRect();
        const lefts = new Set(boxes.map((b) => Math.round(b.left)));
        const bad = [];
        for (let i = 1; i < kids.length; i += 1) {
          const gap = Math.round(boxes[i].top - boxes[i - 1].bottom);
          if (!allowed.includes(gap)) {
            bad.push(`${label}: ${gap}px above .${name(kids[i])} (want ${allowed.join(" or ")})`);
          }
        }
        if (lefts.size > 1) {
          bad.push(`${label}: ${lefts.size} different left edges (${[...lefts].join(", ")})`);
        }
        // Widest child, so a deliberately narrow one cannot mask a zero inset.
        const left = Math.round(Math.min(...boxes.map((b) => b.left)) - box.left);
        const right = Math.round(box.right - Math.max(...boxes.map((b) => b.right)));
        if (left !== inset || right !== inset) {
          bad.push(`${label}: inset ${left}/${right}px, want ${inset} on both sides`);
        }
        return bad;
      };

      const problems = [];
      for (const panel of editor.shadowRoot.querySelectorAll("ha-expansion-panel")) {
        const content = panel.querySelector(".content");
        problems.push(...measure(content, [8, 16], 12, "panel"));
        for (const block of content.querySelectorAll(".section-block")) {
          problems.push(...measure(block, [8], 12, "section"));
        }
        for (const list of content.querySelectorAll("ul.list")) {
          problems.push(...measure(list, [4, 8], 0, "list"));
        }
        for (const form of content.querySelectorAll(".form")) {
          problems.push(...measure(form, [12], 12, "form"));
        }
      }
      if (!editor.shadowRoot.querySelector(".form")) {
        problems.push("form: no inline form open — the check measured nothing");
      }
      return problems;
    });

    if (spacing.length) {
      failed = true;
      for (const problem of spacing) console.error(`[spacing] ${problem}`);
    }
    console.log(
      spacing.length
        ? `spacing: ${spacing.length} problem(s)`
        : "spacing: one left edge per stack, gaps on the 4 / 8 / 16 scale",
    );
  }

  const file = resolve(outDir, dark ? "dark.png" : "light.png");
  await page.screenshot({ path: file, fullPage: true });
  console.log(`wrote ${file}`);
  await page.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
