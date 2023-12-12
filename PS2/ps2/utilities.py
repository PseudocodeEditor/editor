from ps2.scan.ps2_token import TokenType as TT

def isNumber(expr):
    return type (expr) in [int, float]

def isInteger(expr):
    return type (expr) in [int]

def isReal(expr):
    return type (expr) in [float]

def isString(expr):
    return type (expr) in [str]

def isChar(expr):
    return type (expr) in [str] and len(expr) == 1

def isBoolean(expr):
    return type (expr) in [bool]

def isType(expr):

    t = "Unknown"
    if isInteger(expr):
        t = "INTEGER"
    elif isReal(expr):
        t = "REAL"
    elif isString(expr):
        t = "STRING"
    elif isChar(expr):
        t = "CHAR"
    elif isBoolean(expr):
        t = "BOOLEAN"

    return t

def check_type(val, vtype, line):
    
    match =  isString(val) and vtype == TT.STRING   or   \
             isReal(val) and vtype == TT.REAL or   \
             isChar(val) and vtype == TT.CHAR or   \
             isInteger(val) and vtype == TT.INTEGER or   \
             isBoolean(val) and vtype == TT.BOOLEAN
    
    return match


class Return(Exception):
    pass