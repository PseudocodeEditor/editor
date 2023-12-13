import {openProject} from "../project/upload.js";
import {bundleProject} from "../project/download.js";

setTimeout(() => {
  if (localStorage.getItem("project") !== null) {
      openProject(localStorage.getItem("project"));
  }
}, 100);

window.onbeforeunload = () => {
  localStorage.setItem("project", bundleProject());
};
