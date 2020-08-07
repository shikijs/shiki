import { IThemedToken } from './themedTokenizer'
import { isNumber } from 'util'

export interface HtmlRendererOptions {
  langId?: string
  fg?: string
  bg?: string
  highlightLines?: (string | number)[]
}

export function renderToHtml(lines: IThemedToken[][], options: HtmlRendererOptions = {}) {
  const bg = options.bg || '#fff'
  const highlightedLines = makeHighlightSet(options.highlightLines)

  let html = ''
  let className = 'shiki'
  if (highlightedLines.size) {
    className += ' highlighted'
  }

  html += `<pre class="${className}" style="background-color: ${bg}">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }
  html += `<code>`

  lines.forEach((l: IThemedToken[], index: number) => {
    const lineNo = index + 1
    if (highlightedLines.has(lineNo)) {
      html += `<span class="hl">`
    }

    if (l.length > 0) {
      l.forEach(token => {
        html += `<span style="color: ${token.color || options.fg}">${escapeHtml(
          token.content
        )}</span>`
      })
    }

    if (highlightedLines.has(lineNo)) {
      html += `</span>\n`
    } else {
      html += `\n`
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

function commaSeparatedLinesToArray(lineList: string) {
  return lineList.split(',').map(segment => {
    if (Number(segment) > 0) {
      return Number(segment)
    }
    return segment
  })
}

function makeHighlightSet(highlightLines?: (string | number)[]) {
  const lines = new Set()

  if (!highlightLines) {
    return lines
  }

  for (let lineSpec of highlightLines) {
    if (typeof lineSpec === 'number') {
      lines.add(lineSpec)
    } else if (lineSpec.includes('-')) {
      const [begin, end] = lineSpec.split('-').map(lineNo => Number(lineNo))
      for (let line = begin; line <= end; line++) {
        lines.add(line)
      }
    }
  }

  return lines
}
