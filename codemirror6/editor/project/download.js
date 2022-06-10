export function bundleProject() {
  const recent = document.querySelector(".file-title.active");
  if (recent !== null) {
    files[recent.querySelector(".file-name").innerText] = editor.state.doc.toString();
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