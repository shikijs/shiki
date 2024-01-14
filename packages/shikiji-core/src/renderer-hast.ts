import type { Element, Root, Text } from 'hast'
import type {
  CodeToHastOptions,
  HtmlRendererOptions,
  ShikiInternal,
  ShikijiTransformerContext,
  ShikijiTransformerContextCommon,
  ThemedToken,
  ThemedTokenWithVariants,
  TokenStyles,
} from './types'
import { codeToThemedTokens } from './tokenizer'
import { FontStyle } from './types'
import { codeToTokensWithThemes } from './renderer-html-themes'

export function codeToHast(
  internal: ShikiInternal,
  code: string,
  options: CodeToHastOptions,
  transformerContext: ShikijiTransformerContextCommon = {
    meta: {},
    options,
    codeToHast: (_code, _options) => codeToHast(internal, _code, _options),
  },
) {
  let input = code
  for (const transformer of options.transformers || [])
    input = transformer.preprocess?.call(transformerContext, input, options) || input

  let bg: string
  let fg: string
  let tokens: ThemedToken[][]
  let themeName: string
  let rootStyle: string | undefined

  if ('themes' in options) {
    const {
      defaultColor = 'light',
      cssVariablePrefix = '--shiki-',
    } = options

    const themes = Object.entries(options.themes)
      .filter(i => i[1])
      .map(i => ({ color: i[0], theme: i[1]! }))
      .sort((a, b) => a.color === defaultColor ? -1 : b.color === defaultColor ? 1 : 0)

    if (themes.length === 0)
      throw new Error('[shikiji] `themes` option must not be empty')

    const themeTokens = codeToTokensWithThemes(
      internal,
      input,
      options,
    )

    if (defaultColor && !themes.find(t => t.color === defaultColor))
      throw new Error(`[shikiji] \`themes\` option must contain the defaultColor key \`${defaultColor}\``)

    const themeRegs = themes.map(t => internal.getTheme(t.theme))

    const themesOrder = themes.map(t => t.color)
    tokens = themeTokens
      .map(line => line.map(token => mergeToken(token, themesOrder, cssVariablePrefix, defaultColor)))

    fg = themes.map((t, idx) => (idx === 0 && defaultColor ? '' : `${cssVariablePrefix + t.color}:`) + themeRegs[idx].fg).join(';')
    bg = themes.map((t, idx) => (idx === 0 && defaultColor ? '' : `${cssVariablePrefix + t.color}-bg:`) + themeRegs[idx].bg).join(';')
    themeName = `shiki-themes ${themeRegs.map(t => t.name).join(' ')}`
    rootStyle = defaultColor ? undefined : [fg, bg].join(';')
  }
  else if ('theme' in options) {
    tokens = codeToThemedTokens(
      internal,
      input,
      {
        ...options,
        includeExplanation: false,
      },
    )

    const _theme = internal.getTheme(options.theme)
    bg = _theme.bg
    fg = _theme.fg
    themeName = _theme.name
  }
  else {
    throw new Error('[shikiji] Invalid options, either `theme` or `themes` must be provided')
  }

  return tokensToHast(
    tokens,
    {
      ...options,
      fg,
      bg,
      themeName,
      rootStyle,
    },
    transformerContext,
  )
}

/**
 *
 */
function mergeToken(
  merged: ThemedTokenWithVariants,
  variantsOrder: string[],
  cssVariablePrefix: string,
  defaultColor: string | boolean,
) {
  const token: ThemedToken = {
    content: merged.content,
    explanation: merged.explanation,
  }

  const styles = variantsOrder.map(t => getTokenStyleObject(merged.variants[t]))

  // Get all style keys, for themes that missing some style, we put `inherit` to override as needed
  const styleKeys = new Set(styles.flatMap(t => Object.keys(t)))
  const mergedStyles = styles.reduce((acc, cur, idx) => {
    for (const key of styleKeys) {
      const value = cur[key] || 'inherit'

      if (idx === 0 && defaultColor) {
        acc[key] = value
      }
      else {
        const varKey = cssVariablePrefix + variantsOrder[idx] + (key === 'color' ? '' : `-${key}`)
        if (acc[key])
          acc[key] += `;${varKey}:${value}`
        else
          acc[key] = `${varKey}:${value}`
      }
    }
    return acc
  }, {} as Record<string, string>)

  token.htmlStyle = defaultColor
    ? stringifyTokenStyle(mergedStyles)
    : Object.values(mergedStyles).join(';')
  return token
}

export function tokensToHast(
  tokens: ThemedToken[][],
  options: HtmlRendererOptions,
  transformerContext: ShikijiTransformerContextCommon,
) {
  const {
    mergeWhitespaces = true,
    transformers = [],
  } = options

  if (mergeWhitespaces === true)
    tokens = mergeWhitespaceTokens(tokens)
  else if (mergeWhitespaces === 'never')
    tokens = splitWhitespaceTokens(tokens)

  const lines: (Element | Text)[] = []
  const tree: Root = {
    type: 'root',
    children: [],
  }

  let preNode: Element = {
    type: 'element',
    tagName: 'pre',
    properties: {
      class: `shiki ${options.themeName || ''}`,
      style: options.rootStyle || `background-color:${options.bg};color:${options.fg}`,
      tabindex: '0',
      ...Object.fromEntries(
        Array.from(
          Object.entries(options.meta || {}),
        )
          .filter(([key]) => !key.startsWith('_')),
      ),
    },
    children: [],
  }

  let codeNode: Element = {
    type: 'element',
    tagName: 'code',
    properties: {},
    children: lines,
  }

  const lineNodes: Element[] = []

  const context: ShikijiTransformerContext = {
    ...transformerContext,
    get tokens() {
      return tokens
    },
    get options() {
      return options
    },
    get root() {
      return tree
    },
    get pre() {
      return preNode
    },
    get code() {
      return codeNode
    },
    get lines() {
      return lineNodes
    },
  }

  tokens.forEach((line, idx) => {
    if (idx)
      lines.push({ type: 'text', value: '\n' })

    let lineNode: Element = {
      type: 'element',
      tagName: 'span',
      properties: { class: 'line' },
      children: [],
    }

    let col = 0

    for (const token of line) {
      let tokenNode: Element = {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [{ type: 'text', value: token.content }],
      }

      const style = token.htmlStyle || stringifyTokenStyle(getTokenStyleObject(token))
      if (style)
        tokenNode.properties.style = style

      for (const transformer of transformers)
        tokenNode = transformer?.token?.call(context, tokenNode, idx + 1, col, lineNode) || tokenNode

      lineNode.children.push(tokenNode)
      col += token.content.length
    }

    for (const transformer of transformers)
      lineNode = transformer?.line?.call(context, lineNode, idx + 1) || lineNode

    lineNodes.push(lineNode)
    lines.push(lineNode)
  })

  for (const transformer of transformers)
    codeNode = transformer?.code?.call(context, codeNode) || codeNode

  preNode.children.push(codeNode)

  for (const transformer of transformers)
    preNode = transformer?.pre?.call(context, preNode) || preNode

  tree.children.push(preNode)

  let result = tree
  for (const transformer of transformers)
    result = transformer?.root?.call(context, result) || result

  return result
}

function getTokenStyleObject(token: TokenStyles) {
  const styles: Record<string, string> = {}
  if (token.color)
    styles.color = token.color
  if (token.fontStyle) {
    if (token.fontStyle & FontStyle.Italic)
      styles['font-style'] = 'italic'
    if (token.fontStyle & FontStyle.Bold)
      styles['font-weight'] = 'bold'
    if (token.fontStyle & FontStyle.Underline)
      styles['text-decoration'] = 'underline'
  }
  return styles
}

function stringifyTokenStyle(token: Record<string, string>) {
  return Object.entries(token).map(([key, value]) => `${key}:${value}`).join(';')
}

function mergeWhitespaceTokens(tokens: ThemedToken[][]) {
  return tokens.map((line) => {
    const newLine: ThemedToken[] = []
    let carryOnContent = ''
    line.forEach((token, idx) => {
      const isUnderline = token.fontStyle && token.fontStyle & FontStyle.Underline
      const couldMerge = !isUnderline
      if (couldMerge && token.content.match(/^\s+$/) && line[idx + 1]) {
        carryOnContent += token.content
      }
      else {
        if (carryOnContent) {
          if (couldMerge) {
            newLine.push({
              ...token,
              content: carryOnContent + token.content,
            })
          }
          else {
            newLine.push(
              {
                content: carryOnContent,
              },
              token,
            )
          }
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

function splitWhitespaceTokens(tokens: ThemedToken[][]) {
  return tokens.map((line) => {
    return line.flatMap((token) => {
      if (token.content.match(/^\s+$/))
        return token
      const match = token.content.match(/^(\s*)(.*?)(\s*)$/)
      if (!match)
        return token
      const [, leading, content, trailing] = match
      if (!leading && !trailing)
        return token

      const expanded = [{
        ...token,
        content,
      }]
      if (leading)
        expanded.unshift({ content: leading })
      if (trailing)
        expanded.push({ content: trailing })
      return expanded
    })
  })
}
