from ps2.scan.ps2_token import TokenType as TT, Token, keywords

class Scanner:
    def __init__(self, source):
        self.start = 0
        
        self.current = 0
        self.line = 1

        self.tokens = []
        self.source = source

    def scanTokens(self):
        while not self.isAtEnd():
            self.start = self.current
            self.scanToken()

        self.tokens.append(Token(TT.AT_EOF, "", None, self.line))
        
        return self.tokens;

    def scanToken(self):
        c = self.advance()

        if c == "(":
            self.addToken(TT.LEFT_PAREN)

        elif c == ")":
            self.addToken(TT.RIGHT_PAREN)

        elif c == "{":
            self.addToken(TT.LEFT_BRACE)

        elif c == "}":
            self.addToken(TT.RIGHT_BRACE)

        elif c == "[":
            self.addToken(TT.LEFT_BRACK)

        elif c == "]":
            self.addToken(TT.RIGHT_BRACK)

        elif c == ",":
            self.addToken(TT.COMMA)

        elif c == ".":
            self.addToken(TT.DOT)

        elif c == "-":
            self.addToken(TT.MINUS)

        elif c == "+":
            self.addToken(TT.PLUS)

        elif c == "&":
            self.addToken(TT.AMPERSAND)

        elif c == ";":
            self.addToken(TT.SEMICOLON)

        elif c == ":":
            self.addToken(TT.COLON)

        elif c == "*":
            self.addToken(TT.STAR)

        elif c == "'":
            self.char()

        elif c == "!":
            self.addToken(TT.BANG_EQUAL if self.match("=") else TT.BANG)

        elif c == "=":
            self.addToken(TT.EQUAL_EQUAL if self.match("=") else TT.EQUAL)

        elif c == "<":

            if self.match("=") : # matching <=
                self.addToken(TT.LESS_EQUAL)

            elif self.match("-"): # matching <- assignment
                self.addToken(TT.ASSIGN)

            elif self.match(">"): # matching <> not equal
                self.addToken(TT.LESS_GREATER)

            else: # just <
                self.addToken(TT.LESS)

        elif c == ">":
            self.addToken(TT.GREATER_EQUAL if self.match("=") else TT.GREATER)

        elif c == "/":
            if self.match('/'): # Ignore comments
                while self.peek() != "\n" and not self.isAtEnd(): 
                    self.advance()
            else:
                self.addToken(TT.SLASH)

        elif c == " " or c == "\r" or c == "\t":
          pass

        elif c == "\n":
            self.line += 1

        elif c == '"':
            self.string()

        else:
            if c.isdigit():
                self.number()

            elif c.isalpha() or c == '_':
                self.identifier()

            else:
                raise SyntaxError([self.line, f"unrecognised token '{c}'"])
    
    def match(self, expected):
        if self.isAtEnd():
            return False

        if self.source[self.current] != expected:
            return False

        self.current += 1
        return True

    def addToken(self, *args, **kwargs):
        if len(args) == 1:
            self.addToken(args[0], None)

        elif len(args) == 2: #length == 2
            self.tokens.append(Token(args[0], self.source[self.start:self.current], args[1], self.line))

    def advance(self):
        c = self.source[self.current]
        self.current += 1
        return c

    def isAtEnd(self):
        return self.current >= len(self.source)
        

    def peek(self):
        if self.isAtEnd(): 
            return ""

        return self.source[self.current]
  
    def peekNext(self):
        if self.current + 1 > len(self.source): 
            return ""
            
        return self.source[self.current + 1]

    def string(self):
        while self.peek() != '"' and not self.isAtEnd():
            if self.peek() == "\n":
                self.line += 1
            self.advance()

        if self.isAtEnd():
            raise SyntaxError ([self.line, "unterminated string"])

        self.advance() # closing "
        # trim surrounding string

        value = self.source[self.start + 1 : self.current -1]
        self.addToken(TT.STRING, value)


    def char(self):
        value = ""
        if not self.isAtEnd():
            if self.peek() != "'":
                value = self.peek()
                self.advance()
            if self.peek() != "'":
                raise SyntaxError ([self.line, f"expected ' after {value}"])        
            else:
                self.advance()
        else:
            raise SyntaxError ([self.line, "unterminated character"])

        self.addToken(TT.QUOTE, value)

    def number(self):
        
        while self.peek().isdigit():
            self.advance()

        # Look for a fractional part.
        if self.peek() == "." and self.peekNext().isdigit():
            
            # Consume the "."
            self.advance()

            while self.peek().isdigit(): 
                self.advance()

            self.addToken(TT.REAL, float(self.source[self.start:self.current]))
        else:
            self.addToken(TT.INTEGER, int(self.source[self.start:self.current]))
    
    def identifier(self):
        while self.peek().isalnum() or self.peek() == "_":
            self.advance()

        identifier = self.source[self.start:self.current]
        if identifier in keywords:
            self.addToken(keywords[identifier])
        else:    
            self.addToken(TT.IDENTIFIER, identifier)
        