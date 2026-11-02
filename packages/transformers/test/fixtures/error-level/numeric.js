export function foo() {
  console.log('error') // [!code error:2]
  console.log('error')
  console.log('warn') // [!code warning:2]
  console.log('warn')
}
