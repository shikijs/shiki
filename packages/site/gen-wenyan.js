const fs = require('fs')
const shiki = require('shiki')
const { getSVGRenderer } = require('shiki-renderer-svg')

;(async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'nord'
  })

  const svgRenderer = await getSVGRenderer({
    bg: '#2E3440',
    fontFamily: 'PingFang TC',
    fontSize: 14
  })

  const code = fs.readFileSync('beer.wy', 'utf-8')

  const html = highlighter.codeToHtml(code, '文言')

  fs.writeFileSync('文言.html', html)

  console.log('done: 文言')
})()
