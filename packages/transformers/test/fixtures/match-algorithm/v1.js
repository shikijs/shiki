function hello(indentSize, type) {
  console.log('error and focus'); // [!code error] // [!code focus]
}

// [!code focus:5]
console.log('focus')
console.log('focus')
console.log('focus')
console.log('focus')

// [!code highlight:3]
console.log('highlighted')
console.log('highlighted')

console.log('highlighted') // [!code highlight:2]
console.log('highlighted')

// [!code word:options:4]
let options = 'options'
options = {}, // [!code word:log]
console.log(options)
options.a = "HELLO" // should not be highlighted
