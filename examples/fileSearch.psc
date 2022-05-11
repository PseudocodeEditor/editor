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
