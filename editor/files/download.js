export function downloadFile(fileElem) {
  const recent = document.querySelector(".file-title.active");
  if (recent !== null) {
    files[recent.querySelector(".file-name").innerText] = editor.state.doc.toString();
  }
  
  const fileName = fileElem.querySelector(".file-name").innerText;
  const file = new Blob([files[fileName]], {type: "text"});
  
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
}

document.querySelectorAll(".download-button").forEach(button => {
  button.addEventListener("click", () => { downloadFile(button.parentElement.parentElement.parentElement) });
});
