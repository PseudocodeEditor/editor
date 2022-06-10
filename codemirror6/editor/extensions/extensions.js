import {EditorView} from "@codemirror/view";
import {indentUnit} from "@codemirror/language";
import {basicSetup} from "@codemirror/basic-setup";
import {highlightActiveLine} from "@codemirror/view";
import {highlightActiveLineGutter} from "@codemirror/gutter";

import {shortcuts} from "./shortcuts.js";

export const extensions = [
  basicSetup,
  EditorView.lineWrapping,
  shortcuts,
  indentUnit.of("	"),
  highlightActiveLineGutter(),
  highlightActiveLine()
];
