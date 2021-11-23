const fs = require('fs')
const markdown = require('markdown-it')
const shiki = require('shiki')
const path = require('path')

shiki
  .getHighlighter({
    theme: 'nord',
    langs: [
      {
        id: 'rockstar',
        scopeName: 'source.rockstar',
        path: path.resolve('./rockstar.tmLanguage.json'),
        aliases: []
      }
    ]
  })
  .then(highlighter => {
    const md = markdown({
      highlight: (code, lang) => {
        return highlighter.codeToHtml(code, { lang })
      }
    })

    const result = md.render(fs.readFileSync('rockstar.md', 'utf-8'))
    fs.writeFileSync('rockstar.html', result)

    console.log('done: rockstar.html')
  })
