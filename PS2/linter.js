/*
  CodingCactus' 2 step linting process:
    - Identify possible statements
    - Validate statement, does it fit the pattern
*/

// DECLARE var : TYPE
const declare_identifiers = [
  /^[ \t]*DECLARE.*$/gm,
  /^[ \t]*[^"'\n]*:\s*\w*.*$/gm
]


// statement type => [regex[], regex]
// [0]: Regexes that find possble lines to be validated
// [1]: Regex that validates whether the found lines are correct
const checks = {
  declare: [declare_identifiers, /^[ \t]*DECLARE\s+[a-zA-Z_0-9]+\s*:\s*(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY)[ \t]*$/]
}

export function PS2Lint(view) {
  let diagnostics = []
  const document = view.state.doc.toString()
    
  for (const msg in checks) {
    let m
    let done = []
    
    const finders   = checks[msg][0]
    const validator = checks[msg][1]
    
    finders.forEach(find => {
      while (m = find.exec(document)) {
        if (!done.includes(m.index)) {
          done.push(m.index)

          const line = m[0]

          if (!line.match(validator)) {
            diagnostics.push({
              from: m.index,
              to: m.index + line.length,
              severity: "error",
              message: msg
            })
          }
        }
      }
    })
  }
  
  return diagnostics
}