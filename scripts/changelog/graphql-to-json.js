console.log(
	JSON.stringify({ query: require('fs').readFileSync(process.argv[2], 'utf-8') })
)
