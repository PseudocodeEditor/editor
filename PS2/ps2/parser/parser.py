from ps2.scan.ps2_token import TokenType as TT
from ps2.expr.expression import LITERAL, IDENTIFIER, ARRAY, BINARY, UNARY, FUNCTION, GROUPING
from ps2.statement.statement import Statement, DECLARE, ASSIGN, DECLARE_ARRAY, DECLARE_FUNCTION, DECLARE_PROCEDURE, ARRAY_ASSIGN, PRINT, INPUT, IF, IF_ELSE, CASE, WHILE, REPEAT, FOR, CALL, OPENFILE, CLOSEFILE, READFILE, WRITEFILE, RETURN, DECLARE_TYPE

class Parser:

    def __init__(self, tokens):
        self.tokens = tokens
        self.current = 0

    def match(self, tokens):

        if self.peek().type in tokens:
            self.advance()
            return True

        return False

    def peek(self):
        return self.tokens[self.current]

    def advance(self):
        if self.current < len(self.tokens):
            tok = self.tokens[self.current]
            self.current += 1
            return tok
        else:
            raise SyntaxError([self.tokens[self.current].line, "Unexpected EOF"])

    def undo(self):
        if self.current > 0:
            self.current -= 1

    def sync(self, *argv):
        while self.peek().type != TT.AT_EOF and self.peek().type not in Statement.valid_statements:
            self.advance() # throw away tokens

    def previous(self):
        if self.current > 0:
            return self.tokens[self.current - 1]
        else:
            raise RuntimeError([self.tokens[self.current].line, "Internal: Call to Parser.previous without previous token"])

    def isAtEnd(self):
        return self.peek().type == TT.AT_EOF            

    def parse(self):
        stmt_list = []
        while not self.isAtEnd():
            stmt_list.append(self.statement())
        return stmt_list

    def declaration_stmt(self, line):
        """
        Function to parse a DECLARE statement, e.g. DECLARE Num : INTEGER
        """

        # Now match an idenifier and get it's name
        if not self.match([TT.IDENTIFIER]):
            raise SyntaxError([self.previous().line, f"Declaration missing an identifier, got '{self.peek().lexeme}' instead"])

        name = self.previous().literal
        
        # Now match a colon
        if not self.match([TT.COLON]):
            raise SyntaxError([self.previous().line, f"Declaration missing ':', got '{self.peek().lexeme}' instead"])                   

        # Now looks for a data type
        if self.match([TT.ARRAY]): # Found an ARRAY declaration

            if not self.match([TT.LEFT_BRACK]):
                raise SyntaxError([self.previous().line, f"ARRAY declaration missing '[', got '{self.peek().lexeme}' instead"])

            dimensions = [] # this is an array of tuples [ (a,b), (c,d) .. ], where each tuple is a dimension

            while self.peek().type != TT.RIGHT_BRACK:
                    
                # Now get the dimensions of the ARRAY
                #------------------------------------

                start = self.primary(line) # start index

                if type(start.expression) != int:
                    raise SyntaxError([self.previous().line, f"ARRAY declaration start index needs to be an integer'"])

                if not self.match([TT.COLON]):
                    raise SyntaxError([self.previous().line, f"ARRAY declaration missing ':', got '{self.peek().lexeme}"])
                                
                end = self.expression(line)

                # if type(end.expression) != int:
                #     raise SyntaxError([self.previous().line, f"ARRAY declaration end index needs to be an integer'"])

                # dimensions.append( (start.expression, end.expression) )
                dimensions.append( (start, end) )

                if not self.peek().type == TT.COMMA:
                    break
                else:
                    self.advance()

            #------------------------------------

            if not self.match([TT.RIGHT_BRACK]):
                raise SyntaxError([self.previous().line, f"ARRAY declaration missing ']', got '{self.peek().lexeme}' instead"])

            # Now get the type of ARRAY                    
            if not self.match([TT.OF]):
                raise SyntaxError([self.previous().line, f"ARRAY declaration missing 'OF', got '{self.peek().lexeme}' instead"])


            # Now get they type of the Variable
            if self.match([TT.IDENTIFIER]): # Array of User defined types
                token = self.previous()
                return DECLARE_ARRAY(name+":"+token.lexeme, dimensions, token.type, line)
                
            elif self.match([TT.INTEGER, TT.REAL, TT.STRING, TT.BOOLEAN, TT.CHAR]):
                return DECLARE_ARRAY(name, dimensions, self.previous().type, line)
                
            else:
                raise SyntaxError([self.previous().line, f"ARRAY declaration missing valid type, got '{self.peek().lexeme}', expected INTEGER, REAL, STRING, BOOLEAN, CHAR"])

        elif self.match([TT.INTEGER, TT.REAL, TT.STRING, TT.BOOLEAN, TT.CHAR]) :
            
            return DECLARE(name, self.previous().type, line, False)

        else: # It must be a User Defined Type
            self.advance()

            token = self.previous()
            
            return DECLARE(name+":"+token.lexeme, token.type, line, False)

            
    def function_decl_stmt(self, line):
        """
        Parse a FUNCTION declaration, 

        e.g. FUNCTION IDENTIFIER RETURNS <type> ENDFUNCTION

        or FUNCTION IDENTIFIER (A: <type>, B<type>, ... ) RETURNS <type> ENDFUNCTION
        """

        # Now match an identifier and get it's name
        if not self.match([TT.IDENTIFIER]):
            raise SyntaxError([self.previous().line, f"Declaration missing an identifier, got '{self.peek().lexeme}' instead"])

        name = self.previous().literal

        args = self.param_list(line)

        # Now match RETURNS keyword
        if not self.match([TT.RETURNS]):
                raise SyntaxError([self.previous().line, f"Declaration missing 'RETURNS', got '{self.peek().lexeme}' instead"])                   

        # Now match a valid data type
        if not self.match([TT.INTEGER, TT.REAL, TT.STRING, TT.BOOLEAN, TT.CHAR, TT.ARRAY]):
            raise SyntaxError([self.previous().line, f"Declaration missing valid type, found, got '{self.peek().lexeme}', expected INTEGER, REAL, STRING, BOOLEAN, CHAR, ARRAY"])

        rtype = self.previous().type

        # Now get the function statement block - checks are made inside stmt_block for an empty stmt block or terminator not found 
        stmt_list = self.stmt_block([TT.ENDFUNCTION], line)

        return DECLARE_FUNCTION (name, args, stmt_list, rtype, line)

    def procedure_decl_stmt(self, line):
        """
        Parse a PROCEDURE declaration, 

        e.g. PROCEDURE IDENTIFIER statements ENDPROCEDURE

        or PROCEDURE IDENTIFIER (A: <type>, B<type>, ... ) statements ENDPROCEDURE
        """

        # Now match an identifier and get it's name
        if not self.match([TT.IDENTIFIER]):
            raise SyntaxError([self.previous().line, f"Declaration missing an identifier, got '{self.peek().lexeme}' instead"])

        name = self.previous().literal

        args = self.param_list(line)

        # Now get the procedure statement block - checks are made inside stmt_block for an empty stmt block or terminator not found 
        stmt_list = self.stmt_block([TT.ENDPROCEDURE], line)

        return DECLARE_PROCEDURE (name, args, stmt_list, line)

    
    def array_assign_stmt(self, name, line):

        indices = self.expr_list()

        if self.match([TT.RIGHT_BRACK]):
            if self.match([TT.ASSIGN]):
                expr = self.expression(line)
                
                return ARRAY_ASSIGN(name, indices, expr, line)

            else:
                SyntaxError([line, f"Missing '<-' while parsing for array assignment"])

        else:
            raise SyntaxError([line, f"Unable to match ']' for array assignment"])

    def assign_stmt(self, name, line):

        expr = self.expression(self.previous().line)
        return ASSIGN(name, expr, line)


    def expr_list( self, delimiter=TT.COMMA ): 
        '''
            Parse a delimited list of expressions  
        '''
        expr_list = []

        expr = self.expression(self.previous().line)

        while expr is not None:

            expr_list.append(expr)

            if self.peek().type != TT.COMMA:
                break
            else:
                self.advance()

            expr = self.expression(self.previous().line)

        return expr_list  

    def print_stmt(self, line):
        '''
        Function to parse a PRINT statement, e.g. PRINT 4 + 3
        also supports an expression list, i.e. PRINT 1, 2, 3
        '''
        expr_list = self.expr_list()

        if len(expr_list) == 0: 
            # Missing expression for PRINT
            raise SyntaxError([self.previous().line, f"Missing expression for PRINT or OUTPUT"] )
        
        return PRINT (expr_list, line) 

    def input_stmt(self, line):
        '''
        Function to parse an INPUT statement, e.g. INPUT <identifier>
        identifier needs to be pre-declared.
        '''

        if self.match([TT.IDENTIFIER]):
            name = self.previous().literal
            return INPUT (name, line)
        else:
            raise SyntaxError([self.previous().line, f"Missing identifier for INPUT"] )


    def stmt_block(self, block_terminator, line):
        '''
        Function to parse a statement group

        :param block_terminator: Indicates the tokens to end a statement group
        :type: TokenType

        :return: List
        '''
        
        # A list is used to store statements
        stmt_list = []

        # While we are not at the end of the program and we have found the terminator token
        while not self.isAtEnd() and not self.match(block_terminator):

            # call and add statement() to our statement list
            stmt_list.append(self.statement())

        # Syntax error, we reached the end of the program without finding a termninator
        if self.previous().type not in block_terminator:
            raise SyntaxError([line, f"Unexpected EOF while looking for '{block_terminator}'"] )

        # Syntax error, we didn't find any statements
        if len(stmt_list) == 0:
            raise SyntaxError([line, "Empty statement block"])

        return stmt_list

    def if_stmt(self, line):
        expr = self.expression(self.previous().line)

        if not self.match([TT.THEN]):
            raise SyntaxError([self.peek().line, f"Expected 'THEN' got '{self.peek().lexeme}'"])

        else:
            stmt_list = self.stmt_block([TT.ENDIF, TT.ELSE], line)
            if self.previous().type == TT.ELSE:
                else_stmt_list = self.stmt_block([TT.ENDIF], line)
                return IF_ELSE (expr, stmt_list, else_stmt_list, line)
            else:
                return IF (expr, stmt_list, line)

    def case_stmt(self, line):
        
        if not self.match([TT.OF]):
            raise SyntaxError([self.peek().line, f"Expected 'OF' got '{self.peek().lexeme}'"])

        line = self.previous().line
        expr = self.expression(line)

        cases = []
        while not self.match([TT.ENDCASE]):
            
             # allow an empty expression to check for OTHERWISE
            value = self.expression(line, checkNone=False)
            if value == None:
                if self.peek().type != TT.OTHERWISE:
                    raise SyntaxError([line, "Missing expression while parsing CASE"])
                else:
                    self.match([TT.OTHERWISE]);
            
            if not self.match([TT.COLON]):
                raise SyntaxError([self.peek().line, f"expected a : got '{self.peek().lexeme}'"])

            stmt_list = self.stmt_block([TT.BREAK], line)

            if value == None and self.peek().type != TT.ENDCASE:
                raise SyntaxError([line, "OTHERWISE should be the last CASE value"])
                
            cases.append((value, stmt_list))
        
        return CASE(expr, cases, line)
    
    def while_stmt(self, line):

        # Get the condition        
        expr = self.expression(self.previous().line)

        # Now match DO
        if not self.match([TT.DO]):
            raise SyntaxError([self.peek().line, f"Syntax: expected 'DO' got '{self.peek().lexeme}'"])

        else:            
            stmt_list = self.stmt_block([TT.ENDWHILE], line)
            return WHILE (expr, stmt_list, line)


    def repeat_stmt(self, line):

        # Get statement block
        stmt_list = self.stmt_block([TT.UNTIL], line)

        # Get the condition        
        expr = self.expression(self.previous().line)

        return REPEAT (expr, stmt_list, line)

    # Function to parse the parameter list for a function or a procedure
    def param_list(self, line):

        args = []

        if not self.match([TT.LEFT_PAREN]): # Function or procedure does not have parameters
            return args

        while not self.isAtEnd():
            if self.match([TT.RIGHT_PAREN]): # End of the param list
                return args

            if not self.match([TT.IDENTIFIER]):
                raise SyntaxError(line, f"Expected a parameter identifier, got a {self.peek().type}")

            name = self.previous().literal

            if not self.match([TT.COLON]):
                raise SyntaxError(line, f"Expected a type seperator :, got a {self.peek().type}")

            if not self.match([TT.INTEGER, TT.REAL, TT.STRING, TT.BOOLEAN, TT.CHAR, TT.ARRAY]):
                raise SyntaxError([self.previous().line, f"Declaration missing valid type, found, got '{self.peek().lexeme}', expected INTEGER, REAL, STRING, BOOLEAN, CHAR, ARRAY"])

            ptype = self.previous().type

            args.append((name, ptype))

            # try and match a comma
            self.match([TT.COMMA])
        
        raise SyntaxError(line, f"Unexpected EOF while parsing parameter list")

    def call_stmt(self, line):

        args = []
        name = None
        
        if self.match([TT.IDENTIFIER]):            
            name = self.previous().literal 

        else:
            raise SyntaxError([line, f"CALL statement expected an identifier, got {self.peek().literal}"])

        if self.match([TT.LEFT_PAREN]):

            while not self.isAtEnd():
                args.append(self.expression(line))
                if self.match([TT.RIGHT_PAREN]):
                    break
    
                elif self.match([TT.COMMA]):
                    continue
        else: # procedure without arguments
            print
            
    
        return CALL (name, args, line)


    def constant_stmt(self, line):

        name = None

        if self.match([TT.IDENTIFIER]):
            name = self.previous().literal

        else:
            raise SyntaxError([line, f"CONSTANT missing identifier, got {self.peek().lexeme}"])

        if not self.match([TT.EQUAL]):
            raise SyntaxError([line, f"CONSTANT missing '=', got {self.peek().lexeme}"])

        value = self.primary(line)

        if value == None:
            raise SyntaxError([line, f"CONSTANT missing a value"])

        value = value.expression

        vtype = None
        if type(value) == str:
            vtype = TT.STRING

        elif type(value) == bool:
            vtype = TT.BOOLEAN

        elif type(value) == float:
            vtype = TT.REAL

        elif type(value) == int:
            vtype = TT.INTEGER

        else:
            raise SyntaxError([line, f"CONSTANT doesn't recognise value type"])

        return DECLARE(name, vtype, line, True, value)


    def for_stmt(self, line): # CONSTANT <identifier> = <value>

        assign = None
        
        # now match an identifier
        if self.match([TT.IDENTIFIER]):

            name = self.previous().literal
            if self.match([TT.ASSIGN]):
                assign = self.assign_stmt(name, line) # e.g. I <- 1
            else:
                raise SyntaxError([line, f"FOR Missing '<-'"])

        if not isinstance(assign, ASSIGN):
            raise SyntaxError([line, f"Missing 'identifier <- expression'"])

        else:

            if not self.match([TT.TO]):
                raise SyntaxError([line, f"Expected TO, got '{self.peek().lexeme}'"])

            else:
                end = self.expression(self.previous().line)

                if end == None:
                    raise SyntaxError([line, "end expression missing after TO"])
                    
                # Check if we have a 'STEP' keyword - this is optional
                step = None
                if self.match([TT.STEP]):
                    step = self.expression(self.previous().line)

                # Get statement block
                stmt_list = self.stmt_block([TT.NEXT], line)

                if not self.match([TT.NEXT]) and not self.match([TT.IDENTIFIER]):
                    raise SyntaxError([self.previous().line, f"Expected NEXT followed by an Identifier"])

                else:
                    return FOR (assign, end, step, stmt_list, line)

    def return_stmt(self, line):
        return RETURN (self.expression(line, checkNone=False))

    def file_handling_stmt(self, line):

        if self.previous().type == TT.OPENFILE:
            expr = self.expression(line)

            if not self.match([TT.FOR]):
                raise SyntaxError([line, f"Missing FOR for OPENFILE"])                 
            if not self.match([TT.READ, TT.WRITE, TT.APPEND]):
                raise SyntaxError([line, f"Invalid file mode {self.peek().literal}"])

            return OPENFILE (expr, self.previous().type, line)

        elif self.previous().type == TT.CLOSEFILE:
            expr = self.expression(line)

            return CLOSEFILE (expr, line)

        elif self.previous().type == TT.READFILE:
            file_id = self.expression(line)
                          
            if not self.match([TT.COMMA]):
                raise SyntaxError([line, f"READFILE: expected a comma after the file id - got {self.peek().literal}"])

            if not self.match([TT.IDENTIFIER]):
                raise SyntaxError([line, f"READFILE: expected an identfier after the comma - got {self.peek().literal}"])

            return READFILE (file_id, self.previous().literal, line)

        elif self.previous().type == TT.WRITEFILE:
            file_id = self.expression(line)
         
            if not self.match([TT.COMMA]):
                raise SyntaxError([line, f"Expected a comma after the file id - got {self.peek().literal}"])

            expr = self.expression(line)

            return WRITEFILE (file_id, expr, line)

        raise SyntaxError([line, f"Expected file operation {self.previous().literal}"])

    def type_stmt(self, line):
        # They are three type of user defined data types
        # 
        if not self.match([TT.IDENTIFIER]):
            raise SyntaxError([line, f"TYPE expected an identifier, got {self.peek().literal} instead"])

        name = self.previous().literal

        # Check for non-composite types Enum and Pointer
        if self.match([TT.EQUAL]): # Non-composite
            # Check if its an Enum or a pointer

            if self.match([TT.LEFT_BRACK]): # Enum type found
                value = []

                return DECLARE_TYPE (name, DECLARE_TYPE.TYPE.ENUM, value, line)
                
            elif self.match([TT.CAP]): # Pointer type found
                value = None
                return DECLARE_TYPE (name, DECLARE_TYPE.TYPE.POINTER, value, line)    
                
            else:
                raise SyntaxError([line, f"unknown type {name} declared"])
            
        elif self.match([TT.DECLARE]): # Composite

            value = []
            
            value.append(self.declaration_stmt(line))

            while not self.match([TT.ENDTYPE]):
                
                if self.match([TT.DECLARE]):
                    value.append(self.declaration_stmt(line))
                    
                else:
                    raise SyntaxError([line, f"TYPE unexpected DECLARE, got {self.peek().literal} instead"])     

            return DECLARE_TYPE (name, DECLARE_TYPE.TYPE.COMPOSITE, value, line)

        else: # Unknown type
            raise SyntaxError([line, f"TYPE unexpected value after identifier, {self.peek().literal} instead"])
        
    
    def statement(self):

        if self.match([TT.DECLARE]):
            return self.declaration_stmt(self.previous().line)

        elif self.match([TT.IDENTIFIER]):

            name = self.previous().literal
            
            if self.match([TT.ASSIGN]):
                return self.assign_stmt(name, self.previous().line)

            elif self.match([TT.DOT]): # Composite data

                if not self.match([TT.IDENTIFIER]):
                    raise SyntaxError([self.peek().line, f"expected identifier after '.', got {self.peek().type}"])
                dotname = name+"."+self.previous().lexeme

                if not self.match([TT.ASSIGN]):
                    raise SyntaxError([self.peek().line, f"expected <- after composite name, got  {self.peek().type}"])
                
                return self.assign_stmt(dotname, self.previous().line)
                    
            elif self.match([TT.LEFT_BRACK]):
                return self.array_assign_stmt(name, self.previous().line)

            else:
                raise SyntaxError([self.peek().line, f"Unexpected {self.peek().type.name} ('{self.peek().lexeme}') following IDENTIFIER ('{self.previous().lexeme}')"])

        elif self.match([TT.CALL]):
            return self.call_stmt(self.previous().line)

        elif self.match([TT.TYPE]):
            return self.type_stmt(self.previous().line)

        elif self.match([TT.CONSTANT]):
            return self.constant_stmt(self.previous().line)

        elif self.match([TT.PRINT, TT.OUTPUT]):
            return self.print_stmt(self.previous().line)

        elif self.match([TT.INPUT]):
            return self.input_stmt(self.previous().line)

        elif self.match([TT.IF]):
            return self.if_stmt(self.previous().line)

        elif self.match([TT.CASE]):
            return self.case_stmt(self.previous().line)
        
        elif self.match([TT.WHILE]):
            return self.while_stmt(self.previous().line)

        elif self.match([TT.REPEAT]):
            return self.repeat_stmt(self.previous().line)

        elif self.match([TT.FOR]):
            return self.for_stmt(self.previous().line)

        elif self.match([TT.FUNCTION]):
            return self.function_decl_stmt(self.previous().line)

        elif self.match([TT.PROCEDURE]):
            return self.procedure_decl_stmt(self.previous().line)
            
        elif self.match([TT.RETURN]):
            return self.return_stmt(self.previous().line)

        elif self.match([TT.OPENFILE, TT.CLOSEFILE, TT.READFILE, TT.WRITEFILE]):
            return self.file_handling_stmt(self.previous().line)

        elif self.match([TT.BREAK]):
            print("Got Break")
            
        else:
            self.advance()
            raise SyntaxError([self.previous().line, f"Unexpected token '{self.previous().lexeme}'"])

    def expression(self, line, checkNone=True):
        expr = self.bool_or(line)
        if checkNone and expr == None:
            raise SyntaxError([line, "missing expression"])
        return expr

    def bool_or(self, line):
        expr = self.bool_and(line)
            
        while self.match ( [TT.OR] ):
            operator = self.previous()
            right = self.expression(line)
            
            expr = BINARY(expr, operator, right, operator.line)

        return expr

    def bool_and(self, line):
        expr = self.comparision(line)
            
        while self.match ( [TT.AND] ):
            operator = self.previous()
            right = self.expression(line)
                
            expr = BINARY(expr, operator, right, operator.line)
            
        return expr
    
    def comparision(self, line):
        expr = self.term(line)

        while self.match([TT.GREATER, TT.GREATER_EQUAL, TT.LESS, TT.LESS_EQUAL, TT.LESS_GREATER, TT.BANG_EQUAL, TT.EQUAL, TT.BANG_EQUAL, TT.EQUAL_EQUAL]):
            operator = self.previous()
            right = self.term(line)
            expr = BINARY(expr, operator, right, operator.line)
            
        return expr

    def term(self, line):

        expr = self.factor(line)

        while self.match([TT.MINUS, TT.PLUS, TT.AMPERSAND ]):

            operator = self.previous()
            right = self.factor(line)

            expr = BINARY (expr, operator, right, operator.line)

        return expr

    def factor(self, line):
        expr = self.unary(line)

        while self.match([TT.SLASH, TT.STAR, TT.DIV, TT.MOD] ):
            operator = self.previous()
            right = self.unary(line)
            expr = BINARY (expr, operator, right, operator.line)

        return expr

    def unary(self, line):
        if self.match([TT.BANG, TT.MINUS, TT.NOT]):
            operator = self.previous()
            right = self.unary(line)
            return UNARY (operator, right)

        return self.primary(line)

    def primary(self, line):
        
        if self.match([TT.FALSE]): 
            return LITERAL (False, line)

        elif self.match([TT.TRUE]): 
            return LITERAL(True, line)

        elif self.match([TT.INTEGER, TT.REAL, TT.STRING, TT.QUOTE]):
            return LITERAL(self.previous().literal, line)

        elif self.match([TT.IDENTIFIER]):

            name = self.previous().lexeme
            line = self.previous().line

            # check if this is a variable or a function with arguments
            if self.match([TT.LEFT_PAREN]): # found a function

                args = self.expr_list(line)

                if not self.match([TT.RIGHT_PAREN]):
                    raise SyntaxError([line, f"function missing closing ')' "])

                return FUNCTION (name, args, line)

            elif self.match([TT.LEFT_BRACK]): # check if it's an array identifier
                index = self.expr_list(line)
                
                if self.match([TT.RIGHT_BRACK]):
                    return ARRAY(name, index, line)
                else:
                    raise SyntaxError(line, f"array {name} missing ']'")
            elif self.match([TT.DOT]): # check if it's a composite name
                if not self.match([TT.IDENTIFIER]):
                    raise SyntaxError(line, f"composite name missing field name after '.'")
                return IDENTIFIER(name+"."+self.previous().lexeme, line) 
            else:
                # check if name is a function without arguments
                return IDENTIFIER(name, line)

        elif self.match([TT.LEFT_PAREN]):
            expr = self.expression(self.previous().line)

            if self.match([TT.RIGHT_PAREN]):
                return GROUPING(expr, line)

            else:
                raise SyntaxError([self.peek().line, "Missing closing ')'"])
        return None
