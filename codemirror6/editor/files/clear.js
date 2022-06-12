import {setEditorContent, hideEditor} from "../misc/editorHelpers.js";

document.querySelector("#clear-files-button").addEventListener("click", () => {
  if (!confirm("Are you sure you want to delete every file in this project?")) return;

  document.querySelector("#file-tree").innerHTML = "";

  files = {};
  setEditorContent("");
  hideEditor();
});
