import {parser} from "./syntax.grammar"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, syntaxTree} from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"
import {completeFromList, CompletionContext} from "@codemirror/autocomplete";

export const PS2Language = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: cx => cx.baseIndent + (/^\s*(ELSE|ENDIF|ENDWHILE|UNTIL|NEXT|ENDFUNCTION|ENDPROCEDURE|ENDCASE|ENDTYPE)\b/.test(cx.textAfter) ? 0 : cx.unit)
      }),        
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        // https://github.com/codemirror/highlight/blob/001764b235eba7d9a8fc0a12b3855c459e2f5f85/src/highlight.ts#L549-L757
        Identifier: t.name,
        Boolean: t.bool,
        Type: t.typeName,
        Keyword: t.keyword,
        ModuleKeyword: t.moduleKeyword,
        FileKeyword: t.modifier,
        ApplicationStart: t.keyword,
        ApplicationEnd: t.keyword,
        Assignment: t.definitionKeyword,
        Operator: t.operator,
        Char: t.string,
        String: t.string,
        Number: t.number,
        LineComment: t.lineComment,
        "( )": t.bracket,
        "[ ]": t.squareBracket,
        "{ }": t.paren
      })
    ]
  }),
  languageData: {
    commentTokens: {line: "//"},
    indentOnInput: /^\s*([\}\]\)]|ELSE|ENDIF|NEXT|ENDFUNCTION|UNTIL|ENDWHILE|ENDPROCEDURE|ENDCASE|ENDTYPE)$/
  }
})

export function PS2() {
  return new LanguageSupport(
    PS2Language,
    PS2Language.data.of({
      autocomplete: (context: CompletionContext) => {        
        const tree = syntaxTree(context.state)
        const word = context.matchBefore(/\w*/)!

        if (word.from === word.to && !context.explicit) {
          return null
        }
        
        if (tree.cursor(context.pos, -1).name === "Identifier") { 
          let options = [
            { label: "OR",           type: "keyword"  },
            { label: "AND",          type: "keyword"  },
            { label: "NOT",          type: "keyword"  },
            { label: "UNTIL",        type: "keyword"  },
            { label: "IF",           type: "keyword"  },
            { label: "THEN",         type: "keyword"  },
            { label: "ELSE",         type: "keyword"  },
            { label: "ENDIF",        type: "keyword"  },
            { label: "WHILE",        type: "keyword"  },
            { label: "DO",           type: "keyword"  },
            { label: "ENDWHILE",     type: "keyword"  },
            { label: "DECLARE",      type: "keyword"  },
            { label: "PROCEDURE",    type: "keyword"  },
            { label: "ENDPROCEDURE", type: "keyword"  },
            { label: "ARRAY",        type: "keyword"  },
            { label: "OF",           type: "keyword"  },
            { label: "CALL",         type: "keyword"  },
            { label: "FUNCTION",     type: "keyword"  },
            { label: "ENDFUNCTION",  type: "keyword"  },
            { label: "RETURNS",      type: "keyword"  },
            { label: "RETURN",       type: "keyword"  },
            { label: "FOR",          type: "keyword"  }, 
            { label: "TO",           type: "keyword"  },
            { label: "STEP",         type: "keyword"  },
            { label: "NEXT",         type: "keyword"  },
            { label: "CASE",         type: "keyword"  },
            { label: "ENDCASE",      type: "keyword"  },
            { label: "OTHERWISE",    type: "keyword"  },
            { label: "TYPE",         type: "keyword"  },
            { label: "ENDTYPE",      type: "keyword"  },
            { label: "INTEGER",      type: "type"     },
            { label: "REAL",         type: "type"     },
            { label: "CHAR",         type: "type"     },
            { label: "STRING",       type: "type"     },
            { label: "BOOLEAN",      type: "type"     },
            { label: "DATE",         type: "type"     },
            { label: "TRUE",         type: "keyword"  },
            { label: "FALSE",        type: "keyword"  },
            { label: "CONSTANT",     type: "keyword"  },
            { label: "OUTPUT",       type: "function" },
            { label: "INPUT",        type: "function" },
            { label: "LEFT",         type: "function" },
            { label: "RIGHT",        type: "function" },
            { label: "MID",          type: "function" },
            { label: "LENGTH",       type: "function" },
            { label: "LEN",          type: "function" },
            { label: "LCASE",        type: "function" },
            { label: "UCASE",        type: "function" },
            { label: "TO_UPPER",     type: "function" },
            { label: "TO_LOWER",     type: "function" },
            { label: "NUM_TO_STR",   type: "function" },
            { label: "STR_TO_NUM",   type: "function" },
            { label: "IS_NUM",       type: "function" },
            { label: "ASC",          type: "function" },
            { label: "CHR",          type: "function" },
            { label: "INT",          type: "function" },
            { label: "RAND",         type: "function" },
            { label: "DAY",          type: "function" },
            { label: "MONTH",        type: "function" },
            { label: "YEAR",         type: "function" },
            { label: "DAYINDEX",     type: "function" },
            { label: "SETDATE",      type: "function" },
            { label: "NOW",          type: "function" },
            { label: "EOF",          type: "function" },
            { label: "MOD",          type: "function" },
            { label: "DIV",          type: "function" },
            { label: "OPENFILE",     type: "function" },
            { label: "CLOSEFILE",    type: "function" },
            { label: "EOF",          type: "function" },
            { label: "WRITEFILE",    type: "function" },
            { label: "READFILE",     type: "function" },
            { label: "SEEK",         type: "function" },
            { label: "GETRECORD",    type: "function" },
            { label: "PUTRECORD",    type: "function" },
            { label: "BYREF",        type: "keyword" },
            { label: "BYVAL",        type: "keyword" },
          ]
          
          let identifiers: Array<string> = []
               
          for (let i = 0; i < tree.length; i++) {
            const cursor = tree.cursor(i)
            if (cursor.type.name === "Identifier") {
              const identifier = context.state.sliceDoc(cursor.from, cursor.to)
              if (word.text !== identifier && !identifiers.includes(identifier)) {
                identifiers.push(identifier)
                options.push({
                  label: identifier,
                  type: "variable"
                })
              }
            }
          }

          return {
            from: word.from,
            options: options,
            span: /\w*$/
          }
        }

        return null
      }
    })
  )
}