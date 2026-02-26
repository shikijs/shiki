import type { CodeOptionsMultipleThemes, CodeToTokensOptions, GrammarState, ShikiPrimitive, StringLiteralUnion, ThemedToken, ThemeRegistrationAny, TokensResult } from '@shikijs/types'
import { codeToTokensWithThemes, getLastGrammarStateFromMap, setLastGrammarStateToMap } from '@shikijs/primitive'
import { ShikiError } from '@shikijs/types'
import { applyColorReplacements, flatTokenVariants, resolveColorReplacements } from '../utils'
import { DEFAULT_COLOR_LIGHT_DARK } from '../utils/constants'
import { codeToTokensBase } from './code-to-tokens-base'

/**
 * High-level code-to-tokens API.
 *
 * It will use `codeToTokensWithThemes` or `codeToTokensBase` based on the options.
 */
export function codeToTokens(
  primitive: ShikiPrimitive,
  code: string,
  options: CodeToTokensOptions,
): TokensResult {
  let bg: string
  let fg: string
  let tokens: ThemedToken[][]
  let themeName: string
  let rootStyle: string | undefined
  let grammarState: GrammarState | undefined

  if ('themes' in options) {
    const {
      defaultColor = 'light',
      cssVariablePrefix = '--shiki-',
      colorsRendering = 'css-vars',
    } = options

    const themes = Object
      .entries(options.themes)
      .filter(i => i[1])
      .map(i => ({ color: i[0], theme: i[1]! }))
      .sort((a, b) => a.color === defaultColor ? -1 : b.color === defaultColor ? 1 : 0)

    if (themes.length === 0)
      throw new ShikiError('`themes` option must not be empty')

    const themeTokens = codeToTokensWithThemes(
      primitive,
      code,
      options,
    )

    grammarState = getLastGrammarStateFromMap(themeTokens)

    if (defaultColor && DEFAULT_COLOR_LIGHT_DARK !== defaultColor && !themes.find(t => t.color === defaultColor))
      throw new ShikiError(`\`themes\` option must contain the defaultColor key \`${defaultColor}\``)

    const themeRegs = themes.map(t => primitive.getTheme(t.theme))
    const themesOrder = themes.map(t => t.color)
    tokens = themeTokens
      .map(line => line.map(token => flatTokenVariants(token, themesOrder, cssVariablePrefix, defaultColor, colorsRendering)))

    if (grammarState)
      setLastGrammarStateToMap(tokens, grammarState)

    const themeColorReplacements = themes.map(t => resolveColorReplacements(t.theme, options))

    fg = mapThemeColors(themes, themeRegs, themeColorReplacements, cssVariablePrefix, defaultColor, 'fg', colorsRendering)
    bg = mapThemeColors(themes, themeRegs, themeColorReplacements, cssVariablePrefix, defaultColor, 'bg', colorsRendering)

    themeName = `shiki-themes ${themeRegs.map(t => t.name).join(' ')}`
    rootStyle = defaultColor ? undefined : [fg, bg].join(';')
  }
  else if ('theme' in options) {
    const colorReplacements = resolveColorReplacements(options.theme, options)

    tokens = codeToTokensBase(
      primitive,
      code,
      options,
    )

    const _theme = primitive.getTheme(options.theme)
    bg = applyColorReplacements(_theme.bg, colorReplacements)
    fg = applyColorReplacements(_theme.fg, colorReplacements)
    themeName = _theme.name
    grammarState = getLastGrammarStateFromMap(tokens)
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
    grammarState,
  }
}

function mapThemeColors(
  themes: Array<{ color: string, theme: ThemeRegistrationAny | StringLiteralUnion<string> }>,
  themeRegs: any[],
  themeColorReplacements: any[],
  cssVariablePrefix: string,
  defaultColor: false | StringLiteralUnion<'light' | 'dark'> | 'light-dark()' | undefined,
  property: 'fg' | 'bg',
  colorsRendering: CodeOptionsMultipleThemes['colorsRendering'],
): string {
  return themes
    .map((t, idx) => {
      const value = applyColorReplacements(themeRegs[idx][property], themeColorReplacements[idx]) || 'inherit'
      const cssVar = `${cssVariablePrefix + t.color}${property === 'bg' ? '-bg' : ''}:${value}`
      if (idx === 0 && defaultColor) {
        // light-dark()
        if (defaultColor === DEFAULT_COLOR_LIGHT_DARK && themes.length > 1) {
          const lightIndex = themes.findIndex(t => t.color === 'light')
          const darkIndex = themes.findIndex(t => t.color === 'dark')
          if (lightIndex === -1 || darkIndex === -1)
            throw new ShikiError('When using `defaultColor: "light-dark()"`, you must provide both `light` and `dark` themes')
          const lightValue = applyColorReplacements(themeRegs[lightIndex][property], themeColorReplacements[lightIndex]) || 'inherit'
          const darkValue = applyColorReplacements(themeRegs[darkIndex][property], themeColorReplacements[darkIndex]) || 'inherit'
          return `light-dark(${lightValue}, ${darkValue});${cssVar}`
        }
        return value
      }
      if (colorsRendering === 'css-vars') {
        return cssVar
      }
      return null
    })
    .filter(i => !!i)
    .join(';')
}
