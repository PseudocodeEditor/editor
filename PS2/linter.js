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

// IF expression THEN
const if_identifiers = [
  /^[ \t]*IF.*/gm,
  /^[ \t]*[^"'\n]*THEN/gm
]


// statement type => [regex[], regex]
// [0]: Regexes that find possble lines to be validated
// [1]: Regex that validates whether the found lines are correct
const checks = {
  declare: [declare_identifiers, /^[ \t]*DECLARE\s+[a-zA-Z_0-9]+\s*:\s*(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY)[ \t]*$/],
  if:      [if_identifiers,      /^[ \t]*IF(\s+|(\s*\(\s*)+)(NOT\s+)?(\(\s*)?([a-zA-Z_0-9.\[\]\(\)]+|'([^'\\]|\\.)?'|"([^"\\]|\\.)*")(\s*\)\s*)?(\s*(\+|-|\*|\/|=|<>|>|<|>=|<=|\s+AND\s+|\s+OR\s+)(\s*(\(|\)))?\s*(NOT(\s*\(\s*|\s+)?)?([a-zA-Z_0-9.\[\]\(\)]+|'([^'\\]|\\.)?'|"([^"\\]|\\.)*"))*((\s*\)\s*)?|\s+)THEN[ \t]*$/]
}

function matchBrackets(s) {
  let count = 0
  for (let i = 0; i < s.length; i++) {
    if (s.substr(i, 1) == "(") count++
    else if (s.substr(i, 1) == ")") count--
  }

  return count === 0
}

export function PS2Lint(view) {
  let diagnostics = []
  const document = view.state.doc.toString()
    
  for (const type in checks) {
    let m
    let done = []
    
    const finders   = checks[type][0]
    const validator = checks[type][1]
    
    finders.forEach(find => {
      while (m = find.exec(document)) {
        if (!done.includes(m.index)) {
          done.push(m.index)

          const line = m[0]

          if (!line.match(validator) || (type === "if" && !matchBrackets(line))) {
            diagnostics.push({
              from: m.index,
              to: m.index + line.length,
              severity: "error",
              message: `Invalid ${type} statement.`
            })
          }
        }
      }
    })
  }
  
  return diagnostics
}