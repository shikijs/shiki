```js
const shiki = require('shiki')

shiki.getHighlighter({
  theme: JSON.parse(fs.readfileSync('./monochrome-dark-subtle.json', 'utf-8'))
})
```
