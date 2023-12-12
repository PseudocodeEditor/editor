import abc
import ps2.utilities as util

from ps2.scan.ps2_token import TokenType as TT
from ps2.symbol_table.environment import Environment as environ, Symbol, Function_Symbol

class Expression(abc.ABC):

    @abc.abstractmethod
    async def evaluate(self):
        pass

class UNARY(Expression):
    def __init__(self, operator, right ):
        self.operator = operator
        self.right  = right

    async def evaluate(self):

        right_value  = await self.right.evaluate()

        if self.operator.lexeme == '-':
            return -right_value

        elif self.operator.lexeme == 'NOT':
            return not right_value
        else:
            raise RuntimeError([self.line, f"Internal error - unknown unary operator {self.operator.lexeme}"])


class BINARY(Expression):
    def __init__(self, left, operator, right , line):
        self.left = left
        self.operator = operator
        self.right  = right
        self.line = line

    async def evaluate(self):

        left_value   = await self.left.evaluate()
        right_value  = await self.right.evaluate()

        op = self.operator.type

        # check to ensure both left_value and right_value  are not None
        if left_value  == None or right_value == None:
            raise RuntimeError([self.line, f"the left_value or the right_value  expression of the {self.operator.lexeme} operator is empty"])

        # check for valid number operations
        if util.isNumber( left_value ) and not util.isNumber(right_value ) or \
           not util.isNumber(left_value ) and util.isNumber(right_value ):

            raise RuntimeError([self.line, f"type mismatch on operator '{self.operator.lexeme}', both expressions need to be numbers"])

        # check for valid string operations
        if util.isString(left_value ) and util.isString(right_value ) and \
            op in [TT.PLUS, TT.MINUS, TT.STAR, TT.SLASH, TT.DIV, TT.MOD]:

            raise RuntimeError([self.line, f"invalid string operator '{self.operator.lexeme}'"])

        if  op == TT.PLUS:
            return left_value  + right_value

        elif op  == TT.AMPERSAND:
            # Check that both left_value and right_value are of type STRING
            if type( left_value ) is str and type( right_value ) is str:
                return left_value + right_value

            else:
                raise RuntimeError([self.line, f"String concatenation '&' operates on STRING only"])

        elif op  == TT.MINUS:
            return left_value - right_value

        elif op  == TT.STAR:
            return left_value * right_value

        elif op  == TT.SLASH:
            return left_value / right_value

        elif op == TT.AND:

            if type(left_value) == bool and type(right_value) == bool:
                return left_value and right_value
            else:
                raise RuntimeError([self.line, f"AND can only be applied to boolean types"])

        elif op == TT.OR:
            if type(left_value) == bool and type(right_value) == bool:
                return left_value or right_value
            else:
                raise RuntimeError([self.line, f"OR can only be applied to boolean types"])

        elif op  == TT.DIV:
            if util.isNumber(left_value) and util.isNumber(right_value ):
                return left_value // right_value
            else:
                raise RuntimeError([self.line, f"DIV operates on numbers ONLY"])

        elif op == TT.MOD:
            if util.isNumber( left_value ) and util.isNumber( right_value ):
                return left_value % right_value
            else:
                raise RuntimeError([self.line, f"MOD operates on numbers ONLY"])

        elif op  == TT.GREATER_EQUAL:
            return left_value >= right_value

        elif op  == TT.GREATER:
            return left_value > right_value

        elif op  == TT.LESS:
            return left_value < right_value

        elif op  == TT.LESS_EQUAL:
            return left_value <= right_value

        elif op  == TT.EQUAL:
            return left_value == right_value

        elif op  == TT.LESS_GREATER:
            return left_value != right_value

        elif op  == TT.BANG_EQUAL:
            return left_value != right_value

        else:
            raise RuntimeError([self.line, f"Unecognised binary operator '{self.operator.lexeme}'"])

class LITERAL(Expression):
    def __init__(self, expression, line):
        self.expression = expression
        self.line = line

    async def evaluate(self):
        if self.expression == None:
            raise RuntimeError([self.line, "missing expression in literal ()"])

        return self.expression

class GROUPING(Expression):
    def __init__(self, expression, line):
        self.expression = expression
        self.line = line

    async def evaluate(self):
        if self.expression == None:
            raise RuntimeError([self.line, "missing expression in group ()"])
        return await self.expression.evaluate()

class IDENTIFIER(Expression):
    def __init__(self, name, line):
        self.name = name
        self.line = line

    async def evaluate(self):
        v = environ.get_variable(self.name)
        ### Added code for functions without args, and ()
        if type(v) == Function_Symbol:
            return await FUNCTION(self.name, [], self.line).evaluate()
        else:
            return v.value

class ARRAY(Expression):
    def __init__(self, name, expression_list, line):
        self.name = name
        self.indices = expression_list
        self.line = line

    async def evaluate(self):

        symbol = environ.get_variable(self.name)

        index1 = await self.indices[0].evaluate()
        index2 = None
        if not symbol.is1d:
            index2 = await self.indices[1].evaluate()

        return symbol.get_value(self.line, index1, index2)

### Currently being worked on
class ARRAY_UDT(ARRAY):
    def __init__(self, name, expression_list, field, line):
        super().__init__(self, name, expression_list, line)
        self.udt_field = field

    async def evaluate(self):

        symbol = environ.get_variable(self.name)

        index1 = await self.indices[0].evaluate()
        index2 = None
        if not symbol.is1d:
            index2 = await self.indices[1].evaluate()

        return symbol.get_value(self.line, index1, index2)
### Currently being worked on

class FUNCTION(Expression):
    def __init__(self, name, args, line):
        self.name = name
        self.args = args
        self.line = line


    async def evaluate(self):

        # Check if any internal functions match
        if self.name == "INT":

            if len(self.args) != 1:
                raise RuntimeError([self.line, f"INT() requires 1 argument, it received {len(self.args)}"])

            val = self.visitNode(self.args[0])
            if not (type (val) == int or type(val) == float):
                raise RuntimeError([self.line, f"INT() requires a an INTEGER or REAL argument"])

            return int(val)

        elif self.name == "RAND":
            if len(self.args) != 2:
                raise RuntimeError([self.line, f"RAND() requires 2 arguments, it received {len(self.args)}"])

            from random import randint
            start = await self.args[0].evaluate()
            end   = await self.args[1].evaluate()

            if type(start) == int and type(end) == int:
                return randint(start, end)

            else:
                raise RuntimeError([self.line, f"RAND() requires 2 integer arguments"])

        elif self.name == "RIGHT":
            if len(self.args) != 2:
                raise RuntimeError([self.line, f"RIGHT() requires 2 arguments, it received {len(self.args)}"])
            this_string = await self.args[0].evaluate()

            # Check that this is a string
            if type(this_string) != str:
                raise RuntimeError([self.line, f"RIGHT() requires a STRING, not '{this_string}'"])

            x = await self.args[1].evaluate()
            if type(x) != int:
                raise RuntimeError([self.line, f"RIGHT() requires an INTEGER length, not '{x}'"])

            return this_string[-x:]

        elif self.name == "LENGTH":
            if len(self.args) != 1:
                raise RuntimeError([self.line, f"LENGTH() function expected 1 argument, it got {len(self.args)}"])
            this_string = await self.args[0].evaluate()

            # Check that this is a string
            if type(this_string) != str:
                raise RuntimeError([self.line, f"LENGTH() requires a STRING, not '{this_string}'"])

            return len(this_string)

        elif self.name == "MID":
            if len(self.args) != 3:
                raise RuntimeError([self.line, f"MID() requires 3 arguments, it received {len(self.args)}"])

            this_string = await self.args[0].evaluate()

            # Check that this is a string
            if type(this_string) != str:
                raise RuntimeError([self.line, f"MID() requires a STRING, not '{this_string}'"])

            start = await self.args[1].evaluate()
            x     = await self.args[2].evaluate() - 1

            if type(start) == int and type(x) == int:

                # Ensure start and x are valid
                if start > 0 and start + x <= len(this_string):
                    return this_string[start-1:start+x]
                else:
                    raise RuntimeError([self.line, f"MID() arguments are invalid. Ensure start index > 0, and start + length <= LENGTH(\"{this_string}\")"])
            else:
                raise RuntimeError([self.line, f"MID() requires 2 integer arguments"])

        elif self.name == "UCASE":
            if len(self.args) != 1:
                raise RuntimeError([self.line, f"UCASE() function requires 1 argument, it received {len(self.args)}"])

            char  = await self.args[0].evaluate()
            if not util.isChar(char):
                raise RuntimeError([self.line, f"UCASE() argument should be of type CHAR"])

            return char.upper()

        elif self.name == "LCASE":
            if len(self.args) != 1:
                raise RuntimeError([self.line, f"LCASE() function requires 1 argument, it received {len(self.args)}"])

            char  = await self.args[0].evaluate()
            if not util.isChar(char):
                raise RuntimeError([self.line, f"LCASE() argument should be of type CHAR"])

            return char.lower()


        elif self.name == "EOF":
            if len(self.args) != 1:
                raise RuntimeError([self.line, f"EOF() function requires 1 argument, it received {len(self.args)}"])

            fileid  = await self.args[0].evaluate()
            symbol = environ.get_variable(fileid)

            symbol.isEOF = symbol.eof()

            return symbol.isEOF

        elif self.name == "DEBUG":

            if len(self.args) != 1:
                raise RuntimeError([self.line, f"DEBUG() function requires 1 argument, it received {len(self.args)}"])

            command  = self.visitNode(self.args[0])
            if command.upper() == "DUMP GLOBALS":
                environ.dump_global_variables()

        # User defined function
        elif environ.symbol_defined(self.name): # Check if this is a user defined function
            symbol = environ.get_variable(self.name)

            # Create a new environment scope for this function
            environ.push({})

            # Add the parameters to the environment
            for i, s in enumerate(symbol.args):
                id_name = symbol.args[i][0]
                id_type = symbol.args[i][1]
                # environ.add_variable(Symbol(id_name, id_type , self.args[i].evaluate()))

                # Evaluate the argument and check that it is the required type
                arg = await self.args[i].evaluate()

                if  util.check_type(arg, id_type, self.line) == False:
                    raise RuntimeError([self.line, f"Function {self.name} with arg='{arg}' doesn't match type {id_type}"])

                environ.add_variable(Symbol(id_name, id_type , arg, self.line))

            try:

                # Run the body of the function, until it returns
                return_val = None
                for stmt in symbol.stmt_list:
                    await stmt.interpret()

            # Function has returned
            except util.Return as r:
                return_val = r.args[0]

            if return_val == None:
                raise RuntimeError([self.line, f"Function '{self.name}()' returned without a value"])

            environ.pop()
            return return_val

        else:
            raise RuntimeError([self.line, f"Unrecognised function '{self.name}()'"])

