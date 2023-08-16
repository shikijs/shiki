      ******************************************************************
      * Author: Bryan Flood
      * Date: 25/10/2018
      * Purpose: Compute Fibonacci Numbers
      * Tectonics: cobc
      ******************************************************************
       IDENTIFICATION DIVISION.
       PROGRAM-ID. FIB.
       DATA DIVISION.
       FILE SECTION.
       WORKING-STORAGE SECTION.
       01  N0             BINARY-C-LONG VALUE 0.
       01  N1             BINARY-C-LONG VALUE 1.
       01  SWAP           BINARY-C-LONG VALUE 1.
       01  RESULT         PIC Z(20)9.
       01  I              BINARY-C-LONG VALUE 0.
       01  I-MAX          BINARY-C-LONG VALUE 0.
       01  LARGEST-N      BINARY-C-LONG VALUE 92.

       PROCEDURE DIVISION.
      *>  THIS IS WHERE THE LABELS GET CALLED
           PERFORM MAIN
           PERFORM ENDFIB
           GOBACK.

      *>  THIS ACCEPTS INPUT AND DETERMINES THE OUTPUT USING A EVAL STMT
       MAIN.
            DISPLAY "ENTER N TO GENERATE THE FIBONACCI SEQUENCE"
            ACCEPT I-MAX.

            EVALUATE TRUE
              WHEN I-MAX > LARGEST-N
                 PERFORM INVALIDN

              WHEN I-MAX > 2
                 PERFORM CASEGREATERTHAN2

              WHEN I-MAX = 2
                 PERFORM CASE2

              WHEN I-MAX = 1
                 PERFORM CASE1

              WHEN I-MAX = 0
                 PERFORM CASE0

              WHEN OTHER
                 PERFORM INVALIDN

            END-EVALUATE.

            STOP RUN.



       *>  THE CASE FOR WHEN N = 0
       CASE0.
           MOVE N0 TO RESULT.
           DISPLAY RESULT.

      *>  THE CASE FOR WHEN N = 1
       CASE1.
           PERFORM CASE0
           MOVE N1 TO RESULT.
           DISPLAY RESULT.

      *>  THE CASE FOR WHEN N = 2
       CASE2.
           PERFORM CASE1
           MOVE N1 TO RESULT.
           DISPLAY RESULT.

      *>  THE CASE FOR WHEN N > 2
       CASEGREATERTHAN2.
           PERFORM CASE1
           PERFORM VARYING I FROM 1 BY 1 UNTIL I = I-MAX
                   ADD N0 TO N1 GIVING SWAP
                   MOVE N1 TO N0
                   MOVE SWAP TO N1
                   MOVE SWAP TO RESULT
                   DISPLAY RESULT
            END-PERFORM.

      *>  PROVIDE ERROR FOR INVALID INPUT
       INVALIDN.
           DISPLAY 'INVALID N VALUE. THE PROGRAM WILL NOW END'.

      *>  END THE PROGRAM WITH A MESSAGE
       ENDFIB.
           DISPLAY "THE PROGRAM HAS COMPLETED AND WILL NOW END".

       END PROGRAM FIB.

*> From https://github.com/KnowledgePending/COBOL-Fibonacci-Sequence/blob/master/fib.cbl
