import React, { useState, useRef, useEffect } from "react";
import {indentWithTab, defaultKeymap, indentLess, indentMore} from "@codemirror/commands"
import {acceptCompletion} from "@codemirror/autocomplete"
import {indentOnInput, indentUnit} from "@codemirror/language"
import {EditorView, keymap, highlightActiveLine} from "@codemirror/view"
import {highlightActiveLineGutter} from "@codemirror/gutter"
import {EditorState, basicSetup} from "@codemirror/basic-setup"

import {PS2} from "../PS2/index.ts"
import {psLight, psDark, psLightHighlight, psDarkHighlight} from "./styling.js"

const themeExtensions = {
  light: [psLight, psLightHighlight],
  dark: [psDark, psDarkHighlight]
}

const [theme, setTheme] = useState('dark');
const container = useRef(null);


const editor = new EditorView({
  state: EditorState.create({
  doc: `OUTPUT "Hello World!"`,
  extensions: [
    basicSetup,
    keymap.of([
      ...defaultKeymap,
      {
        key: "Tab",
        preventDefault: true,
        run: acceptCompletion,
      },
      {
        key: "Tab",
        preventDefault: true,
        run: indentMore,
      },
      {
        key: "Shift-Tab",
        preventDefault: true,
        run: indentLess,
      },
    ]),
    indentUnit.of("	"),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    psDark,
    psDarkHighlight,
    PS2()
  ]
  }),
  //...themeExtensions[theme],
  parent: document.querySelector("#editor")
})