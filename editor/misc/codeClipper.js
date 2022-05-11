function copyEditor() {
   html2canvas(document.querySelector("#editor"), {
      allowTaint: true,
      useCORS : true,
  }).then(function(canvas) {  
    document.body.appendChild(canvas);

    const img = document.createElement("img"); 
    img.src = canvas.toDataURL();
    
    const div = document.createElement("div");
    div.contentEditable = true;
    
    div.appendChild(img);
    document.body.appendChild(div);
    
    div.focus();
    window.getSelection().selectAllChildren(div);
    document.execCommand("Copy");
    
    div.remove();
    canvas.remove()

    alert("Copied!");
  });
}

document.querySelector("#run-button").addEventListener("click", copyEditor);
document.querySelector("#screenshot").addEventListener("click", copyEditor);
