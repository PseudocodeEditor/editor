import {updateExtensions} from "../extensions/themes.js";
import {setEditorContent, getEditorContent, showEditor} from "../misc/editorHelpers.js";

export function openFile(file) {
  if (!file.classList.contains("active")) {
    if (files && Object.keys(files).length === 0 && Object.getPrototypeOf(files) === Object.prototype) {
      showEditor();
    } else {
      const recent = document.querySelector(".file-title.active");
      if (recent !== null) {
        if (recent.querySelector("input") !== null) return; // still editing file name
        recent.classList.remove("active");
        files[recent.querySelector(".file-name").innerText] = getEditorContent();
      }
    }
    
    file.classList.add("active");

    const content = files[file.querySelector(".file-name").innerText];
    
    setEditorContent(content);
  }

  updateExtensions();
}

document.querySelectorAll(".file-title").forEach(file => {
  file.addEventListener("click", () => { openFile(file) });
});
