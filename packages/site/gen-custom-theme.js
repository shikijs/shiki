// @ts-check

const fs = require('fs')
const markdown = require('markdown-it')
const shiki = require('shiki')

shiki.getHighlighter({
  theme: "nord",
  langs: [{
    id: 'svelte',
    scopeName: 'source.svelte',
    path: './svelte.tmLanguage.json',
    aliases: []
  },
  ...shiki.commonLangIds
]
}).then(highlighter => {
  const md = markdown({
    highlight: (code, lang) => {
      return highlighter.codeToHtml(code, lang)
    }
  })

  const result = md.render(fs.readFileSync('svelte.md', 'utf-8'))
  fs.writeFileSync('svelte.html', result)

  console.log('done')
})
