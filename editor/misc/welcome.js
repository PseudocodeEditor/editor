import {toggleShow} from "./show.js";
import {getCookie, setCookie} from "./cookies.js";

if (getCookie("welcome") !== "shown") {
  const overlay = document.querySelector(".welcome-overlay");

  toggleShow(overlay);

  document.querySelector(".welcome-dns").addEventListener("click", () => {
    setCookie("welcome", "shown");
    
    toggleShow(overlay)
  });

  document.querySelector(".continue-button").addEventListener("click", () => toggleShow(overlay));
}
