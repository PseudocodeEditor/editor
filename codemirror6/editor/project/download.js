import {getEditorContent, download} from "../misc/editorHelpers.js";

export function bundleProject() {
  const recent = document.querySelector(".file-title.active");
  if (recent !== null) {
    files[recent.querySelector(".file-name").innerText] = getEditorContent();
  }

  const projName = document.querySelector("#project-title-input").value;
  
  return JSON.stringify({
    projectName: projName,
    files: files
  });
}

document.querySelector("#download-project-button").addEventListener("click", () => {  
  const fileName = document.querySelector("#project-title-input").value + ".pscp";
  const file = new Blob(
    [bundleProject()],
    {type: "text"}
  );
  
  download(file, fileName);
});
