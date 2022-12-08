import { FontStyle } from './stackElementMetadata'
import { IThemedToken } from './themedTokenizer'
import { HtmlRendererOptions, LineOption, ElementsOptions, IShikiPluginContext } from './types'
import { groupBy } from './utils'
import { applyPluginHooks, applyPluginTags } from './plugin'

const defaultElements: ElementsOptions = {
  pre({ className, style, attributes, children }) {
    return `<pre class="${className}" style="${style}" ${attributes}>${children}</pre>`
  },

  code({ attributes, children }) {
    return `<code ${attributes}>${children}</code>`
  },

  line({ className, style, attributes, children }) {
    return `<span class="${className}" style="${style}" ${attributes}>${children}</span>`
  },

  token({ className, style, attributes, children }) {
    return `<span class="${className}" style="${style}" ${attributes}>${children}</span>`
  }
}

export function renderToHtml(lines: IThemedToken[][], options: HtmlRendererOptions = {}) {
  const bg = options.bg || '#fff'
  const optionsByLineNumber = groupBy(options.lineOptions ?? [], option => option.line)
  const userElements = options.elements || {}
  let plugins = options.plugins || []

  let pluginContext: IShikiPluginContext = {
    language: options.language || 'text',
    theme: options.theme
  }

  ;({ lines, plugins } =
    plugins?.length > 0
      ? applyPluginHooks('before', pluginContext, plugins, lines)
      : { lines, plugins })

  function h(type: string = '', props = {}, children: string[]): string {
    const element = userElements[type] || defaultElements[type]

    if (element) {
      children = children.filter(Boolean)
      ;({ props, plugins = [] } =
        plugins?.length > 0 ? applyPluginTags(type, pluginContext, plugins, props) : { props })

      let el = element({
        ...props,
        children: type === 'code' ? children.join('\n') : children.join('')
      })
        .replace(/" >/gi, '">')
        .replace(/ >/gi, '>')
        .replace(/ [\w.\-_:]*(=""|="undefined")| undefined|/gm, '') // clean HTML from empty attributes

      ;({ el, plugins } =
        plugins?.length > 0
          ? applyPluginHooks('after', pluginContext, plugins, el, type)
          : { el, plugins })

      return el
    }

    return ''
  }

  return h(
    'pre',
    {
      className: `shiki ${typeof options.theme === 'string' ? options.theme : options.theme.name}`,
      style: `background-color: ${bg};`
    },
    [
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
    ]
  )
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
