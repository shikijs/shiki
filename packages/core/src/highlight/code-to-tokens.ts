import type { CodeToTokensOptions, ShikiInternal, ThemedToken, ThemedTokenWithVariants, TokensResult } from '@shikijs/types'
import { ShikiError } from '../../../types/src/error'
import { applyColorReplacements, getTokenStyleObject, resolveColorReplacements, stringifyTokenStyle } from '../utils'
import { codeToTokensBase } from './code-to-tokens-base'
import { codeToTokensWithThemes } from './code-to-tokens-themes'

/**
 * High-level code-to-tokens API.
 *
 * It will use `codeToTokensWithThemes` or `codeToTokensBase` based on the options.
 */
export function codeToTokens(
  internal: ShikiInternal,
  code: string,
  options: CodeToTokensOptions,
): TokensResult {
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

    const themes = Object
      .entries(options.themes)
      .filter(i => i[1])
      .map(i => ({ color: i[0], theme: i[1]! }))
      .sort((a, b) => a.color === defaultColor ? -1 : b.color === defaultColor ? 1 : 0)

    if (themes.length === 0)
      throw new ShikiError('`themes` option must not be empty')

    const themeTokens = codeToTokensWithThemes(
      internal,
      code,
      options,
    )

    if (defaultColor && !themes.find(t => t.color === defaultColor))
      throw new ShikiError(`\`themes\` option must contain the defaultColor key \`${defaultColor}\``)

    const themeRegs = themes.map(t => internal.getTheme(t.theme))
    const themesOrder = themes.map(t => t.color)
    tokens = themeTokens
      .map(line => line.map(token => mergeToken(token, themesOrder, cssVariablePrefix, defaultColor)))

    const themeColorReplacements = themes.map(t => resolveColorReplacements(t.theme, options))

    fg = themes.map((t, idx) => (idx === 0 && defaultColor
      ? ''
      : `${cssVariablePrefix + t.color}:`) + (applyColorReplacements(themeRegs[idx].fg, themeColorReplacements[idx]) || 'inherit')).join(';')
    bg = themes.map((t, idx) => (idx === 0 && defaultColor
      ? ''
      : `${cssVariablePrefix + t.color}-bg:`) + (applyColorReplacements(themeRegs[idx].bg, themeColorReplacements[idx]) || 'inherit')).join(';')
    themeName = `shiki-themes ${themeRegs.map(t => t.name).join(' ')}`
    rootStyle = defaultColor ? undefined : [fg, bg].join(';')
  }
  else if ('theme' in options) {
    const colorReplacements = resolveColorReplacements(options.theme, options)

    tokens = codeToTokensBase(
      internal,
      code,
      options,
    )

    const _theme = internal.getTheme(options.theme)
    bg = applyColorReplacements(_theme.bg, colorReplacements)
    fg = applyColorReplacements(_theme.fg, colorReplacements)
    themeName = _theme.name
  }
  else {
    throw new ShikiError('Invalid options, either `theme` or `themes` must be provided')
  }

  return {
    tokens,
    fg,
    bg,
    themeName,
    rootStyle,
  }
}

function mergeToken(
  merged: ThemedTokenWithVariants,
  variantsOrder: string[],
  cssVariablePrefix: string,
  defaultColor: string | boolean,
): ThemedToken {
  const token: ThemedToken = {
    content: merged.content,
    explanation: merged.explanation,
    offset: merged.offset,
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
        const keyName = key === 'color' ? '' : key === 'background-color' ? '-bg' : `-${key}`
        const varKey = cssVariablePrefix + variantsOrder[idx] + (key === 'color' ? '' : keyName)
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
