import {getEditorContent, download} from "../misc/editorHelpers.js";

export function downloadFile(fileElem) {
  const recent = document.querySelector(".file-title.active");
  if (recent !== null) {
    files[recent.querySelector(".file-name").innerText] = getEditorContent();
  }
  
  const fileName = fileElem.querySelector(".file-name").innerText;
  const file = new Blob([files[fileName]], {type: "text"});
  
  download(file, fileName);
}

document.querySelectorAll(".download-button").forEach(button => {
  button.addEventListener("click", () => { downloadFile(button.parentElement.parentElement.parentElement) });
});
