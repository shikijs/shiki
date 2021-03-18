const fs = require('fs')
const shiki = require('shiki')

;(async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'nord'
  })

  const code = fs.readFileSync('beer.wy', 'utf-8')

  const html = highlighter.codeToHtml(code, '文言')

  fs.writeFileSync('文言.html', html)

  console.log('done: 文言')
})()
