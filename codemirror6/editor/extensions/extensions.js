import {EditorView} from "@codemirror/view";
import {indentUnit} from "@codemirror/language";
import {basicSetup} from "codemirror";
import {lineNumbers} from "@codemirror/view";

import { minimap } from "@replit/codemirror-minimap";

import {shortcuts} from "./shortcuts.js";

export const extensions = [
  basicSetup,
  EditorView.lineWrapping,
  shortcuts,
  indentUnit.of("	"),
  lineNumbers(),
  minimap()
];
