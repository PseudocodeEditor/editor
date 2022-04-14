/*
  CodingCactus' 2 step linting process:
    - Identify possible statements
    - Validate statement, does it fit the pattern
*/


const keyword     = String.raw`(BREAK|INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY|OR|AND|REPEAT|UNTIL|IF|THEN|ELSE|ENDIF|WHILE|DO|ENDWHILE|OUTPUT|INPUT|DECLARE|PROCEDURE|ENDPROCEDURE|OF|CALL|FUNCTION|ENDFUNCTION|RETURNS|RETURN|FOR|TO|STEP|NEXT|CASE|ENDCASE|OTHERWISE|CONSTANT|BYREF|BYVAL|NOT|TYPE|ENDTYPE|OPENFILE|CLOSEFILE|EOF|READ|WRITE|APPEND|WRITEFILE|READFILE|RANDOM|SEEK|GETRECORD|PUTRECORD)`
const number      = String.raw`\d+(\.\d+)?`
const char        = String.raw`'([^'\\]|\\.)?'`
const string      = String.raw`"([^"\\]|\\.)*"`
const boolean     = String.raw`(TRUE|FALSE)`
const literal     = String.raw`(${number}|${char}|${string}|${boolean})`
const operator    = String.raw`(,|&|\+|-|\*|\/|=|<>|>|<|>=|<=|[ \t]+AND[ \t]+|[ \t]+OR[ \t]+)`
const variable    = String.raw`(?!${keyword})[a-zA-Z]+[a-zA-Z_\d]*[a-zA-Z\d]*`
const identifier  = String.raw`(${variable}|${literal})`
const assignable  = String.raw`${variable}[ \t]*((\.|\[)[ \t]*(${variable}|${number})([ \t]*,[ \t]*(${variable}|${number}))?[ \t]*\]?)*`
const expression  = String.raw`(NOT[ \t]+|(NOT[ \t]*?)?\([ \t]*?)*?(NOT[ \t]+)*?[ \t]*?${identifier}(((([ \t]*?(([ \t]+NOT[ \t]*?)*?\(|\[)[ \t]*?)+|\.)|[ \t]*?${operator}[ \t]*?)(NOT[ \t]+|(NOT[ \t]*?)?\([ \t]*?)*?(NOT[ \t]+)*?${identifier}[ \t]*?([ \t]*?(\)|\])[ \t]*?)*?)*?`
const line_start  = String.raw`^[ \t]*(${literal}[ \t]*:[ \t]*)?`
const maybe_break = String.raw`([ \t]+BREAK)?`
const line_end    = String.raw`[ \t]*$`


// DECLARE var : TYPE
const declare_identifiers = [
  /^[ \t]*DECLARE.*$/gm,
  /^[ \t]*[^"'\n\(]*:[ \t]*(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|ARRAY).*$/gm,
  /^[ \t]*(\w+[ \t]+){2,}:[ \t]*\w*.*$/gm
]

// var <- expression
const assignment_identifiers = [
  /^[ \t]*(?![ \t]*FOR\b)[^'"\n]*<-.*$/gm
]

// IF expression THEN
const if_identifiers = [
  /^[ \t]*IF[ \t]+.*$/gm,
  /^[ \t]*[^"'\n]*[ \t]+THEN$/gm
]

// CASE OF var
const case_identifiers = [
  /^[ \t]*CASE[ \t]+.*$/gm,
  /^[ \t]*[\w \t]*[ \t]+OF[ \t]+.*$/gm
]


// statement type => [regex[], regex]
// [0]: Regexes that find possble lines to be validated
// [1]: Regex that validates whether the found lines are correct
const checks = {
  declare: [declare_identifiers, new RegExp(String.raw`${line_start}DECLARE[ \t]+${variable}[ \t]*:[ \t]*(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE|(ARRAY[ \t]*\[[ \t]*${identifier}[ \t]*:[ \t]*${identifier}([ \t]*,[ \t]*${identifier}[ \t]*:[ \t]*${identifier})?[ \t]*\][ \t]*OF[ \t]*(INTEGER|REAL|CHAR|STRING|BOOLEAN|DATE)))${maybe_break}${line_end}`)],
  assignment: [assignment_identifiers, new RegExp(String.raw`${line_start}${assignable}[ \t]*<-[ \t]*${expression}${maybe_break}${line_end}`)],
  if: [if_identifiers, new RegExp(String.raw`${line_start}IF[ \t]+${expression}[ \t]+THEN${line_end}`)],
  case: [case_identifiers, new RegExp(String.raw`${line_start}CASE[ \t]+OF[ \t]+${variable}${line_end}`)]
}

function matchBrackets(s) {
  let stack = []
  
  for (let i = 0; i < s.length; i++) {
    const char = s.substr(i, 1)
    if (char === "(") stack.push(")")
    else if (char === "[") stack.push("]")

    else if (["]", ")"].includes(char)) {
      if (stack[stack.length-1] === char) stack.pop()
      else return false
    }    
  }

  return stack.length === 0
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

          let invalid

          try {
            invalid = !(line.match(validator) && matchBrackets(line))
          } catch(err) {
            invalid = true
          }
          
           if (invalid) {
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