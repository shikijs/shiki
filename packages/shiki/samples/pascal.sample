{*****************************************************************************
 * A Pascal quicksort.
 *****************************************************************************}
PROGRAM Sort(input, output);
    CONST
        { Max array size. }
        MaxElts = 50;
    TYPE
        { Type of the element array. }
        IntArrType = ARRAY [1..MaxElts] OF Integer;

    VAR
        { Indexes, exchange temp, array size. }
        i, j, tmp, size: integer;

        { Array of ints }
        arr: IntArrType;

    { Read in the integers. }
    PROCEDURE ReadArr(VAR size: Integer; VAR a: IntArrType);
        BEGIN
            size := 1;
            WHILE NOT eof DO BEGIN
                readln(a[size]);
                IF NOT eof THEN
                    size := size + 1
            END
        END;

    { Use quicksort to sort the array of integers. }
    PROCEDURE Quicksort(size: Integer; VAR arr: IntArrType);
        { This does the actual work of the quicksort.  It takes the
          parameters which define the range of the array to work on,
          and references the array as a global. }
        PROCEDURE QuicksortRecur(start, stop: integer);
            VAR
                m: integer;

                { The location separating the high and low parts. }
                splitpt: integer;

            { The quicksort split algorithm.  Takes the range, and
              returns the split point. }
            FUNCTION Split(start, stop: integer): integer;
                VAR
                    left, right: integer;       { Scan pointers. }
                    pivot: integer;             { Pivot value. }

                { Interchange the parameters. }
                PROCEDURE swap(VAR a, b: integer);
                    VAR
                        t: integer;
                    BEGIN
                        t := a;
                        a := b;
                        b := t
                    END;

                BEGIN { Split }
                    { Set up the pointers for the hight and low sections, and
                      get the pivot value. }
                    pivot := arr[start];
                    left := start + 1;
                    right := stop;

                    { Look for pairs out of place and swap 'em. }
                    WHILE left <= right DO BEGIN
                        WHILE (left <= stop) AND (arr[left] < pivot) DO
                            left := left + 1;
                        WHILE (right > start) AND (arr[right] >= pivot) DO
                            right := right - 1;
                        IF left < right THEN
                            swap(arr[left], arr[right]);
                    END;

                    { Put the pivot between the halves. }
                    swap(arr[start], arr[right]);

                    { This is how you return function values in pascal.
                      Yeccch. }
                    Split := right
                END;

            BEGIN { QuicksortRecur }
                { If there's anything to do... }
                IF start < stop THEN BEGIN
                    splitpt := Split(start, stop);
                    QuicksortRecur(start, splitpt-1);
                    QuicksortRecur(splitpt+1, stop);
                END
            END;

        BEGIN { Quicksort }
            QuicksortRecur(1, size)
        END;

    BEGIN
        { Read }
        ReadArr(size, arr);

        { Sort the contents. }
        Quicksort(size, arr);

        { Print. }
        FOR i := 1 TO size DO
            writeln(arr[i])
    END.

{ From http://sandbox.mc.edu/~bennet/cs404/doc/qsort_pas.html }
