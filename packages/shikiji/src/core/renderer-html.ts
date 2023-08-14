import type { ElementsOptions, HtmlRendererOptions, LineOption, ThemedToken } from '../types'
import { FontStyle } from './stackElementMetadata'

const defaultElements: ElementsOptions = {
  pre({ className, style, children }) {
    return `<pre class="${className}" style="${style}" tabindex="0">${children}</pre>`
  },
  code({ children }) {
    return `<code>${children}</code>`
  },
  line({ className, children }) {
    return `<span class="${className}">${children}</span>`
  },
  token({ style, children }) {
    return `<span style="${style}">${children}</span>`
  },
}

export function renderToHtml(lines: ThemedToken[][], options: HtmlRendererOptions = {}) {
  const {
    mergeWhitespaces = true,
  } = options

  if (mergeWhitespaces)
    lines = mergeWhitespaceTokens(lines)

  const bg = options.bg || '#fff'
  const fg = options.bg || '#000'
  const optionsByLineNumber = groupBy(options.lineOptions ?? [], option => option.line)
  const userElements = options.elements || {}

  function h(type = '', props = {}, children: string[]): string {
    // @ts-expect-error don't check
    const element = userElements[type] || defaultElements[type]
    if (element) {
      children = children.filter(Boolean)

      return element({
        ...props,
        children: type === 'code' ? children.join('\n') : children.join(''),
      })
    }

    return ''
  }

  return h(
    'pre',
    {
      className: `shiki ${options.themeName || ''}`,
      style: options.rootStyle || `background-color:${bg};color:${fg}`,
    },
    [
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
              index,
            },
            line.map((token, index) => {
              const cssDeclarations = [token.htmlStyle || `color:${token.color || options.fg}`]
              if (token.fontStyle) {
                if (token.fontStyle & FontStyle.Italic)
                  cssDeclarations.push('font-style:italic')
                if (token.fontStyle & FontStyle.Bold)
                  cssDeclarations.push('font-weight:bold')
                if (token.fontStyle & FontStyle.Underline)
                  cssDeclarations.push('text-decoration:underline')
              }

              return h(
                'token',
                {
                  style: cssDeclarations.join('; '),
                  tokens: line,
                  token,
                  index,
                },
                [escapeHtml(token.content)],
              )
            }),
          )
        }),
      ),
    ],
  )
}

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
}

function escapeHtml(html: string) {
  return html.replace(/[&<>"']/g, chr => htmlEscapes[chr])
}

function getLineClasses(lineOptions: LineOption[]): string[] {
  const lineClasses = new Set(['line'])
  for (const lineOption of lineOptions) {
    for (const lineClass of lineOption.classes ?? [])
      lineClasses.add(lineClass)
  }
  return Array.from(lineClasses)
}

export function groupBy<TElement, TKey>(
  elements: TElement[],
  keyGetter: (element: TElement) => TKey,
): Map<TKey, TElement[]> {
  const map = new Map<TKey, TElement[]>()
  for (const element of elements) {
    const key = keyGetter(element)
    if (map.has(key)) {
      const group = map.get(key)!
      group.push(element)
    }
    else {
      map.set(key, [element])
    }
  }
  return map
}

function mergeWhitespaceTokens(tokens: ThemedToken[][]) {
  return tokens.map((line) => {
    const newLine: ThemedToken[] = []
    let carryOnContent = ''
    line.forEach((token, idx) => {
      if (token.content.match(/^\s+$/) && line[idx + 1]) {
        carryOnContent += token.content
      }
      else {
        if (carryOnContent) {
          newLine.push({
            ...token,
            content: carryOnContent + token.content,
          })
          carryOnContent = ''
        }
        else {
          newLine.push(token)
        }
      }
    })
    return newLine
  })
}
