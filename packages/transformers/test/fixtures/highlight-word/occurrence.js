export function transformerNotationFocus(
  // [!code word:'options':4]
  options = {},
) {
  const options = 'options'
  console.log(options)
  options.a = "HELLO" // should not be highlighted
}
