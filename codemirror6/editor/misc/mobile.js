const navButtons = document.querySelectorAll("#bottom-tabs > button");

navButtons.forEach(button => {
   button.addEventListener("click", () => {
       if (document.querySelector(".file-tree input") !== null) return;

       navButtons.forEach(b => b.classList.remove("selected"));
       button.classList.add("selected");

       document.querySelector(".context-menu-overlay").click(); // Close any context menus that may be open
    });
});

document.querySelector("#run-button").addEventListener("click", () => {
    document.querySelector("#bottom-tabs #console-tab").click();
});

document.querySelector("#console-run").addEventListener("click", () => {
    document.querySelector("#run-button").click();
});
