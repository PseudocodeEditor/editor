import {toggleShow} from "../misc/show.js";


document.querySelector(".about-done").addEventListener("click", () => {
    toggleShow(document.querySelector(".about-overlay"));
    document.querySelector(".context-menu-overlay").style.removeProperty("display");
});
