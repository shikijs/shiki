// @noErrors
console.log
//       ^|


const a: { test: 'foo' | 'bar' | 'baz' } = {
  test: 'foo'
}
a.test
//   ^|


a.test === 'foo'
//          ^|


a.test === 'bar'
//           ^|


a.test === 'baz'
//          ^|


a.test === 'bar'
//          ^|