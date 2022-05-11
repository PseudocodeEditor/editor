import {EditorView} from "@codemirror/view";
import {indentUnit} from "@codemirror/language";
import {basicSetup} from "@codemirror/basic-setup";
import {acceptCompletion} from "@codemirror/autocomplete";
import {keymap, highlightActiveLine} from "@codemirror/view";
import {highlightActiveLineGutter} from "@codemirror/gutter";
import {defaultKeymap, indentLess, indentMore} from "@codemirror/commands";

export const extensions = [
  basicSetup,
  EditorView.lineWrapping,
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
    {
      key: "Mod-s",
      preventDefault: true,
      run: () => { document.querySelector("#download-project-button").click() }
    },      
    {
      key: "Mod-o",
      preventDefault: true,
      run: () => { document.querySelector("#upload").click() }
    }
  ]),
  indentUnit.of("	"),
  highlightActiveLineGutter(),
  highlightActiveLine()
];
