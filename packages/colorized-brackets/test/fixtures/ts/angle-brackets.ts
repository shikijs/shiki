const objectToEntries = (obj: Record<string, string>) => {
  //                    Y           P              PY    Y @colors
  if (Object.keys(obj).length > 0) {
    //           B   B           P P @colors 5=P
    return Object.entries(obj);
    //                   B   B @colors
  }
  // @colors 2=P
  return null;
};
// @colors 0=Y
