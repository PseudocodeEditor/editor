import {nodeResolve} from "@rollup/plugin-node-resolve"
import typescript from "rollup-plugin-ts"
import {lezer} from "@lezer/generator/rollup"

export default {
  input: "editor/editor.js",
  output: {
    file: "editor.bundle.js",
    format: "iife"
  },
  plugins: [nodeResolve(), lezer(), typescript()]
}