const fs = require('fs')
const shiki = require('shiki')
const { getSVGRenderer } = require('shiki-renderer-svg')

;(async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'nord'
  })

  const svgRenderer = await getSVGRenderer({
    bg: '#2E3440',
    fontFamily: {
      name: 'Inconsolata',
      cssURL: 'https://fonts.googleapis.com/css2?family=Inconsolata&display=swap'
    },
    fontSize: 14
  })

  const code = fs.readFileSync('gen-svg.js', 'utf-8')

  const tokens = highlighter.codeToThemedTokens(code, 'js')
  const out = svgRenderer.renderToSVG(tokens)

  fs.writeFileSync('svg.svg', out)

  console.log('done: svg.svg')
})()
