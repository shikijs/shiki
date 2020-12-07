const shiki = require('shiki')

let h

module.exports = (options, ctx) => {
  return {
    async ready() {
      h = await shiki.getHighlighter({
        theme: options.theme ? options.theme : 'nord',
        langs: options.langs ? options.langs : []
      })
    },

    chainMarkdown(config) {
      config.options.highlight((code, lang) => {
        if (!lang) {
          return `<pre><code>${escapeHtml(code)}</code></pre>`
        }
        return h.codeToHtml(code, lang)
      })
    }
  }
}

const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

function escapeHtml(html) {
  return html.replace(/[&<>"']/g, chr => htmlEscapes[chr])
}
