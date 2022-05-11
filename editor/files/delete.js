export function deleteFile(fileElem) {
  if (!confirm("Are you sure you want to delete this file?")) return;
  
  delete files[fileElem.querySelector(".file-name").innerText];
  
  fileElem.remove();

  const changeFile = Object.keys(files)[0];
  const content = files[changeFile];
  const update = editor.state.update({changes: {from: 0, to: editor.state.doc.length, insert: content}});
  editor.update([update]);

  if (files && Object.keys(files).length === 0 && Object.getPrototypeOf(files) === Object.prototype) {
    document.querySelector(".cm-gutters").style.opacity = "0";
    document.querySelector(".cm-content").setAttribute("contenteditable", false);
  } else {
    document.querySelectorAll(".file-title").forEach(file => {
      if (file.children[0].innerText === changeFile) {
        file.classList.add("active");
      }
    });
  }
}
