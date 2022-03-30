// File search function

FUNCTION SearchFile(File : STRING, Search : STRING) RETURNS STRING
	DECLARE Found : BOOLEAN
	DECLARE CurrentLine : STRING
	DECLARE CurrentWord : STRING
	DECLARE Index : INTEGER
	DECLARE ThisChar : CHAR
	Found <- FALSE
	OPENFILE File FOR READ
	WHILE NOT EOF(File) AND NOT Found DO
		READFILE File, CurrentLine
		CurrentWord <- ""
		Index <- 1
		REPEAT
			ThisChar <- MID(CurrentLine, Index, 1)
			IF ThisChar <> " " THEN
				CurrentWord <- CurrentWord & ThisChar
			ENDIF
			IF ThisChar = " " OR Index = LENGTH(CurrentLine) THEN
				IF CurrentWord = Search THEN
					Found <- TRUE
					OUTPUT CurrentLine
				ELSE
					CurrentWord <- ""
				ENDIF
			ENDIF
			Index <- Index + 1
		UNTIL Found OR Index > LENGTH(CurrentLine)
	ENDWHILE
	CLOSEFILE File
	RETURN Found
ENDFUNCTION

OUTPUT SearchFile("file", "hello")



// Bubble sort

DECLARE Unsorted : ARRAY[1 : 10] OF INTEGER

DECLARE Swap : BOOLEAN
DECLARE I : INTEGER

Swap <- TRUE
I <- 2

WHILE Swap = TRUE AND I < 10 DO

    Swap <- FALSE
    FOR J <- 1 TO I
        IF Unsorted[J] > Unsorted[J + 1] THEN
            DECLARE Temp : INTEGER
            Temp <- Unsorted[J]
            Unsorted[J] <- Unsorted[J + 1]
            Unsorted[J + 1] <- Temp
            Swap <- TRUE
        ENDIF
    NEXT J

    I <- I + 1

ENDWHILE

FOR K <- 1 TO 10
    OUTPUT Unsorted [K]
NEXT K



// File handling example

DECLARE LineOfText : STRING
OPENFILE "FileA.txt" FOR READ
OPENFILE "FileB.txt" FOR WRITE
WHILE NOT EOF("FileA.txt") DO
    READFILE "FileA.txt", LineOfText
    IF LineOfText = "" THEN
        WRITEFILE "FileB.txt", "---"
    ELSE
        WRITEFILE "FileB.txt", LineOfText
    ENDIF
ENDWHILE
CLOSEFILE "FileA.txt"
CLOSEFILE "FileB.txt"
