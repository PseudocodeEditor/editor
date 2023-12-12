import enum

class TokenType(enum.Enum):
    
    # Single-character tokens.
    LEFT_PAREN="(" 
    RIGHT_PAREN=")" 
    LEFT_BRACE="{" 
    RIGHT_BRACE="}" 
    LEFT_BRACK="[" 
    RIGHT_BRACK="]" 

    COMMA= "," 
    DOT= "." 
    MINUS= "-" 
    PLUS= "+" 
    SEMICOLON=";" 
    SLASH= "/" 
    STAR= "*" 
    CAP="^" 
    COLON=":" 
    AMPERSAND="&" 
    QUOTE="'" 
    
    # Multi character operators
    MOD="MOD" 
    DIV="DIV" 

    # One or two character tokens.
    BANG = "!"  
    BANG_EQUAL = "!=" 
    LESS_GREATER = "<>" 
    EQUAL = "=" 
    EQUAL_EQUAL = "==" 
    GREATER = ">" 
    GREATER_EQUAL = ">=" 
    LESS = "<" 
    LESS_EQUAL = "<=" 
    ASSIGN = "<-" # Assignment

    IDENTIFIER="IDENTIFIER" 
    CONSTANT="CONSTANT" 

    # Data types
    INTEGER="INTEGER" 
    REAL="REAL" 
    CHAR="CHAR" 
    STRING="STRING" 
    BOOLEAN="BOOLEAN" 
    DATE="DATE" 
    ARRAY="ARRAY" 

    # Keywords.
    DECLARE="DECLARE" 
    TYPE="TYPE" 
    ENDTYPE="ENDTYPE" 

    # Logical operators
    AND = "AND" 
    OR = "OR" 
    NOT = "NOT" 
    FALSE="FALSE" 
    TRUE="TRUE" 

    # OOP
    CLASS = "CLASS" 
    ENDCLASS = "ENDCLASS" 
    PRIVATE="PRIVATE" 
    PUBLIC="PUBLIC" 
    SUPER="SUPER" 
    NEW="NEW" 
    THIS="THIS"  

    # Functions and Procedures
    FUNCTION="FUNCTION" 
    RETURN="RETURN" 
    RETURNS="RETURNS" 
    ENDFUNCTION="ENDFUNCTION" 

    PROCEDURE="PROCEDURE" 
    ENDPROCEDURE="ENDPROCEDURE" 
    CALL="CALL" 

    # Input / Output
    OUTPUT="OUTPUT" 
    PRINT="OUTPUT" 
    INPUT="INPUT" 

    # File handling
    OPENFILE="OPENFILE" 
    CLOSEFILE="CLOSEFILE" 
    READFILE="READFILE" 
    WRITEFILE="WRITEFILE" 
    READ="READ" 
    WRITE="WRITE" 
    APPEND="APPEND" 
    SEEK="SEEK" 
    GETRECORD="GETRECORD" 
    PUTRECORD="PUTRECORD" 

    # Iteration
    WHILE="WHILE" 
    DO="DO" 
    ENDWHILE="ENDWHILE" 

    REPEAT="REPEAT" 
    UNTIL="UNTIL" 

    FOR="FOR" 
    TO="TO" 
    NEXT="NEXT" 
    STEP="STEP" 

    # Selection
    IF="IF" 
    THEN="THEN" 
    ELSE="ELSE" 
    ENDIF="ENDIF" 

    CASE="CASE" 
    OF="OF" 
    BREAK="BREAK"
    OTHERWISE="OTHERWISE" 
    ENDCASE="ENDCASE" 

    # Built in functions

    AT_EOF = "AT_EOF" 
  
keywords = {

    "IDENTIFIER": TokenType.IDENTIFIER,
    "CONSTANT": TokenType.CONSTANT,
    "INTEGER": TokenType.INTEGER,
    "REAL": TokenType.REAL,
    "CHAR": TokenType.CHAR,
    "STRING": TokenType.STRING,
    "BOOLEAN": TokenType.BOOLEAN,
    "DATE": TokenType.DATE,
    "ARRAY": TokenType.ARRAY,
    "DECLARE": TokenType.DECLARE,
    "TYPE": TokenType.TYPE,
    "ENDTYPE": TokenType.ENDTYPE,
    "AND": TokenType.AND,
    "OR": TokenType.OR,
    "NOT": TokenType.NOT,
    "FALSE": TokenType.FALSE,
    "TRUE": TokenType.TRUE,
    "CLASS": TokenType.CLASS,
    "ENDCLASS": TokenType.ENDCLASS,
    "PRIVATE": TokenType.PRIVATE,
    "PUBLIC": TokenType.PUBLIC,
    "SUPER": TokenType.SUPER,
    "NEW": TokenType.NEW,
    "THIS": TokenType.THIS,
    "FUNCTION": TokenType.FUNCTION,
    "RETURN": TokenType.RETURN,
    "RETURNS": TokenType.RETURNS,
    "ENDFUNCTION": TokenType.ENDFUNCTION,
    "PROCEDURE": TokenType.PROCEDURE,
    "ENDPROCEDURE": TokenType.ENDPROCEDURE,
    "CALL": TokenType.CALL,
    "PRINT": TokenType.PRINT,
    "OUTPUT": TokenType.OUTPUT,
    "INPUT": TokenType.INPUT,
    "OPENFILE": TokenType.OPENFILE,
    "CLOSEFILE": TokenType.CLOSEFILE,
    "READFILE": TokenType.READFILE,
    "WRITEFILE": TokenType.WRITEFILE,
    "READ": TokenType.READ,
    "WRITE": TokenType.WRITE,
    "APPEND": TokenType.APPEND,
    "SEEK": TokenType.SEEK,
    "GETRECORD": TokenType.GETRECORD,
    "PUTRECORD": TokenType.PUTRECORD,
    "WHILE": TokenType.WHILE,
    "DO": TokenType.DO,
    "ENDWHILE": TokenType.ENDWHILE,
    "REPEAT": TokenType.REPEAT,
    "UNTIL": TokenType.UNTIL,
    "FOR": TokenType.FOR,
    "TO": TokenType.TO,
    "NEXT": TokenType.NEXT,
    "STEP": TokenType.STEP,
    "IF": TokenType.IF,
    "THEN": TokenType.THEN,
    "ELSE": TokenType.ELSE,
    "ENDIF": TokenType.ENDIF,
    "CASE": TokenType.CASE,
    "OF": TokenType.OF,
    "BREAK": TokenType.BREAK,
    "OTHERWISE": TokenType.OTHERWISE,
    "ENDCASE": TokenType.ENDCASE,

    "MOD": TokenType.MOD,
    "DIV": TokenType.DIV,

    "AT_EOF": TokenType.AT_EOF,

}
    
class Token:

    def __init__(self, type, lexeme, literal, line):
        self.type = type
        self.lexeme = lexeme
        self.literal = literal
        self.line = line

    def __repr__(self):
        return self.str()

    def __str__(self):
        return f"type={self.type} | lexeme={self.lexeme} | literal={self.literal} | line#={self.line}"
