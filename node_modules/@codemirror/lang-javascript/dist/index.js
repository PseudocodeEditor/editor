import { parser } from '@lezer/javascript';
import { LRLanguage, indentNodeProp, continuedIndent, flatIndent, delimitedIndent, foldNodeProp, foldInside, LanguageSupport } from '@codemirror/language';
import { styleTags, tags } from '@codemirror/highlight';
import { snippetCompletion, ifNotIn, completeFromList } from '@codemirror/autocomplete';

/**
A collection of JavaScript-related
[snippets](https://codemirror.net/6/docs/ref/#autocomplete.snippet).
*/
const snippets = [
    /*@__PURE__*/snippetCompletion("function ${name}(${params}) {\n\t${}\n}", {
        label: "function",
        detail: "definition",
        type: "keyword"
    }),
    /*@__PURE__*/snippetCompletion("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n\t${}\n}", {
        label: "for",
        detail: "loop",
        type: "keyword"
    }),
    /*@__PURE__*/snippetCompletion("for (let ${name} of ${collection}) {\n\t${}\n}", {
        label: "for",
        detail: "of loop",
        type: "keyword"
    }),
    /*@__PURE__*/snippetCompletion("try {\n\t${}\n} catch (${error}) {\n\t${}\n}", {
        label: "try",
        detail: "block",
        type: "keyword"
    }),
    /*@__PURE__*/snippetCompletion("class ${name} {\n\tconstructor(${params}) {\n\t\t${}\n\t}\n}", {
        label: "class",
        detail: "definition",
        type: "keyword"
    }),
    /*@__PURE__*/snippetCompletion("import {${names}} from \"${module}\"\n${}", {
        label: "import",
        detail: "named",
        type: "keyword"
    }),
    /*@__PURE__*/snippetCompletion("import ${name} from \"${module}\"\n${}", {
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
const javascriptLanguage = /*@__PURE__*/LRLanguage.define({
    parser: /*@__PURE__*/parser.configure({
        props: [
            /*@__PURE__*/indentNodeProp.add({
                IfStatement: /*@__PURE__*/continuedIndent({ except: /^\s*({|else\b)/ }),
                TryStatement: /*@__PURE__*/continuedIndent({ except: /^\s*({|catch\b|finally\b)/ }),
                LabeledStatement: flatIndent,
                SwitchBody: context => {
                    let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after);
                    return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit;
                },
                Block: /*@__PURE__*/delimitedIndent({ closing: "}" }),
                ArrowFunction: cx => cx.baseIndent + cx.unit,
                "TemplateString BlockComment": () => -1,
                "Statement Property": /*@__PURE__*/continuedIndent({ except: /^{/ }),
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
            /*@__PURE__*/foldNodeProp.add({
                "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression": foldInside,
                BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 }; }
            }),
            /*@__PURE__*/styleTags({
                "get set async static": tags.modifier,
                "for while do if else switch try catch finally return throw break continue default case": tags.controlKeyword,
                "in of await yield void typeof delete instanceof": tags.operatorKeyword,
                "let var const function class extends": tags.definitionKeyword,
                "import export from": tags.moduleKeyword,
                "with debugger as new": tags.keyword,
                TemplateString: /*@__PURE__*/tags.special(tags.string),
                Super: tags.atom,
                BooleanLiteral: tags.bool,
                this: tags.self,
                null: tags.null,
                Star: tags.modifier,
                VariableName: tags.variableName,
                "CallExpression/VariableName TaggedTemplateExpression/VariableName": /*@__PURE__*/tags.function(tags.variableName),
                VariableDefinition: /*@__PURE__*/tags.definition(tags.variableName),
                Label: tags.labelName,
                PropertyName: tags.propertyName,
                PrivatePropertyName: /*@__PURE__*/tags.special(tags.propertyName),
                "CallExpression/MemberExpression/PropertyName": /*@__PURE__*/tags.function(tags.propertyName),
                "FunctionDeclaration/VariableDefinition": /*@__PURE__*/tags.function(/*@__PURE__*/tags.definition(tags.variableName)),
                "ClassDeclaration/VariableDefinition": /*@__PURE__*/tags.definition(tags.className),
                PropertyDefinition: /*@__PURE__*/tags.definition(tags.propertyName),
                PrivatePropertyDefinition: /*@__PURE__*/tags.definition(/*@__PURE__*/tags.special(tags.propertyName)),
                UpdateOp: tags.updateOperator,
                LineComment: tags.lineComment,
                BlockComment: tags.blockComment,
                Number: tags.number,
                String: tags.string,
                ArithOp: tags.arithmeticOperator,
                LogicOp: tags.logicOperator,
                BitOp: tags.bitwiseOperator,
                CompareOp: tags.compareOperator,
                RegExp: tags.regexp,
                Equals: tags.definitionOperator,
                "Arrow : Spread": tags.punctuation,
                "( )": tags.paren,
                "[ ]": tags.squareBracket,
                "{ }": tags.brace,
                "InterpolationStart InterpolationEnd": /*@__PURE__*/tags.special(tags.brace),
                ".": tags.derefOperator,
                ", ;": tags.separator,
                TypeName: tags.typeName,
                TypeDefinition: /*@__PURE__*/tags.definition(tags.typeName),
                "type enum interface implements namespace module declare": tags.definitionKeyword,
                "abstract global Privacy readonly override": tags.modifier,
                "is keyof unique infer": tags.operatorKeyword,
                JSXAttributeValue: tags.attributeValue,
                JSXText: tags.content,
                "JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": tags.angleBracket,
                "JSXIdentifier JSXNameSpacedName": tags.tagName,
                "JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": tags.attributeName
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
const typescriptLanguage = /*@__PURE__*/javascriptLanguage.configure({ dialect: "ts" });
/**
Language provider for JSX.
*/
const jsxLanguage = /*@__PURE__*/javascriptLanguage.configure({ dialect: "jsx" });
/**
Language provider for JSX + TypeScript.
*/
const tsxLanguage = /*@__PURE__*/javascriptLanguage.configure({ dialect: "jsx ts" });
/**
JavaScript support. Includes [snippet](https://codemirror.net/6/docs/ref/#lang-javascript.snippets)
completion.
*/
function javascript(config = {}) {
    let lang = config.jsx ? (config.typescript ? tsxLanguage : jsxLanguage)
        : config.typescript ? typescriptLanguage : javascriptLanguage;
    return new LanguageSupport(lang, javascriptLanguage.data.of({
        autocomplete: ifNotIn(["LineComment", "BlockComment", "String"], completeFromList(snippets))
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

export { esLint, javascript, javascriptLanguage, jsxLanguage, snippets, tsxLanguage, typescriptLanguage };
