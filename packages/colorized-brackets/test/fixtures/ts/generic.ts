function first<T>(array: T[]): T | undefined {
  //          Y YY        PPY                Y @colors
  return array[0];
  //          P P @colors
}
// @colors 0=Y

first<number>([1, 2, 3]);
//   Y      YYP       PY @colors
