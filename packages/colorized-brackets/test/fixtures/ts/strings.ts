let foo = {
  //      Y @colors
  bar: ["()", "[]", "{}"],
  //   P                P @colors
};
// @colors 0=Y
`foo:
  ${foo}
  ${0}
  [[]{}()]
`;

`foo.bar[0]: ${foo.bar[0]}`;
//                    Y Y @colors
