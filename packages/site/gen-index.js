const fs = require('fs')
const markdown = require('markdown-it')
const shiki = require('shiki')

shiki.getHighlighter({
  theme: 'nord'
}).then(highlighter => {
  const md = markdown({
    html: true,
    highlight: (code, lang) => highlighter.codeToHtml(code, lang)
  })

  const result = md.render(fs.readFileSync('index.md', 'utf-8'))
  const style = `<link rel="stylesheet" href="style.css">\n`
  const script = `\n<script src="index.js"></script>`
  fs.writeFileSync('index.html', style + result + script)

  console.log('done')
})
