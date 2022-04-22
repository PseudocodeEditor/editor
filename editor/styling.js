import {EditorView, keymap} from "@codemirror/view"
import {tags, HighlightStyle} from "@codemirror/highlight"

const psLight = EditorView.theme({
  "&": {
      color: "#292929",
      backgroundColor: "transparent",
  },
  "cm-editor": {
    paddingTop: "0.4rem",
  },
  ".cm-scroller": {
      fontFamily: "'JetBrains Mono', monospace !important",
      lineHeight: "1.9",
      fontSize: "13px"
  },
  ".cm-tooltip.cm-tooltip-autocomplete": {
      "& > ul": {
          fontFamily: "'JetBrains Mono', monospace !important",
          fontSize: "13px"
      }
  },
  "&.cm-focused .cm-cursor": {
      borderLeftColor: "black"
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#A4CDFF"
  },
  ".cm-gutters": {
      backgroundColor: "transparent",
      color: "#A4A4A4",
      border: "none",
      paddingLeft: "0.8rem",
      marginBottom: "35vh",
  },
  ".cm-gutter": {
    minWidth: "3ch",
  },
  ".cm-activeLine": {
      backgroundColor: "transparent",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "black",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "#D9D9D9",
    color: "#6E6E6E",
    border: "none",
    borderRadius: "5px",
    padding: "0 6px",
    margin: "0 3.5px",
    fontFamily: "Hiragino Sans",
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "10px",
  },
})

const psDark = EditorView.theme({
  "&": {
      color: "white",
      backgroundColor: "transparent",
  },
  ".cm-scroller": {
      fontFamily: "'JetBrains Mono', monospace !important",
      lineHeight: "1.9",
      fontSize: "13px"
  },
  ".cm-tooltip.cm-tooltip-autocomplete": {
      "& > ul": {
          fontFamily: "'JetBrains Mono', monospace !important",
          fontSize: "13px"
      }
  },
  "&.cm-focused .cm-cursor": {
      borderLeftColor: "white"
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#515B70"
  },
  ".cm-gutters": {
      backgroundColor: "transparent",
      color: "#575757",
      border: "none"
  },
  ".cm-activeLine": {
      backgroundColor: "transparent",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "white",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "#3F3F41",
    color: "#9F9FA0",
    border: "none",
    borderRadius: "5px",
    padding: "0 6px",
    margin: "0 3.5px",
    fontFamily: "Hiragino Sans",
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "10px",
  },
}, {
    dark: true
});

const psLightHighlight = HighlightStyle.define([
  {
      tag: tags.name,
      color: "#292929"
  },
  {
      tag: tags.bool,
      color: "#3B8589"
  },
  {
      tag: tags.typeName,
      color: "#6042B9"
  },
  {
      tag: tags.keyword,
      color: "#AD3DA3"
  },
  {
      tag: tags.definitionKeyword,
      color: "#AD3DA3"
  },
  {
      tag: tags.moduleKeyword,
      color: "#6042B9"
  },
  {
    tag: tags.labelName,
    color: "#e05ffc"
  },
  {
      tag: tags.modifier,
      color: "#6042B9"
  },
  {
      tag: tags.operator,
      color: "#AD3DA3"
  },
  {
      tag: tags.string,
      color: "#D51118"
  },
  {
      tag: tags.number,
      color: "#2222CB"
  },
  {
      tag: tags.lineComment,
      color: "#5D6C79"
  },
  {
      tag: tags.comment,
      color: "#5D6C79"
  },
])

const psDarkHighlight = HighlightStyle.define([
  {
      tag: tags.name,
      color: "white"
  },
  {
      tag: tags.bool,
      color: "#5DD8FF"
  },
  {
      tag: tags.typeName,
      color: "#D0A8FF"
  },
  {
      tag: tags.keyword,
      color: "#FC5FA3"
  },
  {
      tag: tags.definitionKeyword,
      color: "#FC5FA3"
  },
  {
      tag: tags.moduleKeyword,
      color: "#b281eb"
  },
  {
      tag: tags.labelName,
      color: "#e367ef"
  },
  {
      tag: tags.modifier,
      color: "#b281eb"
  },
  {
      tag: tags.operator,
      color: "#FC5FA3"
  },
  {
      tag: tags.string,
      color: "#FC6A5D"
  },
  {
      tag: tags.number,
      color: "#d9c97c"
  },
  {
      tag: tags.lineComment,
      color: "#6C7986"
  },
  {
      tag: tags.comment,
      color: "#6C7986"
  },
])

export { psLight, psDark, psLightHighlight, psDarkHighlight }