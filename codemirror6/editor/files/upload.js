import {duplicateName} from "./new.js";
import {setFileName} from "./rename.js";

import {showEditor} from "../misc/editorHelpers";

export function readFileContent(file) {
	const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload  = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

function uploadFile(input) {
  if ('files' in input && input.files.length > 0) {
	  readFileContent(input.files[0])
      .then(content => {
        const fileName = duplicateName(input.files[0].name);

        if (files && Object.keys(files).length === 0 && Object.getPrototypeOf(files) === Object.prototype) {
          showEditor();
        }

        files[fileName] = content;
        
        const newFile = document.createElement("div");
        newFile.classList.add("file-title");
      
        const inputElem = document.createElement("input");        
        inputElem.value = fileName;
      
        newFile.appendChild(inputElem);
        document.querySelector("#file-tree").appendChild(newFile);

        setFileName(inputElem, newFile, fileName, true);
      }).catch(error => console.log(error));
  }
}

document.querySelector("#upload-file").addEventListener("change", (event) => {
	uploadFile(event.target);  
});

document.querySelector("#hidden-file-input").addEventListener("change", (event) => {
  uploadFile(event.target);
});

document.querySelector("#upload-file-button").addEventListener("click", () => {
  document.querySelector("#upload-file").click();
});
