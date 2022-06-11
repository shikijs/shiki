# shiki-renderer-path

A path renderer for Shiki.

## Usage

```js
const fs = require('fs')
const shiki = require('shiki')
const { getPathRenderer } = require('shiki-renderer-path')

;(async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'nord'
  })

  const pathRenderer = await getPathRenderer({
    fontFile: '/path/to/font.ttf',
    bg: '#2E3440',
    fontSize: 14
  })

  const code = fs.readFileSync('gen-svg.js', 'utf-8')

  const tokens = highlighter.codeToThemedTokens(code, 'js')
  const out = svgPathRenderer.renderToSVG(tokens)

  fs.writeFileSync('svg.svg', out)

  console.log('done: svg.svg')
})()
```
