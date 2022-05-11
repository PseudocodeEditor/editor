TYPE TestType
	DECLARE A : STRING
	DECLARE B : INTEGER
	DECLARE C : REAL
	DECLARE D : BOOLEAN
	DECLARE E : CHAR
ENDTYPE

DECLARE myType : TestType

myType.A <- "This"
myType.B <- 42
myType.C <- 24.5
myType.D <- TRUE
myType.E <- 'H'

OUTPUT "myType.A =", myType.A 
OUTPUT "myType.B =", myType.B 
OUTPUT "myType.C =", myType.C 
OUTPUT "myType.D =", myType.D 
OUTPUT "myType.E =", myType.E

OUTPUT "myType.B + myType.C = ", myType.B + myType.C
