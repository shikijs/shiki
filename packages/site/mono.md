```js
const shiki = require('shiki')

const t = shiki.loadTheme('./monochrome-dark-subtle.json')

shiki.getHighlighter({
  theme: t
})
```