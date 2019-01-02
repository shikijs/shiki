```js
const shiki = require('shiki')

const t = shiki.loadTheme('./solarized-dark.tmTheme')

shiki.getHighlighter({
  theme: t
})
```