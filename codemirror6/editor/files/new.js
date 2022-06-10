import {renameFile} from "./rename.js";

export function duplicateName(name) {
  let max = 0;

  const splitName = /([^\n\r]*?)\d*\.([^\n\r]*)/.exec(name);
  const nameStart = splitName[1];
  const extension = splitName[2];

  const r = new RegExp(String.raw`${nameStart}(\d*)\.${extension}`)
  
  for (let n in files) {
    if (r.test(n)) {
      if (max === 0 && n === name) {
        max = 1;
      } else {
        const count = parseInt(r.exec(n)[1]);
        max = count >= max ? count+1 : max;
      }
    }
  }

  if (max === 0) max = "";

  return `${nameStart}${max}.${extension}`;
}

document.querySelector("#new-file").addEventListener("click", () => {
  const newFile = document.createElement("div");
  newFile.classList.add("file-title");

  const fileName = document.createElement("div");
  fileName.classList.add("file-name");
  fileName.classList.add("psc");  
  
  fileName.innerText = duplicateName("newFile.psc");

  newFile.appendChild(fileName);
  document.querySelector("#file-tree").appendChild(newFile);

  renameFile(newFile);
});
