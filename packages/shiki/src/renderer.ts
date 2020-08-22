import { IThemedToken } from './themedTokenizer'

export interface HtmlRendererOptions {
  langId?: string
  fg?: string
  bg?: string
  wrapLines?: boolean
}

export function renderToHtml(lines: IThemedToken[][], options: HtmlRendererOptions = {}) {
  const bg = options.bg || '#fff'
  const wrapLines = options.wrapLines || false

  let html = ''

  html += `<pre class="shiki" style="background-color: ${bg}">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }
  html += `<code>`

  lines.forEach((l: IThemedToken[]) => {
    if (l.length === 0) {
      html += wrapLines ? `<span></span>\n` : `\n`
    } else {
      html += wrapLines ? `<span>` : ``
      l.forEach(token => {
        html += `<span style="color: ${token.color || options.fg}">${escapeHtml(
          token.content
        )}</span>`
      })
      html += wrapLines ? `</span>\n` : `\n`
    }
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
