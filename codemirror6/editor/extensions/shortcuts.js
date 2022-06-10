import {keymap} from "@codemirror/view";
import {acceptCompletion} from "@codemirror/autocomplete";
import {defaultKeymap, indentLess, indentMore} from "@codemirror/commands";

import {downloadFile} from "../files/download.js";

export const shortcuts = keymap.of([
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
    run: () => {
      const active = document.querySelector(".file-title.active");
      downloadFile(active);
    }
  },      
  {
    key: "Mod-o",
    preventDefault: true,
    run: () => { document.querySelector("#hidden-file-input").click(); }
  }
])
