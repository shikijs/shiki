const fs = require('fs')
const markdown = require('markdown-it')
const shiki = require('shiki')

const t = shiki.loadTheme('./monochrome-dark-subtle.json')

shiki
  .getHighlighter({
    theme: t
  })
  .then(highlighter => {
    const md = markdown({
      highlight: (code, lang) => {
        return highlighter.codeToHtml(code, lang)
      }
    })

    const result = md.render(fs.readFileSync('mono.md', 'utf-8'))
    fs.writeFileSync('mono.html', result)

    console.log('done: mono.html')
  })
