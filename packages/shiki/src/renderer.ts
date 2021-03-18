import { FontStyle } from './stackElementMetadata'
import { IThemedToken } from './themedTokenizer'

export interface HtmlRendererOptions {
  langId?: string
  fg?: string
  bg?: string
}

const FONT_STYLE_TO_CSS = {
  [FontStyle.Italic]: 'font-style: italic',
  [FontStyle.Bold]: 'font-weight: bold',
  [FontStyle.Underline]: 'text-decoration: underline'
}

export function renderToHtml(lines: IThemedToken[][], options: HtmlRendererOptions = {}) {
  const bg = options.bg || '#fff'

  let html = ''

  html += `<pre class="shiki" style="background-color: ${bg}">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }
  html += `<code>`

  lines.forEach((l: IThemedToken[]) => {
    html += `<span class="line">`

    l.forEach(token => {
      const cssDeclarations = [`color: ${token.color || options.fg}`]
      if (token.fontStyle > FontStyle.None) {
        cssDeclarations.push(FONT_STYLE_TO_CSS[token.fontStyle])
      }
      html += `<span style="${cssDeclarations.join('; ')}">${escapeHtml(token.content)}</span>`
    })
    html += `</span>\n`
  })
  html = html.replace(/\n*$/, '') // Get rid of final new lines
  html += `</code></pre>`

  return html
}

const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

function escapeHtml(html: string) {
  return html.replace(/[&<>"']/g, chr => htmlEscapes[chr])
}