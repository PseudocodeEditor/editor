import js

import abc
import ps2.utilities as util

from ps2.symbol_table.environment import Environment as environ
from ps2.symbol_table.environment import Symbol, Array_Symbol, Function_Symbol, Procedure_Symbol, File_Symbol, Type_Symbol
from ps2.scan.ps2_token import TokenType as TT, Token

class Statement ( abc.ABC ):

    valid_statements = [
        TT.CONSTANT,
        TT.DECLARE,
        TT.TYPE,
        TT.CLASS,
        TT.PRIVATE,
        TT.PUBLIC,
        TT.FUNCTION,
        TT.RETURN,
        TT.PROCEDURE,
        TT.CALL,
        TT.PRINT,
        TT.OUTPUT,
        TT.INPUT,
        TT.OPENFILE,
        TT.CLOSEFILE,
        TT.READFILE,
        TT.WRITEFILE,
        TT.WHILE,
        TT.REPEAT,
        TT.FOR,
        TT.IF,
        TT.CASE
    ]

    @abc.abstractmethod # each statement implements this methid, which us called by the Interpretor
    async def interpret(self):
        pass

class DECLARE ( Statement ):

    def __init__(self, vname, vtype, line, is_constant, value=None):
        assert vname != None and vtype != None and line != None, \
            "DECLARE statement: None initialiser(s) found"

        self.vname = vname
        self.utype = None

        if ":" in vname:
            self.vname = vname[:vname.index(":")]
            self.utype = vname[vname.index(":")+1:]

        self.vtype = vtype
        self.line = line
        self.is_constant = is_constant
        self.value = value

    def __str__(self):
        return f"DECLARE: name={self.vname}, type={self.vtype}, line={self.line}, constant={self.is_constant}, value={self.value}"

    async def interpret(self):

        if self.vtype == TT.IDENTIFIER: # composite type delcared
            userType = environ.get_variable(self.utype)
            if userType == None:
                raise SyntaxError([self.line, f"User defined type '{self.vtype.lexeme}' undefined"])

            # Now iterate through list of declares and setup variable in symbol table
            for i, s in enumerate(userType.value):
                name = self.vname+"."+s.vname
                stype = s.vtype
                symbol = Symbol(name, stype, i, self.line)
                environ.add_variable(symbol)

        else:
            symbol = Symbol(self.vname, self.vtype, self.value, self.line)

            if self.is_constant:
                symbol.is_constant = True

            environ.add_variable(symbol)


class DECLARE_ARRAY ( Statement ):

    def __init__(self, vname, dimensions, vtype, line):
        assert vname != None and dimensions != None and vtype != None and line != None,\
            "ARRAY DECLARATION statement: None initialiser(s) found"

        self.vname = vname
        self.vtype = vtype
        self.utype = None

        if ":" in vname:
            self.vname = vname[:vname.index(":")]
            self.utype = vname[vname.index(":")+1:]

        self.dimensions = dimensions

        if len(dimensions) < 1 or len(dimensions) > 2:
            raise SyntaxError([line, "DECLARE ARRAY can only have 1 or 2 dimensions"])

        self.line = line

    async def interpret(self):

        value = []
        if len(self.dimensions) == 1:

            start = await self.dimensions[0][0].evaluate()
            end =   await self.dimensions[0][1].evaluate()

            if start > end or start < 0:
                raise RuntimeError([self.line, f"ARRAY declaration start index > end index or start index < 0"])

            # Re-write the original parsed values with actual runtime values
            self.dimensions = [(start, end)]

            if self.utype == None:
                value = [ None for _ in range( end - start + 1) ]
            else:
                raise RuntimeError([self.line, "Array of UDT not implemented yet"])

        elif len(self.dimensions) == 2:

            start1 = await self.dimensions[0][0].evaluate()
            end1 =   await self.dimensions[0][1].evaluate()

            if start1 > end1 or start1 < 0:
                raise RuntimeError([self.line, f"ARRAY declaration start index > end index or start index < 0"])

            value = [ None for _ in range( end1- start1 + 1) ]

            start2 = await self.dimensions[1][0].evaluate()
            end2 =   await self.dimensions[1][1].evaluate()

            if start2 > end2 or start2 < 0:
                raise RuntimeError([self.line, f"ARRAY declaration start index > end index or start index < 0"])

            # Re-write the original parsed values with actual runtime values
            self.dimensions = [(start1, end1),(start2, end2)]

            for i in range(len(value)):
                value[i] = [ None for _ in range( end2 - start2 + 1) ]

        else:
            raise SyntaxError([self.line, f"unsupported dimensions {len(self.dimensions)} - only 1D and 2D supported"])

        symbol = Array_Symbol(self.vname, self.dimensions, self.vtype, value, self.line)

        environ.add_variable(symbol)


class ARRAY_ASSIGN ( Statement ):

    def __init__(self, vname, indices, expr, line):
        assert vname != None and indices != None and expr != None and line != None, \
            "ARRAY ASSIGN statement: None initialiser(s) found"

        self.vname = vname
        self.indices = indices
        self.expr = expr
        self.line = line

    async def interpret(self):

        symbol = environ.get_variable(self.vname)
        if not isinstance(symbol, Array_Symbol):
            raise RuntimeError([self.line, f"symbol {self.vname} is not an array"])

        expr  = await self.expr.evaluate()
        assert expr != None, "ARRAY_ASSIGN expr == None"

        index1 = await self.indices[0].evaluate()
        index2 = None

        if not symbol.is1d: # its a 2D array

            if len(self.indices) != 2: # check to see the correct number of indices have been provided
                raise RuntimeError([self.line, f"{self.vname} is a 2D array, but only 1 idex provided"])

            index2 = await self.indices[1].evaluate()

        symbol.set_value(self.line, expr, index1, index2)

class ASSIGN ( Statement ):

    def __init__(self, vname, expr, line):
        assert vname != None and expr != None and line != None, \
            "ASSIGN statement: None initialiser(s) found"

        self.vname = vname
        self.expr = expr
        self.line = line

    async def interpret(self):
        value  = await self.expr.evaluate()

        symbol = environ.get_variable(self.vname)
        if symbol.is_constant:
            raise RuntimeError([self.line, f"cannot change a value of a constant '{ self.vname }'"])

        #symbol.value = value
        #print(f"setting symbol {symbol} to {value} on line {self.line}")
        symbol.set_value(value, self.line)

class DECLARE_TYPE(Statement):

    from enum import Enum

    class TYPE(Enum):
        COMPOSITE = 1
        POINTER = 2
        ENUM = 3

    def __init__(self, name, t_type, value, line):
        self.name = name
        self.t_type = t_type
        self.value = value
        self.line = line


    async def interpret(self):

        error = True
        if self.t_type == DECLARE_TYPE.TYPE.COMPOSITE:

            # Add Composite Type to Environment
            userType = Type_Symbol(self.name, DECLARE_TYPE.TYPE.COMPOSITE, self.value, self.line)
            environ.add_variable(userType)
            error = False

        elif self.t_type == DECLARE_TYPE.TYPE.POINTER:
            msg = f"Pointer Type: TYPE {self.name} = ^ <TYPE> not implemented"

        elif self.t_type == DECLARE_TYPE.TYPE.ENUM:
            msg = f"Enum Type: TYPE {self.name} = (VALUE1, VLAUE2, ...)not implemented"

        else:
            msg = f"Unknown type found: {self.t_type}"

        if error:
            raise SyntaxError([self.line, msg])

    def __str__(self):
        return f"Type name={self.name} Type of {self.t_type} found on line {self.line}"

class PRINT ( Statement ):

    def __init__(self, exprlist, line):
        assert exprlist != None and line != None, "PRINT_Statement: None initialiser(s) found"

        self.exprlist = exprlist
        self.line = line

    async def interpret(self):

        for expr in self.exprlist:

            value = await expr.evaluate()

            if value == None:
                raise RuntimeError([self.line, "No expression to print"])

            if type(value) is bool: # Ensure Python True and False are in uppercase
                value = str(value).upper()

            await print (value, end=" ")

        await print()

class INPUT ( Statement ):

    def __init__(self, name, line):
        assert name != None and line != None, \
            "INPUT statement: None initialiser(s) found"

        self.name = name
        self.line = line

    async def interpret(self):

        symbol = environ.get_variable(self.name)

        vtype = symbol.vtype
        value = await input()

        try:
            if vtype == TT.INTEGER:
                symbol.value = int(value)

            elif vtype == TT.REAL:
                symbol.value = float(value)

            elif vtype == TT.BOOLEAN:
                symbol.value = bool(value.capitalize())

            elif vtype == TT.STRING or TT.CHAR:
                symbol.value = value
            else:
                raise RuntimeError([self.line, f"INPUT does not recognise the data type of {self.name}"])
        except Exception as e:
             raise RuntimeError([self.line, f"INPUT unable to convert type for {self.name}: {e}"])

class WHILE ( Statement ):

    def __init__(self, condition, statement_list, line):
        assert condition != None and statement_list != None and line != None, "WHILE_Statement: None initialiser(s) found"

        self.condition = condition
        self.statement_list = statement_list
        self.line = line


    async def interpret(self):

        environ.push({}) # push new scope to stack

        while await self.condition.evaluate() == True:

            for stmt in self.statement_list:
                await stmt.interpret()

        environ.pop() # pop scope


class REPEAT ( Statement ):
    def __init__(self, condition, statement_list, line):
        assert condition != None and statement_list != None and line != None, "REPEAT_Statement: None initialiser(s) found"

        self.condition = condition
        self.statement_list = statement_list
        self.line = line

    async def interpret(self):

        environ.push({}) # push new scope to stack

        while True:
            for stmt in self.statement_list:
                await stmt.interpret()

            if await self.condition.evaluate() == True:
                break

        environ.pop() # pop scope


class FOR ( Statement ):
    def __init__(self, assign, expr, step, statement_list, line):

        self.assign = assign
        self.expr = expr
        self.step = step
        self.statement_list = statement_list
        self.line = line

    async def interpret(self):

        ####
        # Declare a loop variable, normally all variable are explicitly declared, except for loop variables.

        environ.push({}) # push new scope to stack

        symbol = Symbol(self.assign.vname, Token(TT.INTEGER, "", self.assign.vname, self.line), None, self.line)

        environ.add_variable( symbol )

        ####
        # The assign node holds the starting value and the statement expr holds the end value
        # The end value is inclusive in pseudocode, hence we need to add 1
        # Create a range iterator for the FOR loop depending is a step is defined


        r = range(await self.assign.expr.evaluate(), await self.expr.evaluate() + 1)

        if self.step != None:
            r = range(await self.assign.expr.evaluate(), await self.expr.evaluate() + 1, await self.step.evaluate())

        symbol = environ.get_variable(self.assign.vname)

        for i in r:

            # On each iteration we set the loop variable
            symbol.value = i

            # Now execute the for loop statement block
            for stmt in self.statement_list:
                await stmt.interpret()

        environ.pop() # pop scope



class IF ( Statement ):
    def __init__(self, condition, statement_list, line):
        assert condition != None and statement_list != None and line != None, "IF_Statement: None initialiser(s) found"

        self.condition = condition
        self.statement_list = statement_list
        self.line = line

    async def interpret(self):

        if await self.condition.evaluate() == True:
            environ.push({}) # push new scope to stack

            for stmt in self.statement_list:
                await stmt.interpret()

            environ.pop() # pop scope



class IF_ELSE ( Statement ):

    def __init__(self, condition, statement_list, else_statement_list, line):
        assert condition != None and statement_list != None and else_statement_list != None and line != None, "IF_ELSE_Statement: None initialiser(s) found"

        self.condition = condition
        self.statement_list = statement_list
        self.else_statement_list = else_statement_list
        self.line = line

    async def interpret(self):

        if await self.condition.evaluate() == True:

            environ.push({}) # push new scope to stack

            for stmt in self.statement_list:
                await stmt.interpret()

            environ.pop() # pop scope

        else:

            environ.push({}) # push new scope to stack

            for stmt in self.else_statement_list:
                await stmt.interpret()

            environ.pop() # pop scope

class CASE ( Statement ):

    def __init__(self, expr, cases, line):
        self.expr = expr
        self.line = line
        self.cases = cases

    async def interpret(self):
        value = await self.expr.evaluate()
        for case in self.cases:
            if case[0] != None:
                if value == await case[0].evaluate():
                    environ.push({}) # push new scope to stack
                    statement_list = case[1]

                    for stmt in statement_list:
                        await stmt.interpret()

                    environ.pop() # pop scope
                    break
            else:
                environ.push({}) # push new scope to stack
                statement_list = case[1]

                for stmt in statement_list:
                    await stmt.interpret()

                environ.pop() # pop scope
                break # Not needed, but just in case!


class DECLARE_FUNCTION ( Statement ):

    def __init__(self, name, args, statement_list, rtype, line):
        assert name != None and statement_list != None and rtype != None and line != None, \
            "FUNCTION_DECLARATION statement: None initialiser(s) found"

        # self.args can be None - this represents a procedure that takes no arguments

        self.name = name
        self.args = args
        self.stmt_list = statement_list
        self.rtype = rtype
        self.line = line

    async def interpret(self):

        symbol = Function_Symbol(self.name, self.args, self.rtype, self.stmt_list, self.line)
        environ.add_variable(symbol)


class DECLARE_PROCEDURE( Statement ):
    def __init__(self, name, args, stmt_list, line):
        assert name != None and stmt_list != None and line != None, "PROC_DECL_Statement: None initialiser(s) found"

        # self.args can be None - this represents a procedure that takes no arguments

        self.name = name
        self.args = args
        self.stmt_list = stmt_list
        self.line = line

    async def interpret(self):

        symbol = Procedure_Symbol(self.name, self.args, self.stmt_list, self.line)
        environ.add_variable(symbol)

class CALL ( Statement ):

    def __init__(self, name, args, line):
        assert name != None and args != None and line != None, "CALL statement: None initialiser(s) found"

        self.name = name
        self.args = args
        self.line = line

    async def interpret(self):

        if self.name == "DEBUG":

            if len(self.args) != 0:
                arg = await self.args[0].evaluate()

            if arg == "globals":
                environ.dump_variables()

            else:
                raise RuntimeError([self.line, f"Unrecognised DEBUG parameter {arg}"])

        else:
            # Check if its a user defined call
            if environ.symbol_defined(self.name): # Check if this is a user defined procedure:

                symbol = environ.get_variable(self.name)

                # Create a new environment scope for this function
                environ.push({})

                # Add the parameters to the environment
                for i, s in enumerate(symbol.args):
                    id_name = symbol.args[i][0]
                    id_type = symbol.args[i][1]

                    # Evaluate the argument and check that it is the required type
                    arg = await self.args[i].evaluate()

                    if  util.check_type(arg, id_type, self.line) == False:
                        raise RuntimeError([self.line, f"Procedure {self.name} with arg='{arg}' doesn't match type {id_type}"])

                    environ.add_variable(Symbol(id_name, id_type , arg, self.line))

                try:

                    # Run the body of the procedure, until it returns or completes

                    for stmt in symbol.stmt_list:
                        await stmt.interpret()

                    # Procedure has returned

                except util.Return:
                        pass

            else:
                raise RuntimeError([self.line, f"Unrecognised procedure call '{self.name}'"])


class RETURN ( Statement ):

    def __init__(self, expr):

        #assert expr != None, "RETURN_Statement expression is empty"

        self.expr = expr

    async def interpret(self):

        # Use Python's exception mechanism to return from calling procedure / function
        expr = None
        if self.expr != None:
            expr = await self.expr.evaluate()

        raise util.Return(expr)


class OPENFILE( Statement ):
    def __init__(self, handle, mode, line):
        self.handle = handle
        self.mode = mode
        self.line = line

    async def interpret(self):

        name = await self.handle.evaluate()

        mode = None
        if self.mode == TT.READ:
            mode = "r"

        elif self.mode == TT.WRITE:
            mode = "w"

        elif self.mode == TT.APPEND:
            mode = "a"

        else:
            raise RuntimeError([self.line, f"OPENFILE - unrecognised mode '{self.mode}'"])

        if mode == "r" and name not in js.files.to_py():
            raise RuntimeError(
                [self.line, f"unexpected error while executing OPENFILE. No such file or directory: '{name}'"])

        environ.add_variable(File_Symbol(name, mode, self.line))


    def __str__(self):
        return f"OPENFILE statement: {self.handle} {self.mode} on line {self.line}"

class CLOSEFILE ( Statement ):
    def __init__(self, handle, line):
        self.handle = handle
        self.line = line

    def __str__(self):
        return f"CLOSEFILE statement: {self.handle} on line {self.line}"

    async def interpret(self):

        name = await self.handle.evaluate()

        handle = environ.get_variable(name)

        environ.remove_variable(handle.vname)

class READFILE ( Statement ):
    def __init__(self, handle, variable, line):
        self.handle = handle
        self.variable = variable
        self.line = line

    def __str__(self):
        return f"READFILE statement: {self.handle} {self.variable} on line {self.line}"


    async def interpret(self):

        name = await self.handle.evaluate()

        symbol = environ.get_variable(name)

        variable = environ.get_variable(self.variable)

        try:
            line = symbol.readline()
            variable.value = line.strip()
        except Exception as e:
            raise RuntimeError([self.line, f"unexpected error while executing READFILE {e}"])


class WRITEFILE ( Statement ):

    def __init__(self, handle, value, line):
        self.handle = handle
        self.value = value
        self.line = line

    def __str__(self):
        return f"WRITEFILE statement: {self.handle} {self.variable} on line {self.line}"


    async def interpret(self):

        name = await self.handle.evaluate()

        symbol = environ.get_variable(name)

        value = await self.value.evaluate()

        try:
            symbol.writeline(value + "\n")
        except Exception as e:
            raise RuntimeError([self.line, f"unexpected error while executing WRITEFILE {e}"])
