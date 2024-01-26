export function transformerNotationFocus(
  // [!code word:options:3]
  options = {}, // [!code word:log]
) {
  const options = 'options'
  console.log(options)
  options.a = "HELLO" // should not be highlighted
}
