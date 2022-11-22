import {setEditorContent, hideEditor} from "../misc/editorHelpers.js";

import {toggleShow} from "../misc/show.js";
import {makeConfirm} from "../misc/alert.js"

document.querySelector("#clear-files-button").addEventListener("click", () => {

  makeConfirm("This will delete all files and will be unrecoverable.", null, true)
    .then(sure => {
      if (sure) {
        document.querySelector("#file-tree").innerHTML = "";
        files = {};
        setEditorContent("");
        hideEditor();
      }
    });
});