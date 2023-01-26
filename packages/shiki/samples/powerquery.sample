// Transforms a table into markdown syntax
(Table as table) =>
    let
    Source = Table,
    TableValues = Table.AddColumn(
        Source, "Custom", each Text.Combine(Record.FieldValues(_), " | ")
    ),
    HyphenLine = Text.Combine(
      List.Transform(
        Table.ColumnNames(Source), each Text.Repeat("-", Text.Length(_))
      ),
      " | "
    ),
    CombineList = List.Combine(
      {{Text.Combine(Table.ColumnNames(Source), " | ")},
      {HyphenLine}, TableValues[Custom]}
    ),
    TransferToMarkdown = Text.Combine(CombineList, "#(lf)")
  in
    TransferToMarkdown

// From https://github.com/mogulargmbh/powerquerysnippets/blob/main/snippets/Table_ToMarkdown.pq
