'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var javascript$1 = require('@lezer/javascript');
var language = require('@codemirror/language');
var highlight = require('@codemirror/highlight');
var autocomplete = require('@codemirror/autocomplete');

/**
A collection of JavaScript-related
[snippets](https://codemirror.net/6/docs/ref/#autocomplete.snippet).
*/
const snippets = [
    autocomplete.snippetCompletion("function ${name}(${params}) {\n\t${}\n}", {
        label: "function",
        detail: "definition",
        type: "keyword"
    }),
    autocomplete.snippetCompletion("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n\t${}\n}", {
        label: "for",
        detail: "loop",
        type: "keyword"
    }),
    autocomplete.snippetCompletion("for (let ${name} of ${collection}) {\n\t${}\n}", {
        label: "for",
        detail: "of loop",
        type: "keyword"
    }),
    autocomplete.snippetCompletion("try {\n\t${}\n} catch (${error}) {\n\t${}\n}", {
        label: "try",
        detail: "block",
        type: "keyword"
    }),
    autocomplete.snippetCompletion("class ${name} {\n\tconstructor(${params}) {\n\t\t${}\n\t}\n}", {
        label: "class",
        detail: "definition",
        type: "keyword"
    }),
    autocomplete.snippetCompletion("import {${names}} from \"${module}\"\n${}", {
        label: "import",
        detail: "named",
        type: "keyword"
    }),
    autocomplete.snippetCompletion("import ${name} from \"${module}\"\n${}", {
        label: "import",
        detail: "default",
        type: "keyword"
    })
];

/**
A language provider based on the [Lezer JavaScript
parser](https://github.com/lezer-parser/javascript), extended with
highlighting and indentation information.
*/
const javascriptLanguage = language.LRLanguage.define({
    parser: javascript$1.parser.configure({
        props: [
            language.indentNodeProp.add({
                IfStatement: language.continuedIndent({ except: /^\s*({|else\b)/ }),
                TryStatement: language.continuedIndent({ except: /^\s*({|catch\b|finally\b)/ }),
                LabeledStatement: language.flatIndent,
                SwitchBody: context => {
                    let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after);
                    return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit;
                },
                Block: language.delimitedIndent({ closing: "}" }),
                ArrowFunction: cx => cx.baseIndent + cx.unit,
                "TemplateString BlockComment": () => -1,
                "Statement Property": language.continuedIndent({ except: /^{/ }),
                JSXElement(context) {
                    let closed = /^\s*<\//.test(context.textAfter);
                    return context.lineIndent(context.node.from) + (closed ? 0 : context.unit);
                },
                JSXEscape(context) {
                    let closed = /\s*\}/.test(context.textAfter);
                    return context.lineIndent(context.node.from) + (closed ? 0 : context.unit);
                },
                "JSXOpenTag JSXSelfClosingTag"(context) {
                    return context.column(context.node.from) + context.unit;
                }
            }),
            language.foldNodeProp.add({
                "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression": language.foldInside,
                BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 }; }
            }),
            highlight.styleTags({
                "get set async static": highlight.tags.modifier,
                "for while do if else switch try catch finally return throw break continue default case": highlight.tags.controlKeyword,
                "in of await yield void typeof delete instanceof": highlight.tags.operatorKeyword,
                "let var const function class extends": highlight.tags.definitionKeyword,
                "import export from": highlight.tags.moduleKeyword,
                "with debugger as new": highlight.tags.keyword,
                TemplateString: highlight.tags.special(highlight.tags.string),
                Super: highlight.tags.atom,
                BooleanLiteral: highlight.tags.bool,
                this: highlight.tags.self,
                null: highlight.tags.null,
                Star: highlight.tags.modifier,
                VariableName: highlight.tags.variableName,
                "CallExpression/VariableName TaggedTemplateExpression/VariableName": highlight.tags.function(highlight.tags.variableName),
                VariableDefinition: highlight.tags.definition(highlight.tags.variableName),
                Label: highlight.tags.labelName,
                PropertyName: highlight.tags.propertyName,
                PrivatePropertyName: highlight.tags.special(highlight.tags.propertyName),
                "CallExpression/MemberExpression/PropertyName": highlight.tags.function(highlight.tags.propertyName),
                "FunctionDeclaration/VariableDefinition": highlight.tags.function(highlight.tags.definition(highlight.tags.variableName)),
                "ClassDeclaration/VariableDefinition": highlight.tags.definition(highlight.tags.className),
                PropertyDefinition: highlight.tags.definition(highlight.tags.propertyName),
                PrivatePropertyDefinition: highlight.tags.definition(highlight.tags.special(highlight.tags.propertyName)),
                UpdateOp: highlight.tags.updateOperator,
                LineComment: highlight.tags.lineComment,
                BlockComment: highlight.tags.blockComment,
                Number: highlight.tags.number,
                String: highlight.tags.string,
                ArithOp: highlight.tags.arithmeticOperator,
                LogicOp: highlight.tags.logicOperator,
                BitOp: highlight.tags.bitwiseOperator,
                CompareOp: highlight.tags.compareOperator,
                RegExp: highlight.tags.regexp,
                Equals: highlight.tags.definitionOperator,
                "Arrow : Spread": highlight.tags.punctuation,
                "( )": highlight.tags.paren,
                "[ ]": highlight.tags.squareBracket,
                "{ }": highlight.tags.brace,
                "InterpolationStart InterpolationEnd": highlight.tags.special(highlight.tags.brace),
                ".": highlight.tags.derefOperator,
                ", ;": highlight.tags.separator,
                TypeName: highlight.tags.typeName,
                TypeDefinition: highlight.tags.definition(highlight.tags.typeName),
                "type enum interface implements namespace module declare": highlight.tags.definitionKeyword,
                "abstract global Privacy readonly override": highlight.tags.modifier,
                "is keyof unique infer": highlight.tags.operatorKeyword,
                JSXAttributeValue: highlight.tags.attributeValue,
                JSXText: highlight.tags.content,
                "JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": highlight.tags.angleBracket,
                "JSXIdentifier JSXNameSpacedName": highlight.tags.tagName,
                "JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": highlight.tags.attributeName
            })
        ]
    }),
    languageData: {
        closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
        commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
        indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
        wordChars: "$"
    }
});
/**
A language provider for TypeScript.
*/
const typescriptLanguage = javascriptLanguage.configure({ dialect: "ts" });
/**
Language provider for JSX.
*/
const jsxLanguage = javascriptLanguage.configure({ dialect: "jsx" });
/**
Language provider for JSX + TypeScript.
*/
const tsxLanguage = javascriptLanguage.configure({ dialect: "jsx ts" });
/**
JavaScript support. Includes [snippet](https://codemirror.net/6/docs/ref/#lang-javascript.snippets)
completion.
*/
function javascript(config = {}) {
    let lang = config.jsx ? (config.typescript ? tsxLanguage : jsxLanguage)
        : config.typescript ? typescriptLanguage : javascriptLanguage;
    return new language.LanguageSupport(lang, javascriptLanguage.data.of({
        autocomplete: autocomplete.ifNotIn(["LineComment", "BlockComment", "String"], autocomplete.completeFromList(snippets))
    }));
}

/**
Connects an [ESLint](https://eslint.org/) linter to CodeMirror's
[lint](https://codemirror.net/6/docs/ref/#lint) integration. `eslint` should be an instance of the
[`Linter`](https://eslint.org/docs/developer-guide/nodejs-api#linter)
class, and `config` an optional ESLint configuration. The return
value of this function can be passed to [`linter`](https://codemirror.net/6/docs/ref/#lint.linter)
to create a JavaScript linting extension.

Note that ESLint targets node, and is tricky to run in the
browser. The [eslint4b](https://github.com/mysticatea/eslint4b)
and
[eslint4b-prebuilt](https://github.com/marijnh/eslint4b-prebuilt/)
packages may help with that.
*/
function esLint(eslint, config) {
    if (!config) {
        config = {
            parserOptions: { ecmaVersion: 2019, sourceType: "module" },
            env: { browser: true, node: true, es6: true, es2015: true, es2017: true, es2020: true },
            rules: {}
        };
        eslint.getRules().forEach((desc, name) => {
            if (desc.meta.docs.recommended)
                config.rules[name] = 2;
        });
    }
    return (view) => {
        let { state } = view, found = [];
        for (let { from, to } of javascriptLanguage.findRegions(state)) {
            let fromLine = state.doc.lineAt(from), offset = { line: fromLine.number - 1, col: from - fromLine.from, pos: from };
            for (let d of eslint.verify(state.sliceDoc(from, to), config))
                found.push(translateDiagnostic(d, state.doc, offset));
        }
        return found;
    };
}
function mapPos(line, col, doc, offset) {
    return doc.line(line + offset.line).from + col + (line == 1 ? offset.col - 1 : -1);
}
function translateDiagnostic(input, doc, offset) {
    let start = mapPos(input.line, input.column, doc, offset);
    let result = {
        from: start,
        to: input.endLine != null && input.endColumn != 1 ? mapPos(input.endLine, input.endColumn, doc, offset) : start,
        message: input.message,
        source: input.ruleId ? "jshint:" + input.ruleId : "jshint",
        severity: input.severity == 1 ? "warning" : "error",
    };
    if (input.fix) {
        let { range, text } = input.fix, from = range[0] + offset.pos - start, to = range[1] + offset.pos - start;
        result.actions = [{
                name: "fix",
                apply(view, start) {
                    view.dispatch({ changes: { from: start + from, to: start + to, insert: text }, scrollIntoView: true });
                }
            }];
    }
    return result;
}

exports.esLint = esLint;
exports.javascript = javascript;
exports.javascriptLanguage = javascriptLanguage;
exports.jsxLanguage = jsxLanguage;
exports.snippets = snippets;
exports.tsxLanguage = tsxLanguage;
exports.typescriptLanguage = typescriptLanguage;
