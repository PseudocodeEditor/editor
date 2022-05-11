document.querySelector("#clear-files-button").addEventListener("click", () => {
  if (!confirm("Are you sure you want to delete every file in this project?")) return;

  document.querySelector("#file-tree").innerHTML = "";

  files = {};
  editor.update([editor.state.update({changes: {from: 0, to: editor.state.doc.length, insert: ""}})]);

  document.querySelector(".cm-gutters").style.opacity = "0";
  document.querySelector(".cm-content").setAttribute("contenteditable", false);
});
