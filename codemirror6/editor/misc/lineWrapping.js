import {getCookie, setCookie} from "./cookies.js";
import {updateExtensions} from "../extensions/themes";

document.querySelector("#line-wrap-toggle").addEventListener("click", () => {
    if (getCookie("line-wrapping") === "off") {
        setCookie("line-wrapping", "on");
    } else {
        setCookie("line-wrapping", "off");
    }

    updateExtensions();
});
