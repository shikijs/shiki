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

    const themeTokens = codeToTokensWithThemes(context, code, options)
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
        const colors = tokenMap.map((t, idx) => `${idx === 0 && defaultColor ? '' : `${cssVariablePrefix + themeTokens[idx][0]}:`}${t.color || 'inherit'}`).join(';')
        lineout.push({
          ...tokenMap[0],
          color: colors,
          htmlStyle: defaultColor ? undefined : colors,
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
    children: [
      {
        type: 'element',
        tagName: 'pre',
        properties: {
          class: `shiki ${options.themeName || ''}`,
          style: options.rootStyle || `background-color:${options.bg};color:${options.fg}`,
          tabindex: '0',
        },
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: {},
            children: lines,
          },
        ],
      },
    ],
  }

  tokens.forEach((line, idx) => {
    if (idx)
      lines.push({ type: 'text', value: '\n' })

    const lineNode: Element = {
      type: 'element',
      tagName: 'span',
      properties: { class: 'line' },
      children: [],
    }
    lines.push(lineNode)

    for (const token of line) {
      const styles = [token.htmlStyle || `color:${token.color}`]
      if (token.fontStyle) {
        if (token.fontStyle & FontStyle.Italic)
          styles.push('font-style:italic')
        if (token.fontStyle & FontStyle.Bold)
          styles.push('font-weight:bold')
        if (token.fontStyle & FontStyle.Underline)
          styles.push('text-decoration:underline')
      }

      const tokenNode: Element = {
        type: 'element',
        tagName: 'span',
        properties: {
          style: styles.join(';'),
        },
        children: [{ type: 'text', value: token.content }],
      }

      lineNode.children.push(tokenNode)
    }
  })

  return options.hastTransform?.(tree) || tree
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
