import type { Element, Root, Text } from 'hast'
import type { CodeToHastOptions, HtmlRendererOptions, ShikiContext, ThemedToken } from '../types'
import { codeToThemedTokens } from './tokenizer'
import { FontStyle } from './stackElementMetadata'
import { codeToTokensWithThemes } from './renderer-html-themes'

export function codeToHast(
  context: ShikiContext,
  code: string,
  options: CodeToHastOptions,
) {
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
      .filter(i => i[1]) as [string, string][]

    if (themes.length === 0)
      throw new Error('[shikiji] `themes` option must not be empty')

    const themeTokens = codeToTokensWithThemes(
      context,
      code,
      options,
    )
      .sort(a => a[0] === defaultColor ? -1 : 1)

    if (defaultColor && !themeTokens.find(t => t[0] === defaultColor))
      throw new Error(`[shikiji] \`themes\` option must contain the defaultColor key \`${defaultColor}\``)

    const themeRegs = themeTokens.map(t => context.getTheme(t[1]))
    const themeMap = themeTokens.map(t => t[2])
    tokens = []

    for (let i = 0; i < themeMap[0].length; i++) {
      const lineMap = themeMap.map(t => t[i])
      const lineout: any[] = []
      tokens.push(lineout)
      for (let j = 0; j < lineMap[0].length; j++) {
        const tokenMap = lineMap.map(t => t[j])
        const tokenStyles = tokenMap.map(t => getTokenStyles(t))

        // Get all style keys, for themes that missing some style, we put `inherit` to override as needed
        const styleKeys = new Set(tokenStyles.flatMap(t => Object.keys(t)))
        const mergedStyles = tokenStyles.reduce((acc, cur, idx) => {
          for (const key of styleKeys) {
            const value = cur[key] || 'inherit'

            if (idx === 0 && defaultColor) {
              acc[key] = value
            }
            else {
              const varKey = cssVariablePrefix + themeTokens[idx][0] + (key === 'color' ? '' : `-${key}`)
              if (acc[key])
                acc[key] += `;${varKey}:${value}`
              else
                acc[key] = `${varKey}:${value}`
            }
          }
          return acc
        }, {} as Record<string, string>)

        lineout.push({
          ...tokenMap[0],
          color: '',
          htmlStyle: defaultColor
            ? stringifyTokenStyle(mergedStyles)
            : Object.values(mergedStyles).join(';'),
        })
      }
    }

    fg = themeTokens.map((t, idx) => (idx === 0 && defaultColor ? '' : `${cssVariablePrefix + t[0]}:`) + themeRegs[idx].fg).join(';')
    bg = themeTokens.map((t, idx) => (idx === 0 && defaultColor ? '' : `${cssVariablePrefix + t[0]}-bg:`) + themeRegs[idx].bg).join(';')
    themeName = `shiki-themes ${themeRegs.map(t => t.name).join(' ')}`
    rootStyle = defaultColor ? undefined : [fg, bg].join(';')
  }
  else if ('theme' in options) {
    tokens = codeToThemedTokens(context, code, {
      ...options,
      includeExplanation: false,
    })

    const _theme = context.getTheme(options.theme)
    bg = _theme.bg
    fg = _theme.fg
    themeName = _theme.name
  }
  else {
    throw new Error('[shikiji] Invalid options, either `theme` or `themes` must be provided')
  }

  return tokensToHast(tokens, {
    ...options,
    fg,
    bg,
    themeName,
    rootStyle,
  })
}

export function tokensToHast(
  tokens: ThemedToken[][],
  options: HtmlRendererOptions,
) {
  const {
    mergeWhitespaces = true,
  } = options

  if (mergeWhitespaces)
    tokens = mergeWhitespaceTokens(tokens)

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
    },
    children: [],
  }

  let codeNode: Element = {
    type: 'element',
    tagName: 'code',
    properties: {},
    children: lines,
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

      const style = token.htmlStyle || stringifyTokenStyle(getTokenStyles(token))
      if (style)
        tokenNode.properties.style = style

      tokenNode = options.transforms?.token?.(tokenNode, idx + 1, col, lineNode) || tokenNode

      lineNode.children.push(tokenNode)
      col += token.content.length
    }

    lineNode = options.transforms?.line?.(lineNode, idx + 1) || lineNode
    lines.push(lineNode)
  })

  codeNode = options.transforms?.code?.(codeNode) || codeNode
  preNode.children.push(codeNode)

  preNode = options.transforms?.pre?.(preNode) || preNode
  tree.children.push(preNode)

  return options.transforms?.root?.(tree) || tree
}

function getTokenStyles(token: ThemedToken) {
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
