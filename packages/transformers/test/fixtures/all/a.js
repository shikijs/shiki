function hello(indentSize, type) {
  if (indentSize === 4 && type !== 'tab') {
    	console.log('Each next indentation will increase on 4 spaces'); // [!code error] [!code focus]
  }
}
