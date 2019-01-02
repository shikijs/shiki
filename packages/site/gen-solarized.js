const fs = require('fs')
const markdown = require('markdown-it')
const shiki = require('shiki')

const t = shiki.loadTheme('./solarized-dark.tmTheme')

shiki.getHighlighter({
  theme: t
}).then(highlighter => {
  const md = markdown({
    highlight: (code, lang) => {
      return highlighter.codeToHtml(code, lang)
    }
  })

  const result = md.render(fs.readFileSync('solarized.md', 'utf-8'))
  fs.writeFileSync('solarized.html', result)

  console.log('done')
})
