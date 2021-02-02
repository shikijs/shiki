# shiki-renderer-svg

A SVG renderer for Shiki.

## Usage

```js
const fs = require('fs')
const shiki = require('shiki')
const { getSVGRenderer } = require('shiki-renderer-svg')

;(async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'nord'
  })

  const svgRenderer = await getSVGRenderer({
    bg: '#2E3440',
    fontFamily: 'IBM Plex Mono',
    fontSize: 14
  })

  const code = fs.readFileSync('gen-svg.js', 'utf-8')

  const tokens = highlighter.codeToThemedTokens(code, 'js')
  const out = svgRenderer.renderToSVG(tokens)

  fs.writeFileSync('svg.svg', out)

  console.log('done: svg.svg')
})()
```

### CDN

```html
<script src='https://unpkg.com/shiki'></script>
<script src='https://unpkg.com/shiki-renderer-svg'></script>
```

```html
<script>
;(async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'nord'
  })

  const svgRenderer = await shiki.getSVGRenderer({
    bg: '#2E3440',
    fontFamily: 'IBM Plex Mono',
    fontSize: 14
  })

  const code = document.getElementById('input').value
  const tokens = highlighter.codeToThemedTokens(code, 'js')
  const out = svgRenderer.renderToSVG(tokens)

  document.getElementById('output').innerHTML = out
})()
</script>
