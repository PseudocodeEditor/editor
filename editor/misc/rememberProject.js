import {openProject} from "../project/upload.js";
import {bundleProject} from "../project/download.js";

setTimeout(() => {
  if (localStorage.getItem("project") !== null) {
    if (confirm("A recent session has been detected, would you like to restore it?")) {
      openProject(localStorage.getItem("project"));
    }
  }
}, 100);

window.onbeforeunload = () => {
  localStorage.setItem("project", bundleProject());
  return "File changes won't be saved unless downloaded.";
};
