import {updateExtensions} from "../extensions/themes.js";

export function openFile(file) {
  if (!file.classList.contains("active")) {
    if (files && Object.keys(files).length === 0 && Object.getPrototypeOf(files) === Object.prototype) {
      document.querySelector(".cm-content").setAttribute("contenteditable", true);
    } else {
      const recent = document.querySelector(".file-title.active");
      if (recent !== null) {
        if (recent.querySelector("input") !== null) return; // still editing file name
        recent.classList.remove("active");
        files[recent.querySelector(".file-name").innerText] = editor.state.doc.toString();
      }
    }
    
    file.classList.add("active");

    const content = files[file.querySelector(".file-name").innerText];
    
    editor.update([editor.state.update({changes: {from: 0, to: editor.state.doc.length, insert: content}})]);

    updateExtensions();
  }
}

document.querySelectorAll(".file-title").forEach(file => {
  file.addEventListener("click", () => { openFile(file) });
});
