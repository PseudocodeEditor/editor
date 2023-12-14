import {getCookie, setCookie} from "./cookies.js";

setTimeout(() => document.querySelector(".cm-minimap-gutter").style.display = getCookie("minimap") === "hidden" ? "none" : "flex", 100); // need the editor to exist first

document.querySelector("#minimap-toggle").addEventListener("click", () => {
    if (getCookie("minimap") === "hidden") {
        document.querySelector(".cm-minimap-gutter").style.display = "flex";
        setCookie("minimap", "shown");
    } else {
        document.querySelector(".cm-minimap-gutter").style.display = "none";
        setCookie("minimap", "hidden");
    }
});
