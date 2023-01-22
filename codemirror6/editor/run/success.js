import {removeInput} from "./error";
import {setFileName} from "../files/rename";
import {setEditorContent} from "../misc/editorHelpers";

export function success(data) {
    for (const [name, content] of Object.entries(data.files)) {
        if (!files.hasOwnProperty(name)) {
            files[name] = content;

            const newFile = document.createElement("div");
            newFile.classList.add("file-title");

            const inputElem = document.createElement("input");
            inputElem.value = name;

            newFile.appendChild(inputElem);
            document.querySelector("#file-tree").appendChild(newFile);

            setFileName(inputElem, newFile, name, true);
        }
    }

    const active = document.querySelector(".file-title.active");
    if (active !== null) setEditorContent(files[active.querySelector(".file-name").innerText]);

    removeInput();

    const prompt = document.createElement("p");
    prompt.classList.add("prompt");
    prompt.innerText = "$";

    document.querySelector(".console").appendChild(prompt);

    document.querySelector("#run-button").innerText = "􀊄";
}