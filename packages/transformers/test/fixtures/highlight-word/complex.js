export function transformerNotationFocus(
  // [!code word:options.a]
  options = {}, // [!code word:console.log:4]
) {
  const options = 'options'
  console.log(options)
  options.a = "HELLO"
  console.log('// [!code word:options.a]')
}
