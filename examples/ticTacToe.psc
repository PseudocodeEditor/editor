DECLARE TTT_ROW : INTEGER
DECLARE TTT_COL : INTEGER
TTT_ROW <- 3
TTT_COL <- 3

DECLARE TTT : ARRAY [1 : TTT_ROW, 1: TTT_COL] OF CHAR
DECLARE Choice : INTEGER
DECLARE Count : INTEGER
DECLARE Player1 : BOOLEAN
DECLARE Finished : BOOLEAN

// Procedure TO set-up the game
 PROCEDURE Setup

	FOR r <- 1 TO TTT_ROW
		TTT[r, 1] <- '_'
		TTT[r, 2] <- '_'
		TTT[r, 3] <- '_'
	NEXT r

	Finished <- FALSE
	Player1 <- TRUE
	Count <- 0

	// Print out instructions
	OUTPUT "TIC-TAC-TOE"
	OUTPUT "==========="
	OUTPUT "This is a 2 player game. Each player takes a turn TO pick"
	OUTPUT "a location on a 3 x 3 board. The first player, Player1 is" 
	OUTPUT "assigned a 'X', and player 2 a 'O'."
	OUTPUT ""
	OUTPUT "Board locations are as follows:"
	FOR i <- 1 TO 9 STEP 3
		OUTPUT i, i+1, i+2
	NEXT i
	OUTPUT ""
	OUTPUT "Current board"
	CALL Print
ENDPROCEDURE

// Procedure TO Print out the board 
PROCEDURE Print
	FOR r <- 1 TO TTT_ROW
		OUTPUT TTT[r, 1], TTT[r, 2], TTT[r, 3]
	NEXT r
ENDPROCEDURE

// Function TO check IF there is a Winner
FUNCTION checkWin(Player1_turn: BOOLEAN) RETURNS BOOLEAN
	DECLARE Symbol : CHAR
	DECLARE Win : BOOLEAN

	Win <- FALSE
	
	IF Player1 THEN
		Symbol <- 'X'		
	ELSE
		Symbol <- 'O'
	ENDIF

	IF	 (TTT[1, 1] = Symbol AND TTT[1, 2] = Symbol AND TTT[1, 3] = Symbol) OR
		   (TTT[2, 1] = Symbol AND TTT[2, 2] = Symbol AND TTT[2, 3] = Symbol) OR
		   (TTT[3, 1] = Symbol AND TTT[3, 2] = Symbol AND TTT[3, 3] = Symbol) OR
		   (TTT[1, 1] = Symbol AND TTT[2, 1] = Symbol AND TTT[3, 1] = Symbol) OR
		   (TTT[1, 2] = Symbol AND TTT[2, 2] = Symbol AND TTT[3, 2] = Symbol) OR
		   (TTT[1, 3] = Symbol AND TTT[2, 3] = Symbol AND TTT[3, 3] = Symbol) OR
		   (TTT[1, 1] = Symbol AND TTT[2, 2] = Symbol AND TTT[3, 3] = Symbol) OR
		   (TTT[1, 3] = Symbol AND TTT[2, 2] = Symbol AND TTT[3, 1] = Symbol) 
	THEN
		Win <- TRUE
	ENDIF

	RETURN Win

ENDFUNCTION

// Function TO check IF a location is Empty
FUNCTION isEmpty(Location: INTEGER) RETURNS BOOLEAN

	RETURN getValue(Location) = '_'

ENDFUNCTION

// Function get a 2D value at location
FUNCTION getValue(Location: INTEGER) RETURNS CHAR
	DECLARE Value: CHAR

	CASE OF Location
		1: Value <- TTT[1, 1] BREAK
		2: Value <- TTT[1, 2] BREAK
		3: Value <- TTT[1, 3] BREAK
		4: Value <- TTT[2, 1] BREAK
		5: Value <- TTT[2, 2] BREAK
		6: Value <- TTT[2, 3] BREAK
		7: Value <- TTT[3, 1] BREAK
		8: Value <- TTT[3, 2] BREAK
		9: Value <- TTT[3, 3] BREAK
	ENDCASE

	RETURN Value
ENDFUNCTION

// Procedure to set a value
PROCEDURE setValue(Location: INTEGER, Value: CHAR)

	CASE OF Location
		1: TTT[1, 1] <- Value BREAK
		2: TTT[1, 2] <- Value BREAK
		3: TTT[1, 3] <- Value BREAK
		4: TTT[2, 1] <- Value BREAK
		5: TTT[2, 2] <- Value BREAK
		6: TTT[2, 3] <- Value BREAK
		7: TTT[3, 1] <- Value BREAK
		8: TTT[3, 2] <- Value BREAK
		9: TTT[3, 3] <- Value BREAK
	ENDCASE

ENDPROCEDURE


// Function TO get a valid location
FUNCTION getposition(prompt : STRING) RETURNS INTEGER
	OUTPUT prompt, ">"
	INPUT Choice
	WHILE Choice > 9 OR Choice < 1 OR isEmpty(Choice) = FALSE DO
		OUTPUT "Invalid Choice", Choice, "value should be 1 TO 9 and location should be Empty"
		OUTPUT prompt, ">"
		INPUT Choice
	ENDWHILE
	RETURN Choice
ENDFUNCTION

PROCEDURE play
	WHILE Count <> 9 AND Finished = FALSE DO
		IF Player1 THEN
			CALL setValue(getposition("Player1" ), 'X')
		ELSE
			CALL setValue(getposition("player2" ), 'O')
		ENDIF
	
		Count  <- Count + 1
		IF Player1 THEN
			IF checkWin(Player1) THEN
				OUTPUT "**** Player1 Wins ****"
				Finished <- TRUE
			ENDIF
			Player1 <- FALSE
		ELSE
			IF checkWin(Player1) THEN
				OUTPUT "**** Player2 Wins ****"
				Finished <- TRUE
			ENDIF
			Player1 <- TRUE
		ENDIF
		CALL Print
	ENDWHILE

ENDPROCEDURE


// Main code starts here ....
CALL Setup
CALL play