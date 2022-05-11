DECLARE Top		: INTEGER
DECLARE Temp	 : INTEGER
DECLARE Sorted : BOOLEAN

Top <- 10

DECLARE Unsorted : ARRAY[1 : Top] OF INTEGER

FOR i <- 1 TO Top
	OUTPUT "Enter number: "
	INPUT Unsorted[i]
NEXT i		

REPEAT
	Sorted <- TRUE
	FOR i <- 1 TO Top
		IF Unsorted[i] > Unsorted[i] THEN
			Temp <- Unsorted[i]
			Unsorted[i] <- Unsorted[i+1]
			Unsorted[i+1] <- Temp
			Sorted <- FALSE
		ENDIF
	NEXT i
	Top <- Top - 1
UNTIL Sorted OR Top = 1


FOR i <- 1 TO Top
	OUTPUT Unsorted [K]
NEXT i
