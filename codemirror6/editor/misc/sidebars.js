const sidebarBtn = document.querySelector("#collapse-sidebar");
const runBtn = document.querySelector("#run-button");

sidebarBtn.addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  
  if (sidebar.style.marginLeft === "") {
    sidebar.style.marginLeft = -1 * sidebar.offsetWidth + "px"
    
    sidebarBtn.style.transform = "translateX(" + sidebar.offsetWidth + "px)";
    runBtn.style.transform = "translateX(" + (sidebarBtn.offsetWidth + 5) + "px)";
  } else {
    sidebar.style.removeProperty("margin-left");    
    sidebarBtn.style.removeProperty("transform");
    runBtn.style.removeProperty("transform");
  }
});

const consoleBtn = document.querySelector("#collapse-console");
const optionsBtn = document.querySelector("#editor-options");

consoleBtn.addEventListener("click", () => {
  const console = document.querySelector(".console-panel");
  
  if (console.style.marginRight === "") {
    console.style.marginRight = -1 * console.offsetWidth + "px"
    
    consoleBtn.style.transform = "translateX(" + -1 * console.offsetWidth + "px)";
    optionsBtn.style.transform = "translateX(" + -1 * (consoleBtn.offsetWidth + 15) + "px)";
  } else {
    console.style.removeProperty("margin-right");    
    consoleBtn.style.removeProperty("transform");
    optionsBtn.style.removeProperty("transform");
  }
});
