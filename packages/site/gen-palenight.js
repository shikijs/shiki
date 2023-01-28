const fs = require('fs')
const markdown = require('markdown-it')
const shiki = require('shiki')

shiki
  .getHighlighter({
    theme: 'material-theme-palenight'
  })
  .then(highlighter => {
    const md = markdown({
      highlight: (code, lang) => {
        return highlighter.codeToHtml(code, { lang })
      }
    })

    const result = md.render(fs.readFileSync('palenight.md', 'utf-8'))
    fs.writeFileSync('palenight.html', result)

    console.log('done: palenight.html')
  })
