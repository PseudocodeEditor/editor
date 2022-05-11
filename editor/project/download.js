document.querySelector("#download-project-button").addEventListener("click", () => {  
  const recent = document.querySelector(".file-title.active");
  if (recent !== null) {
    files[recent.querySelector(".file-name").innerText] = editor.state.doc.toString();
  }

  const projName = document.querySelector("#project-title-input").value;
  
  const fileName = projName + ".pscp";
  const file = new Blob(
    [JSON.stringify({
      projectName: projName,
      files: files
    })],
    {type: "text"}
  );
  
  if (window.navigator.msSaveOrOpenBlob)
    window.navigator.msSaveOrOpenBlob(file, fileName);
  else {
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);  
    }, 0);
  }
});
