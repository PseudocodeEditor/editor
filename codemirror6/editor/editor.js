import {EditorView} from "@codemirror/view";
import {EditorState} from "@codemirror/basic-setup";

import {getExtensions} from "./extensions/themes.js";
import {getEditorContent} from "./misc/editorHelpers.js";

const state = EditorState.create({
  doc: `// File handling example

DECLARE LineOfText : STRING

OPENFILE "FileA.txt" FOR READ
OPENFILE "FileB.txt" FOR WRITE

WHILE NOT EOF("FileA.txt") DO
	READFILE "FileA.txt", LineOfText
	IF LineOfText = "" THEN
		WRITEFILE "FileB.txt", "---"
	ELSE
		WRITEFILE "FileB.txt", LineOfText
	ENDIF
ENDWHILE

CLOSEFILE "FileA.txt"
CLOSEFILE "FileB.txt"
`,
  extensions: getExtensions()
});

window.editor = new EditorView({
  state: state,
  parent: document.querySelector("#editor")
});

window.files = { [document.querySelector(".file-name").innerText]: getEditorContent() };

import "./files/new.js";
import "./files/open.js";
import "./files/clear.js";
import "./files/rename.js";
import "./files/upload.js";
import "./files/delete.js";
import "./files/download.js";

import "./project/rename.js";
import "./project/upload.js";
import "./project/download.js";
import "./misc/welcome.js";
import "./misc/sidebars.js";
import "./misc/dropdowns.js";
import "./misc/about.js";
import "./misc/lineNumbers.js";
import "./misc/codeClipper.js";
import "./misc/rememberProject.js";
