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
