iStochasticityAssumptions [sm_List] :=
    SquareMatrixQ[sm] && Element[DeleteDuplicates[Flatten[sm]], Reals] &&
    Apply [And, Map[#>=0&, sm, {2}], {0, 1}] && Apply [And, Thread[Total[sm, {2}] == 1]]

iStochasticityAssumptions[sm_SparseArray] := SquareMatrixQ[sm] &&
    Apply[And, Thread[ DeleteDuplicates [ sm["NonzeroValues"] ~Join~ {sm["Background"]} ] >= 0 ] ] &&
    Apply[And, Thread [Total [sm, {2}] = 1]]

(* https://github.com/WolframResearch/vscode-wolfram/blob/master/docs/highlighting.png *)
