import {getEditorContent} from "../misc/editorHelpers";

const button = document.querySelector("#run-button");

button.addEventListener("click", () => {
    if (button.classList.contains("disabled")) return;

    if (button.innerText === "􀛷") {
        ws.send(JSON.stringify({
            type: "STOP",
            key: window.key
        }));

        button.innerText = "􀊄";
    } else {
        const recent = document.querySelector(".file-title.active");
        if (recent === null) return;

        files[recent.querySelector(".file-name").innerText] = getEditorContent();

        const entrypoint = recent.querySelector(".file-name").innerText;

        ws.send(JSON.stringify({
            type: "RUN",
            files: files,
            entrypoint: entrypoint
        }));

        const prompts = document.querySelectorAll(".console .prompt");
        prompts[prompts.length - 1].innerText += " ps2 " + entrypoint;

        button.innerText = "􀛷";
    }
});
