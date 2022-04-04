const shiki = require('shiki')

let hl

module.exports = (options, ctx) => {
  return {
    async ready() {
      hl = await shiki.getHighlighter({
        theme: options.theme ? options.theme : 'nord',
        langs: options.langs ? options.langs : []
      })

      // load additional languages
      if (options.additionalLangs) {
        for (langRegist of options.additionalLangs) {
          await hl.loadLanguage(langRegist)
        }
      }
    },

    chainMarkdown(config) {
      config.options.highlight((code, lang) => {
        if (!lang) {
          return `<pre><code>${escapeHtml(code)}</code></pre>`
        }
        return hl.codeToHtml(code, { lang })
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
