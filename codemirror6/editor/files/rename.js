import {openFile} from "./open.js";
import {deleteFile} from "./delete.js";
import {downloadFile} from "./download.js";

import {toggleShow} from "../misc/show.js";

import {updateExtensions} from "../styles/themes.js";


function buildFileContextMenu() {
  const menu = document.createElement("div");
  menu.classList.add("context-menu");

  const menuContent = document.createElement("div");
  menuContent.classList.add("context-menu-content");

  // rename
  const renameItem = document.createElement("div");
  renameItem.classList.add("context-menu-item");
  renameItem.classList.add("rename-button");
  renameItem.classList.add("top");

  const renameLabel = document.createElement("div");
  renameLabel.classList.add("menu-item-label");
  renameLabel.innerText = "Rename";

  const renameIcon = document.createElement("div");
  renameIcon.classList.add("menu-item-icon");
  renameIcon.innerText = "􀈊";

  const separator1 = document.createElement("div");
  separator1.classList.add("context-menu-separator");

  // download
  const downloadItem = document.createElement("div");
  downloadItem.classList.add("context-menu-item");
  downloadItem.classList.add("download-button");

  const downloadLabel = document.createElement("div");
  downloadLabel.classList.add("menu-item-label");
  downloadLabel.innerText = "Download";

  const downloadIcon = document.createElement("div");
  downloadIcon.classList.add("menu-item-icon");
  downloadIcon.innerText = "􀈽";

  const separator2 = document.createElement("div");
  separator2.classList.add("context-menu-separator");

  // delete
  const deleteItem = document.createElement("div");
  deleteItem.classList.add("context-menu-item");
  deleteItem.classList.add("delete-button");
  deleteItem.classList.add("bottom");
  deleteItem.classList.add("red");

  const deleteLabel = document.createElement("div");
  deleteLabel.classList.add("menu-item-label");
  deleteLabel.innerText = "Delete";

  const deleteIcon = document.createElement("div");
  deleteIcon.classList.add("menu-item-icon");
  deleteIcon.innerText = "􀈑";

  deleteItem.appendChild(deleteLabel);
  deleteItem.appendChild(deleteIcon);

  downloadItem.appendChild(downloadLabel);
  downloadItem.appendChild(downloadIcon);

  renameItem.appendChild(renameLabel);
  renameItem.appendChild(renameIcon);

  menuContent.appendChild(renameItem);
  menuContent.appendChild(separator1)
  menuContent.appendChild(downloadItem);
  menuContent.appendChild(separator2)
  menuContent.appendChild(deleteItem);

  menu.appendChild(menuContent);

  return menu;
}


function addDots(fileElem) {
  const dots = document.createElement("div");
  dots.classList.add("file-dots");

  dots.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 122.88"><path d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Zm0,92.93a15,15,0,1,1-15,15,15,15,0,0,1,15-15Zm0-46.47a15,15,0,1,1-15,15,15,15,0,0,1,15-15Z"/></svg>`;

  const menu = buildFileContextMenu();

  fileElem.appendChild(dots);
  fileElem.appendChild(menu);

  const overlay = document.querySelector(".context-menu-overlay");
  
  dots.addEventListener("click", () => {
    toggleShow(menu);
    overlay.style.display = "block";
    fileElem.classList.add("hover");
    dots.scrollIntoView();
  });

  overlay.addEventListener("click", () => {
    if (menu.classList.contains("show")) {
      toggleShow(menu);
      overlay.style.removeProperty("display");
      fileElem.classList.remove("hover");
    }
  });

  menu.querySelectorAll(".context-menu-item").forEach(item => {
    item.addEventListener("click", () => {
      if (menu.classList.contains("show")) {
        toggleShow(menu);
        overlay.style.removeProperty("display");
        fileElem.classList.remove("hover");
      }
    });
  });

  const fileRename   = menu.querySelector(".rename-button");
  const fileDelete   = menu.querySelector(".delete-button");
  const fileDownload = menu.querySelector(".download-button");

  fileRename.addEventListener("click",   () => renameFile(fileElem));
  fileDelete.addEventListener("click",   () => deleteFile(fileElem));
  fileDownload.addEventListener("click", () => downloadFile(fileElem));
}

document.querySelectorAll(".file-title").forEach(elem => addDots(elem));


function sortFiles() {
  let fileElems = document.querySelectorAll(".file-title");

  let sorted = false;
  let top = fileElems.length - 1;

  while (!(sorted || top === 0)) {
    sorted = true;
    fileElems = document.querySelectorAll(".file-title");
    for (let i = 0; i <= top-1; i++) {
      if (fileElems[i].querySelector(".file-name").innerText.toLowerCase() > fileElems[i+1].querySelector(".file-name").innerText.toLowerCase()) {
        fileElems[i].parentNode.insertBefore(fileElems[i+1], fileElems[i]);
        sorted = false;
        fileElems = document.querySelectorAll(".file-title");
      }
    }
    top--;
  }
}


export function setFileName(input, parent, oldName) {
  const newName = input.value;

  let content;
  if (files && Object.keys(files).length === 0 && Object.getPrototypeOf(files) === Object.prototype) {
    document.querySelector(".cm-gutters").style.opacity = "1";
    document.querySelector(".cm-content").setAttribute("contenteditable", true);
    content = `OUTPUT "Hello World!"`;
  } else {
    if (newName !== oldName && newName in files) {
      alert("Can't have 2 files with the same name!");
      return;
    } else if (newName.length === 0) {      
      alert("Filename must be at least 1 character long!");
      return;
    } else if (!/^[a-zA-Z0-9_\. -]+$/.test(newName)) {      
      alert("Filename must be alphnumeric + spaces + -_.");
      return;
    }
    
    const recent = document.querySelector(".file-title.active");
    if (recent !== null) recent.classList.remove("active");

    if (oldName in files) {
      content = editor.state.doc.toString();
      delete files[oldName]
    } else {
      content = `OUTPUT "Hello World!"`;
    }
  }
  
  files[newName] = content;
  
  editor.update([editor.state.update({changes: {from: 0, to: editor.state.doc.length, insert: content}})]);
  
  const fileName = document.createElement("div");
  
  fileName.innerText = newName;
  
  fileName.classList.add("file-name");
  if (newName.substring(newName.lastIndexOf(".") + 1, newName.length).toLowerCase() === "psc") {
    fileName.classList.add("psc");
  }  

  input.remove();
  
  parent.appendChild(fileName);
  addDots(parent);
  
  parent.classList.add("active");

  parent.addEventListener("click", () => { openFile(parent) });
  
  updateExtensions();

  sortFiles();
}


export function renameFile(fileElem) {
  const elem = fileElem.querySelector(".file-name");

  let fileName = elem.innerText;
  elem.remove();

  const input = document.createElement("input");
  input.classList.add("edit-file-name");
  input.value = fileName;
  
  fileElem.appendChild(input);

  const selectionEnd = fileName.indexOf(".");
  input.focus();
  input.setSelectionRange(0, selectionEnd === -1 ? fileName.length : selectionEnd);

  input.addEventListener("focusout", () => setFileName(input, fileElem, fileName));
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const tmp = document.createElement("input");
      document.body.appendChild(tmp);
      tmp.focus();
      tmp.remove();
    }
  });
}
