export function transformerNotationFocus(
  // [!code word:options:2]
  options = {}, // [!code word:log]
) {
  const options = 'options'
  console.log(options)
  options.a = "HELLO" // should not be highlighted
}
