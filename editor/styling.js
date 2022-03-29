import {EditorView, keymap} from "@codemirror/view"
import {tags, HighlightStyle} from "@codemirror/highlight"

const psLight = EditorView.theme({
  "&": {
      color: "black",
      backgroundColor: "#FFFFFF",
  },
  ".cm-scroller": {
      lineHeight: "1.6",
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
      backgroundColor: "#FFFFFF",
      color: "#aeaeae",
      border: "none"
  },
  ".cm-activeLine": {
      backgroundColor: "#E8F2FF",
  },
})

const psDark = EditorView.theme({
  "&": {
      color: "white",
      backgroundColor: "#1f1f24",
  },
  ".cm-scroller": {
      lineHeight: "1.6",
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
      backgroundColor: "#1f1f24",
      color: "#575757",
      border: "none"
  },
  ".cm-activeLine": {
      backgroundColor: "#23252B",
  },
}, {
    dark: true
});

const psLightHighlight = HighlightStyle.define([
  {
      tag: tags.name,
      color: "black"
  },
  {
      tag: tags.bool,
      color: "#0F68A0"
  },
  {
      tag: tags.typeName,
      color: "#3900A0"
  },
  {
      tag: tags.keyword,
      color: "#9B2393"
  },
  {
      tag: tags.definitionKeyword,
      color: "#9B2393"
  },
    {
      tag: tags.moduleKeyword,
      color: "#6C36A9"
  },
   {
      tag: tags.modifier,
      color: "#6C36A9"
  },
  {
      tag: tags.operator,
      color: "#9B2393"
  },
  {
      tag: tags.string,
      color: "#C41A16"
  },
  {
      tag: tags.number,
      color: "#1C00CF"
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