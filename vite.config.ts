import { defineConfig } from "vite";

// Lovelace loads a single ES module, so everything (including lit) is bundled
// into one self-contained file.
//
// Output lands in dist/ and is *committed* — HACS resolves a plugin by looking
// for the release asset, then dist/<filename>, then <filename> at the repo root.
// Keeping the same filename means existing installs upgrade without touching
// their resource URL.
export default defineConfig({
  build: {
    lib: {
      entry: "src/polr-android-tv-remote-card.ts",
      formats: ["es"],
      fileName: () => "polr-android-tv-remote-card.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
    minify: "esbuild",
    sourcemap: true,
    emptyOutDir: true,
    target: "es2021",
  },
});
