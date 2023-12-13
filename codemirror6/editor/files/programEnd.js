import {setEditorContent} from "../misc/editorHelpers";
import {addDots, sortFiles} from "./rename";
import {openFile} from "./open";

const run_button = document.querySelector("#run-button");

new MutationObserver(() => {
    if (run_button.innerText === "􀛷") return;

    const current = document.querySelector(".active .file-name").innerText;
    if (current) {
        const selection = editor.state.selection;
        setEditorContent(files[current]);
        editor.dispatch({ selection: selection });
    }

    const displayedFiles = Array.from(document.querySelectorAll(".file-name")).map(e => e.innerText);

    Object.keys(window.files).forEach(name => {
        if (!displayedFiles.includes(name)) {
            const newFile = document.createElement("div");
            newFile.classList.add("file-title");

            const fileName = document.createElement("div");
            fileName.classList.add("file-name");
            if (name.endsWith(".psc")) fileName.classList.add("psc");

            fileName.innerText = name

            newFile.appendChild(fileName);
            document.querySelector("#file-tree").appendChild(newFile);

            sortFiles();
            addDots(newFile);
            newFile.addEventListener("click", () => { openFile(newFile) });
        }
    });
}).observe(run_button, { characterData: true, attributes: false, childList: true, subtree: false });
