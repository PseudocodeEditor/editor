import js
from pyodide.ffi import to_js

import ps2.utilities as utilities

class Environment:

    global_variables = {}
    scopes = [] # stack of Environments

    def __init__(self):
        self.variables = {}

    def push(env):
        Environment.scopes.insert(0, env)

    def pop():
        return Environment.scopes.pop(0)

    def add_variable(symbol):

        ## DEBUG ##
        #print(symbol)

        # Get current scope
        scope = Environment.global_variables
        if len(Environment.scopes) != 0:
            scope = Environment.scopes[0]

        if symbol.vname not in scope:
            scope[symbol.vname] = symbol
        else:
            pass # symbol was previously defined ... skip

    def get_variable(vname):

        symbol = None

        if len(Environment.scopes) != 0:
            for i in range(len(Environment.scopes)):
                scope = Environment.scopes[i]

                if vname in scope:
                    symbol = scope[vname]
                    break

            if symbol == None and vname in Environment.global_variables: # check to see if it's a global
                symbol = Environment.global_variables[vname]

        else:
            if vname in Environment.global_variables:
                symbol = Environment.global_variables[vname]

        if symbol == None:
            raise NameError(f"Symbol '{vname}' not found")

        return symbol # Will return None if not defined

    def remove_variable(vname):

        found = False

        if len(Environment.scopes) != 0:
            for i in range(len(Environment.scopes)):
                scope = Environment.scopes[i]

                if vname in scope:
                    del scope[vname]
                    found = True
                    break

            if not found and vname in Environment.global_variables: # check to see if it's a global
                del Environment.global_variables[vname]

        else:
            if vname in Environment.global_variables:
                del Environment.global_variables[vname]
                found = True

        if not found:
            raise NameError(f"Symbol '{vname}' not found")

    def symbol_defined(vname):

        scope = Environment.global_variables
        for e in Environment.scopes:
            if vname in e:
                scope = e
                break

        return vname in scope

    def reset():

        Environment.global_variables = {}
        Environment.scopes = []

    def dump_variables():

       # Get current scope
        scope = Environment.global_variables
        if len(Environment.scopes) != 0:
            scope = Environment.scopes[0].variables

        keys=scope.keys()
        print("Variables:")
        if keys != None:
            for k in keys:
                print(f"{scope[k]}")

class Symbol:
    def __init__(self, vname, vtype, value, line):
        self.vname  = vname
        self.vtype = vtype
        self.value = value
        self.line = line
        self.is_constant = False

    def type_match(self, val, line):

        match = utilities.check_type(val, self.vtype, line)

        if not match:
            raise RuntimeError([line, f"Invalid assignment, cannot assign a {utilities.isType(val)} to a {self.vtype.type}"])

        return True


    def set_value(self, val, line):

        if  self.type_match(val, line):
                self.value = val


    def __str__(self):
        return f"Symbol name={self.vname} | type={self.vtype} | value={self.value} is_constant={self.is_constant}"

class Array_Symbol(Symbol):
    def __init__(self, vname, dimensions, vtype, value, line):

        Symbol.__init__(self, vname, vtype, value, line)

        self.dimensions = dimensions
        self.is1d = len(dimensions) == 1


    def __str__(self):
        return f"Array symbol name={self.vname} | type={self.vtype} | dimensions={self.dimensions} | value={self.value}"

    def in_range(self, index, dim):
        value = index >= dim[0] and index <= dim[1]
        return value

    def set_value(self, line, value, index1, index2=None):
        if self.is1d:
            if index2 != None:
                raise RuntimeError([line , f"{self.vname} is a 1-D array, but two indexes were given {index1}, {index2}"])
            else:
                if not self.in_range(index1, self.dimensions[0]):
                    raise RuntimeError([line , f"{self.vname} index {index1} out of range"])

                if self.type_match(value, line):
                    self.value[index1-self.dimensions[0][0]] = value

        else: # 2-D array
            if index2 == None:
                raise RuntimeError([line , f"Array {self.vname} is a 2-D array, but only 1 index was given {index1}"])

            else:
                if not self.in_range(index1, self.dimensions[0]):
                    raise RuntimeError([line , f"Array {self.vname}[{index1}] {index1} out of range"])

                elif not self.in_range(index2, self.dimensions[1]):
                    raise RuntimeError([line , f"Array {self.vname}[{index1}][{index2}] index {index2} out of range"])

                i1 = index1-self.dimensions[0][0]
                i2 = index2-self.dimensions[1][0]

                if self.type_match(value, line):
                    self.value[i1][i2] = value


    def get_value(self, line, index1, index2=None):
        if self.is1d:
            if index2 != None:
                raise RuntimeError([line , f"Array {self.vname} is a 1-D array, but two indexes were given {index1}, {index2}"])
            else:
                if not self.in_range(index1, self.dimensions[0]):
                    raise RuntimeError([line , f"Array {self.vname}[{index1}] {index1} out of range"])

                value = self.value[index1-self.dimensions[0][0]]
                if value == None:
                    raise RuntimeError([line, f"Array {self.name}[{index1}] declared, but not value assigned"])

                return  value

        else: # 2-D array
            if index2 == None:
                raise RuntimeError([line , f"Array {self.vname} is a 2-D array, but only 1 index was given {index1}"])

            else:
                if not self.in_range(index1, self.dimensions[0]):
                    raise RuntimeError([line , f"Array {self.vname}[{index1}] {index1} out of range"])

                elif not self.in_range(index2, self.dimensions[1]):
                    raise RuntimeError([line , f"Array {self.vname}[{index1}][{index2}] {index2} out of range"])

                value = self.value[index1-self.dimensions[0][0]][index2-self.dimensions[1][0]]

                if value == None:
                    raise RuntimeError([line, f"Array {self.vname}[{index1}][{index2}] declared, but no value assigned"])

                return  value

class File_Symbol(Symbol):
    def __init__(self, name, mode, line):
        Symbol.__init__(self, name, None, None, line)
        self.mode = mode
        self.isEOF = False

        if mode == "r":
            self.content = js.files.to_py()[name].split("\n")
            self.content_line = -1
        else:
            files = js.files.to_py()
            if mode == "w" or name not in files:
                files[name] = ""
            js.files = js.Object.fromEntries(to_js(files))

    def readline(self):
        if self.mode != "r":
            raise Exception("can't read a file not opened in READ mode")

        self.content_line += 1
        return self.content[self.content_line]

    def writeline(self, line):
        if self.mode == "r":
            raise Exception("can't write to a file while in READ mode")

        files = js.files.to_py()
        files[self.vname] += line
        js.files = js.Object.fromEntries(to_js(files))

    def eof(self):
        return self.content_line == len(self.content) - 1

class Function_Symbol(Symbol):
    def __init__(self, name, args, rtype, stmt_list, line):
        Symbol.__init__(self, name, rtype, None, line)
        self.args = args
        self.rtype = rtype
        self.stmt_list = stmt_list

    def __str__(self):
        return f"FUNCTION symbol name={self.vname} | returns={self.vtype} | args={self.args} | statement_list={self.stmt_list}"

class Procedure_Symbol(Symbol):
    def __init__(self, name, args, stmt_list, line):
        Symbol.__init__(self, name, None, None, line)
        self.args = args
        self.stmt_list = stmt_list
        self.line = line

    def __str__(self):
        return f"PROCEDURE symbol name={self.vname} | args={self.args} | statement_list={self.stmt_list}"


class Type_Symbol(Symbol):
    def __init__(self, name, type, value, line):
        Symbol.__init__(self, name, type, value, line)

    def __str__(self):
        return f"TYPE symbol name={self.vname} | type={self.vtype} | value={self.value} | line={self.line}"

class Composite_Type_Symbol(Type_Symbol):
    def __init__(self, name, type, value, line):
        Symbol.__init__(self, name, type, value, line)

    def __str__(self):
        return f"TYPE symbol name={self.vname} | type={self.vtype} | value={self.value} | line={self.line}"

class Enum_Type_Symbol(Type_Symbol):
    def __init__(self, name, type, value, line):
        Symbol.__init__(self, name, type, value, line)

    def __str__(self):
        return f"TYPE symbol name={self.vname} | type={self.vtype} | value={self.value} | line={self.line}"

class Pointer_Type_Symbol(Type_Symbol):
    def __init__(self, name, type, value, line):
        Symbol.__init__(self, name, type, value, line)

    def __str__(self):
        return f"TYPE symbol name={self.vname} | type={self.vtype} | value={self.value} | line={self.line}"
