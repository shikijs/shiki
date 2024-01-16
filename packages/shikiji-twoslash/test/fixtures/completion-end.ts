// @noErrors
console.e
//       ^|


const a: { test: 'foo' | 'bar' | 'baz' } = {
  test: 'foo'
}
a.t
// ^|


a.test === '
//          ^|


a.test === 'b
//           ^|


a.test === 'bar'
//           ^|


a.test === 'bar'
//          ^|
