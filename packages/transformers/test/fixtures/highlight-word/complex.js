export function transformerNotationFocus(
  // [!code word:options.a]
  options = {}, // [!code word:console.log:2]
) {
  const options = 'options'
  console.log(options) // TODO: cross-token highlighting should be supported
  options.a = "HELLO"
  console.log('// [!code word:options.a]')
}
