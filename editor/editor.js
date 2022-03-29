import {indentWithTab, defaultKeymap, indentLess, indentMore} from "@codemirror/commands"
import {acceptCompletion} from "@codemirror/autocomplete"
import {indentOnInput, indentUnit} from "@codemirror/language"
import {EditorView, keymap, highlightActiveLine} from "@codemirror/view"
import {highlightActiveLineGutter} from "@codemirror/gutter"
import {EditorState, basicSetup} from "@codemirror/basic-setup"

import {PS2} from "../PS2/index.ts"
import {psLight, psDark, psLightHighlight, psDarkHighlight} from "./styling.js"

const themeExtensions = {
  light: [psLight, psLightHighlight],
  dark: [psDark, psDarkHighlight]
}

//const [theme, setTheme] = useState('dark');
//const container = useRef(null);


const editor = new EditorView({
  state: EditorState.create({
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
  extensions: [
    basicSetup,
    keymap.of([
      ...defaultKeymap,
      {
        key: "Tab",
        preventDefault: true,
        run: acceptCompletion,
      },
      {
        key: "Tab",
        preventDefault: true,
        run: indentMore,
      },
      {
        key: "Shift-Tab",
        preventDefault: true,
        run: indentLess,
      },
    ]),
    indentUnit.of("	"),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    psDark,
    psDarkHighlight,
    PS2()
  ]
  }),
  //...themeExtensions[theme],
  parent: document.querySelector("#editor")
})