export function foo() {
  console.log('highlight') // [!code highlight]
  console.log('hl') // [!code hl]

  // should not be transformed:
  console.log('[!code highlight]')
}
