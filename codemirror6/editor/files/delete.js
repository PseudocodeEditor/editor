import {setEditorContent, hideEditor} from "../misc/editorHelpers.js";

export function deleteFile(fileElem) {
  if (!confirm("Are you sure you want to delete this file?")) return;
  
  delete files[fileElem.querySelector(".file-name").innerText];
  
  fileElem.remove();

  const changeFile = Object.keys(files)[0];
  setEditorContent(files[changeFile])

  if (files && Object.keys(files).length === 0 && Object.getPrototypeOf(files) === Object.prototype) {
    hideEditor();
  } else {
    document.querySelectorAll(".file-title").forEach(file => {
      if (file.children[0].innerText === changeFile) {
        file.classList.add("active");
      }
    });
  }
}
