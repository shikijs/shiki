fn largest<T>(list: &[T]) -> &T {
  //         Y       P PY       Y @colors
  // note: the angle brackets are not highlighted
  let mut largest = &list[0];
  //                     P P @colors

  for item in list {
    //             P @colors
    if item > largest {
      //              B @colors
      largest = item;
    }
    // @colors 4=B
  }
  // @colors 2=P

  largest
}
// @colors 0=Y
