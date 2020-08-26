const shiki = require('shiki')

let h

module.exports = (options, ctx) => {
  return {
    async ready() {
      h = await shiki.getHighlighter({
        theme: options.theme ? options.theme : 'nord',
        langs: options.langs ? options.langs : {},
      })
    },

    chainMarkdown(config) {
      config.options.highlight((code, lang) => {
        if (!lang) {
          return `<pre><code>${code}</code></pre>`
        }
        return h.codeToHtml(code, lang)
      })
    }
  }
}
