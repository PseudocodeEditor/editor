import {PS2} from "../../PS2/index.ts";

import {StateEffect} from "@codemirror/state";

import {extensions} from "../extensions/extensions.js";
import {psLight, psDark, psLightHighlight, psDarkHighlight} from "./styling.js";

import {toggleShow} from "../misc/show.js";
import {getCookie, setCookie} from "../misc/cookies.js";


const lightThemeExtensions = [
  ...extensions,
  psLight,
  psLightHighlight
];


const darkThemeExtensions = [
  ...extensions,
  psDark,
  psDarkHighlight
];


export function getExtensions() {
  const name = document.querySelector(".file-title.active .file-name").innerText;
  const fileType = name.substring(name.lastIndexOf(".") + 1, name.length).toLowerCase();
  
  if (getCookie("light-mode") === "true") {
    return fileType === "psc" ? [PS2(), ...lightThemeExtensions] : lightThemeExtensions
  } else {
    return fileType === "psc" ? [PS2(), ...darkThemeExtensions] : darkThemeExtensions
  }
}

export function updateExtensions() {
  editor.dispatch({
    effects: StateEffect.reconfigure.of(getExtensions())
  });
}

document.querySelector("#light-selector").addEventListener("click", () => {
  setCookie("light-mode", true);
  
  document.body.className = "light"; 

  document.querySelector('#light-checkbox').classList.add('active');
  document.querySelector('#dark-checkbox').classList.remove('active');
  
  updateExtensions();
});


document.querySelector("#dark-selector").addEventListener("click", () => {
  setCookie("light-mode", false);
  
  document.body.className = "dark";  

  document.querySelector('#dark-checkbox').classList.add('active');
  document.querySelector('#light-checkbox').classList.remove('active');
  
  updateExtensions();
});


// initial check
if (getCookie("light-mode") === "true") {
  document.body.className = "light";

  document.querySelector('#dark-checkbox').classList.remove('active');
  document.querySelector('#light-checkbox').classList.add('active');
} else {
  document.body.className = "dark";
}

document.querySelector(".theme-done").addEventListener("click", () => {  
  toggleShow(document.querySelector(".theme-select-overlay"));
  document.querySelector(".context-menu-overlay").style.removeProperty("display");
});
