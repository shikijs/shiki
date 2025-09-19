// [\!code highlight:1-3]
export function foo() {
  const a = "Hello World"

  // should not be transformed:
  console.log('// [!code highlight:1-3]')

  // [\!code focus:5-7]
  return a
}
