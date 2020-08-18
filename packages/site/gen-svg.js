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
