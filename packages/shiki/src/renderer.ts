import { FontStyle } from './stackElementMetadata'
import { IThemedToken } from './themedTokenizer'
import { HtmlRendererOptions, LineOption } from './types'
import { groupBy } from './utils'

export function renderToHtml(lines: IThemedToken[][], options: HtmlRendererOptions = {}) {
  const bg = options.bg || '#fff'
  const optionsByLineNumber = groupBy(options.lineOptions ?? [], option => option.line)

  let html = ''

  html += `<pre class="shiki" style="background-color: ${bg}">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }
  html += `<code>`

  lines.forEach((l: IThemedToken[], lineIndex: number) => {
    const lineNumber = lineIndex + 1
    const lineOptions = optionsByLineNumber.get(lineNumber) ?? []
    const lineClasses = getLineClasses(lineOptions).join(' ')

    html += `<span class="${lineClasses}">`

    l.forEach(token => {
      const cssDeclarations = [`color: ${token.color || options.fg}`]
      if (token.fontStyle & FontStyle.Italic) {
        cssDeclarations.push('font-style: italic')
      }
      if (token.fontStyle & FontStyle.Bold) {
        cssDeclarations.push('font-weight: bold')
      }
      if (token.fontStyle & FontStyle.Underline) {
        cssDeclarations.push('text-decoration: underline')
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

function getLineClasses(lineOptions: LineOption[]): string[] {
  const lineClasses = new Set(['line'])
  for (const lineOption of lineOptions) {
    for (const lineClass of lineOption.classes ?? []) {
      lineClasses.add(lineClass)
    }
  }
  return Array.from(lineClasses)
}
