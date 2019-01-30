const shiki = require('shiki')

let h

module.exports = (options, ctx) => {
  return {
    async ready() {
      h = await shiki.getHighlighter({
        theme: options.theme ? options.theme : 'nord'
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
