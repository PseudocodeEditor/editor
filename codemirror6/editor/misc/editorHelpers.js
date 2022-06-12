import {getCookie} from "./cookies.js";

export function getEditorContent() {
    return editor.state.doc.toString();
}

export function setEditorContent(content) {
    editor.update([
        editor.state.update({
            changes: {
                from: 0,
                to: editor.state.doc.length,
                insert: content
            }
        })
    ]);
}

export function hideEditor() {
    document.querySelector(".cm-gutters").style.opacity = "0";
    document.querySelector(".cm-content").setAttribute("contenteditable", "false");
}

export function showEditor() {
    if (getCookie("line-numbers") === "shown") document.querySelector(".cm-gutters").style.opacity = "1";
    document.querySelector(".cm-content").setAttribute("contenteditable", "true");
}

export function download(file, fileName) {
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, fileName);
    } else {
        const a = document.createElement("a");
        const url = URL.createObjectURL(file);

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
