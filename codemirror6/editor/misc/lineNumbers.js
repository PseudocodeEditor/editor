import {getCookie, setCookie} from "./cookies.js";

setTimeout(() => document.querySelector(".cm-lineNumbers").style.opacity = getCookie("line-numbers") === "hidden" ? "0" : "1", 100); // need the editor to exist first

document.querySelector("#line-numbers-toggle").addEventListener("click", () => {
  if (getCookie("line-numbers") === "hidden") {
    document.querySelector(".cm-lineNumbers").style.opacity = "1";
    setCookie("line-numbers", "shown");
  } else {
    document.querySelector(".cm-lineNumbers").style.opacity = "0";
    setCookie("line-numbers", "hidden");
  }
});
