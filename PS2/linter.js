export function PS2Lint(view) {
  let diagnostics = []
  let statements, doc, m


  // DECLARE var : somethingIncorrect
  
  statements = /^([ \t]*DECLARE\s+[a-zA-Z_0-9]+\s*:\s*(?!(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY)))(\w*)[ \t]*$/gm
  doc = view.state.doc.toString()
  
  while (m = statements.exec(doc)) {
    diagnostics.push({
      from: m.index + m[1].length,
      to: m.index + m[1].length + m[3].length,
      severity: 'error',
      message: `"${ m[3] }" is not a valid type.`,
      actions: [
        {
          name: 'INTEGER',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "INTEGER" } })
          }
        },
        {
          name: 'REAL',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "REAL" } })
          }
        },
        {
          name: 'CHAR',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "CHAR" } })
          }
        },
        {
          name: 'STRING',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "STRING" } })
          }
        },
        {
          name: 'BOOLEAN',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "BOOLEAN" } })
          }
        },
        {
          name: 'DATE',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "DATE" } })
          }
        },
        {
          name: 'ARRAY',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "ARRAY[start:end] OF TYPE" } })
          }
        }
      ]
    })
  }


  // DECLARE var TYPE (missing colon)
  
  statements = /^([ \t]*DECLARE\s+[a-zA-Z_0-9]+)(\s*)(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY)[ \t]*$/gm
  doc = view.state.doc.toString()
  
  while (m = statements.exec(doc)) {
    diagnostics.push({
      from: m.index + m[1].length,
      to: m.index + m[1].length + m[2].length,
      severity: 'error',
      message: `Missing a colon between variable name and type`,
      actions: [
        {
          name: 'Fix',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: " : " } })
          }
        }
      ]
    })
  }


  // DECLARE : TYPE (missing variable name)
  
  statements = /^([ \t]*DECLARE)(\s*):\s*(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY)[ \t]*$/gm
  doc = view.state.doc.toString()
  
  while (m = statements.exec(doc)) {
    diagnostics.push({
      from: m.index + m[1].length,
      to: m.index + m[1].length + m[2].length,
      severity: 'error',
      message: `Missing a variable name`,
      actions: [
        {
          name: 'Fix',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: " MyVar " } })
          }
        }
      ]
    })
  }


  // asdasfsdagf var : TYPE (DECLARE spelt wrong)
  
  statements = /^([ \t]*)((?!(DECLARE))[^\s]*)\s+[a-zA-Z_0-9]+\s*:\s*(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY)[ \t]*$/gm
  doc = view.state.doc.toString()
  
  while (m = statements.exec(doc)) {
    diagnostics.push({
      from: m.index + m[1].length,
      to: m.index + m[1].length + m[2].length,
      severity: 'error',
      message: `Misspelt declare keyword`,
      actions: [
        {
          name: 'Fix',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "DECLARE" } })
          }
        }
      ]
    })
  }


  // var : TYPE (missing DECLARE)
  
  statements = /^([ \t]*)[a-zA-Z_0-9]+\s*:\s*(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY)[ \t]*$/gm
  doc = view.state.doc.toString()
  
  while (m = statements.exec(doc)) {
    diagnostics.push({
      from: m.index + m[1].length,
      to: m.index + m[1].length + 1,
      severity: 'error',
      message: `Missing declare keyword`,
      actions: [
        {
          name: 'Fix',
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "DECLARE " + view.state.sliceDoc(to-1, to) } })
          }
        }
      ]
    })
  }


  // DECLARE var var ... : TYPE (multiple words in variable name)
  
  statements = /^([ \t]*DECLARE\s+)((\s+[a-zA-Z_0-9]+){2,})\s*:\s*(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY)[ \t]*$/gm
  doc = view.state.doc.toString()
  
  while (m = statements.exec(doc)) {
    diagnostics.push({
      from: m.index + m[1].length + 1,
      to: m.index + m[1].length + m[2].length,
      severity: 'error',
      message: `Variable names can only be one word`      
    })
  }
  
  return diagnostics
}