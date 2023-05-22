import typescript from "rollup-plugin-ts";
import {lezer} from "@lezer/generator/rollup";
import {nodeResolve} from "@rollup/plugin-node-resolve";

import { minimap } from "@replit/codemirror-minimap";

export default {
  input: "codemirror6/editor/editor.js",
  output: {
    file: "dist/editor.bundle.js",
    format: "iife",
  },
  plugins: [nodeResolve(), lezer(), typescript(), minimap()]
};
