// [!code word:a]
export function foo() {
  const a = "Hello World"

  // should not be transformed:
  console.log('// [!code word:a]')
}
