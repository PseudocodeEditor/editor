import {toggleShow} from "./show.js";

const dropdowns = {
  "#editor-options": "#editor-options-menu",
  "#set-appearance": ".theme-select-overlay",
  "#view-about": ".about-overlay",
  "#file-options": "#file-options-menu"
}

const overlay = document.querySelector(".context-menu-overlay");

for (let [button, menu] of Object.entries(dropdowns)) {
  button = document.querySelector(button);
  menu = document.querySelector(menu);
  
  button.addEventListener("click", () => {    
    toggleShow(menu);
    overlay.style.display = "block";
  });

  overlay.addEventListener("click", () => {
    if (menu.classList.contains("show")) {
      toggleShow(menu);
      overlay.style.removeProperty("display");
    }
  });
}

document.querySelectorAll(".context-menu-item").forEach(elem => {
  elem.addEventListener("click", () => {
    toggleShow(elem.parentElement.parentElement);
    overlay.style.removeProperty("display");
  });
});
