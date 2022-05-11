import typescript from "rollup-plugin-ts";
import {lezer} from "@lezer/generator/rollup";
import {nodeResolve} from "@rollup/plugin-node-resolve";

export default {
  input: "editor/editor.js",
  output: {
    file: "dist/editor.bundle.js",
    format: "iife",
  },
  plugins: [nodeResolve(), lezer(), typescript()]
};
