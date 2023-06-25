import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript2 from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";

const dev = process.env.ROLLUP_WATCH;

export default {
    input: "src/polr-fox-card.ts",
    output: {
        file: "polr-android-tv-remote-card.js",
        format: "es"
    },
    plugins: [
        nodeResolve(),
        json(),
        typescript2(),
        babel({
            babelHelpers: 'bundled',
            exclude: "node_modules/**"
        }),
        !dev && terser({ format: { comments: false } }),
    ],
};