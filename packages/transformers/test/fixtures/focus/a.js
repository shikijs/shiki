export function foo() {
  console.log('focus') // [!code focus]

  // should not be transformed:
  console.log('[!code focus]')
}
