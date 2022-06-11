import {EditorView} from "@codemirror/view";
import {tags, HighlightStyle} from "@codemirror/highlight";

const psLight = EditorView.theme(
    {
        "&": {
            color: "#292929",
        },
        "&.cm-focused .cm-cursor": {
            borderLeftColor: "black"
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
            backgroundColor: "#A4CDFF"
        },
        ".cm-gutters": {
            color: "#A4A4A4"
        },
        ".cm-gutter": {
            minWidth: "3ch",
        },
        ".cm-activeLineGutter": {
            color: "black"
        },
        ".cm-foldPlaceholder": {
            backgroundColor: "#D9D9D9",
            color: "#6E6E6E"
        }
    }
);

const psDark = EditorView.theme(
    {
        "&": {
            color: "white",
        },
        "&.cm-focused .cm-cursor": {
            borderLeftColor: "white"
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
            backgroundColor: "#515B70"
        },
        ".cm-gutters": {
            color: "#575757"
        },
        ".cm-activeLineGutter": {
            color: "white"
        },
        ".cm-foldPlaceholder": {
            backgroundColor: "#3F3F41",
            color: "#9F9FA0"
        }
    }, {
        dark: true
    }
);

const psLightHighlight = HighlightStyle.define(
    [
        { tag: tags.name,              color: "#292929" },
        { tag: tags.bool,              color: "#3B8589" },
        { tag: tags.string,            color: "#D51118" },
        { tag: tags.number,            color: "#2222CB" },
        { tag: tags.comment,           color: "#5D6C79" },
        { tag: tags.keyword,           color: "#AD3DA3" },
        { tag: tags.typeName,          color: "#6042B9" },
        { tag: tags.modifier,          color: "#6042B9" },
        { tag: tags.operator,          color: "#AD3DA3" },
        { tag: tags.labelName,         color: "#6227ed" },
        { tag: tags.lineComment,       color: "#5D6C79" },
        { tag: tags.moduleKeyword,     color: "#6042B9" },
        { tag: tags.definitionKeyword, color: "#AD3DA3" }
    ]
);

const psDarkHighlight = HighlightStyle.define([
    { tag: tags.name,              color: "white" },
    { tag: tags.bool,              color: "#5DD8FF" },
    { tag: tags.string,            color: "#FC6A5D" },
    { tag: tags.number,            color: "#d9c97c" },
    { tag: tags.comment,           color: "#6C7986" },
    { tag: tags.keyword,           color: "#FC5FA3" },
    { tag: tags.typeName,          color: "#D0A8FF" },
    { tag: tags.modifier,          color: "#b281eb" },
    { tag: tags.operator,          color: "#FC5FA3" },
    { tag: tags.labelName,         color: "#e367ef" },
    { tag: tags.lineComment,       color: "#6C7986" },
    { tag: tags.moduleKeyword,     color: "#b281eb" },
    { tag: tags.definitionKeyword, color: "#FC5FA3" }
]);

export { psLight, psDark, psLightHighlight, psDarkHighlight };
