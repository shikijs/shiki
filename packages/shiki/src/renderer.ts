import { FontStyle } from './stackElementMetadata'
import { IThemedToken } from './themedTokenizer'
import { HtmlRendererOptions, LineOption, ElementsOptions } from './types'
import { groupBy } from './utils'

const defaultElements: ElementsOptions = {
  pre({ className, style, children }) {
    return `<pre class="${className}" style="${style}">${children}</pre>`
  },

  code({ children }) {
    return `<code>${children}</code>`
  },

  line({ className, children }) {
    return `<span class="${className}">${children}</span>`
  },

  token({ style, children }) {
    return `<span style="${style}">${children}</span>`
  }
}

export function renderToHtml(lines: IThemedToken[][], options: HtmlRendererOptions = {}) {
  const bg = options.bg || '#fff'
  const optionsByLineNumber = groupBy(options.lineOptions ?? [], option => option.line)
  const userElements = options.elements || {}

  function h(type: string = '', props = {}, children: string[]): string {
    const element = userElements[type] || defaultElements[type]
    if (element) {
      children = children.filter(Boolean)

      return element({
        ...props,
        children: type === 'code' ? children.join('\n') : children.join('')
      })
    }

    return ''
  }

  return h('pre', { className: 'shiki', style: `background-color: ${bg}` }, [
    options.langId ? `<div class="language-id">${options.langId}</div>` : '',
    h(
      'code',
      {},
      lines.map((line, index) => {
        const lineNumber = index + 1
        const lineOptions = optionsByLineNumber.get(lineNumber) ?? []
        const lineClasses = getLineClasses(lineOptions).join(' ')
        return h(
          'line',
          {
            className: lineClasses,
            lines,
            line,
            index
          },
          line.map((token, index) => {
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

            return h(
              'token',
              {
                style: cssDeclarations.join('; '),
                tokens: line,
                token,
                index
              },
              [escapeHtml(token.content)]
            )
          })
        )
      })
    )
  ])
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
