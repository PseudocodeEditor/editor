import {openFile} from "../files/open.js";
import {setFileName} from "../files/rename.js";
import {readFileContent} from "../files/upload.js";

import {setEditorContent, showEditor} from "../misc/editorHelpers.js";

export function openProject(content) {
  const data = JSON.parse(content);
  const projName = data.projectName;
  files = data.files;
  
  document.querySelector("#project-title").innerText = projName;
  document.querySelector("#project-title-input").value = projName;
  
  document.querySelector("#file-tree").innerHTML = "";
  
  if (!(files && Object.keys(files).length === 0 && Object.getPrototypeOf(files) === Object.prototype)) {
    showEditor();
  }

  let first;
  
  for (let fileName in files) {
    const c = files[fileName]
    
    setEditorContent(c)
    
    const newFile = document.createElement("div");
    newFile.classList.add("file-title");
  
    const inputElem = document.createElement("input");        
    inputElem.value = fileName;
  
    newFile.appendChild(inputElem);
    document.querySelector("#file-tree").appendChild(newFile);

    if (first === undefined) first = newFile;
  
    setFileName(inputElem, newFile, fileName, true);
  }

  openFile(first);
}
  
document.querySelector("#upload-project").addEventListener("change", (event) => {
  const input = event.target;
  if ('files' in input && input.files.length > 0) {
    readFileContent(input.files[0])
      .then(content => { openProject(content) })
        .catch(error => console.log(error));
  }
});

document.querySelector("#upload-project-button").addEventListener("click", (event) => {  
  if (!confirm("This will remove your current files, do you wish to continue?")) {
    event.preventDefault();
    return;
  }

  document.querySelector("#upload-project").value = null;
  document.querySelector("#upload-project").click();
});
