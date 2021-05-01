```js
const shiki = require('shiki')

shiki.getHighlighter({
  theme: JSON.parse(fs.readFileSync('./monochrome-dark-subtle.json', 'utf-8'))
})
```
