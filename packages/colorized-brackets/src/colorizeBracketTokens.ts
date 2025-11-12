import type { CodeOptionsSingleTheme, CodeOptionsThemes, ThemedToken } from 'shiki'
import type { TransformerColorizedBracketsOptions } from './types'
import { ShikiError } from 'shiki'
import builtInThemes from './themes'
import { getEmbeddedLang, resolveConfig, shouldIgnoreToken } from './utils'

export default function colorizeBracketTokens(
  tokens: ThemedToken[],
  config: TransformerColorizedBracketsOptions,
  shikiOptions: CodeOptionsThemes,
  lang: string,
): void {
  const openerStack: ThemedToken[] = []

  for (const token of tokens) {
    const embeddedLang = getEmbeddedLang(token)
    const resolvedConfig = resolveConfig(config, embeddedLang ?? lang)
    const openers = new Set(
      resolvedConfig.bracketPairs.map(pair => pair.opener),
    )
    const closers = new Set(
      resolvedConfig.bracketPairs.map(pair => pair.closer),
    )
    const closerToOpener = Object.fromEntries(
      resolvedConfig.bracketPairs.map(pair => [pair.closer, pair.opener]),
    )

    const pairDefinition = resolvedConfig.bracketPairs.find(
      pair =>
        pair.opener === token.content.trim()
        || pair.closer === token.content.trim(),
    )
    if (
      !pairDefinition
      || shouldIgnoreToken(
        token,
        pairDefinition.scopesAllowList,
        pairDefinition.scopesDenyList,
      )
    ) {
      continue
    }
    if (openers.has(token.content.trim())) {
      openerStack.push(token)
    }
    else if (closers.has(token.content.trim())) {
      const opener = openerStack
        .slice()
        .reverse()
        .find(t => t.content.trim() === closerToOpener[token.content.trim()])
      if (opener) {
        while (openerStack.at(-1) !== opener) {
          const unexpected = openerStack.pop()
          if (unexpected) {
            assignColorToToken(
              unexpected,
              resolvedConfig.themes,
              shikiOptions,
              -1,
            )
          }
        }
        openerStack.pop()
        assignColorToToken(
          token,
          resolvedConfig.themes,
          shikiOptions,
          openerStack.length,
        )
        assignColorToToken(
          opener,
          resolvedConfig.themes,
          shikiOptions,
          openerStack.length,
        )
      }
      else {
        assignColorToToken(token, resolvedConfig.themes, shikiOptions, -1)
      }
    }
  }

  for (const token of openerStack) {
    assignColorToToken(
      token,
      resolveConfig(config, lang).themes,
      shikiOptions,
      -1,
    )
  }
}

function assignColorToToken(
  token: ThemedToken,
  themes: Record<string, string[]>,
  shikiOptions: CodeOptionsThemes,
  level: number,
): void {
  if (isSingleTheme(shikiOptions)) {
    const themeName
      = typeof shikiOptions.theme === 'string'
        ? shikiOptions.theme
        : shikiOptions.theme.name
    token.color = getColor(themes, themeName, level)
  }
  else {
    const { defaultColor = 'light', cssVariablePrefix = '--shiki-' }
      = shikiOptions
    const styles: Record<string, string> = typeof token.htmlStyle === 'string'
      ? {}
      // clone to make sure we're not mutating a shared style object
      : structuredClone(token.htmlStyle ?? {})

    for (const [colorName, theme] of Object.entries(shikiOptions.themes)) {
      const themeName = typeof theme === 'string' ? theme : theme?.name
      const cssProperty
        = colorName === defaultColor
          ? 'color'
          : `${cssVariablePrefix}${colorName}`
      styles[cssProperty] = getColor(themes, themeName, level)
    }

    if (defaultColor === 'light-dark()') {
      const lightColor = styles[`${cssVariablePrefix}light`]
      const darkColor = styles[`${cssVariablePrefix}dark`]
      if (!lightColor || !darkColor) {
        throw new ShikiError('When using `defaultColor: "light-dark()"`, you must provide both `light` and `dark` themes')
      }
      styles.color = `light-dark(${lightColor},${darkColor})`
    }

    token.htmlStyle = styles
  }
}

function isSingleTheme(
  shikiOptions: CodeOptionsThemes,
): shikiOptions is CodeOptionsSingleTheme {
  return 'theme' in shikiOptions
}

const DEFAULT_BRACKETS_COLORS = [
  '#FFD700',
  '#DA70D6',
  '#179FFF',
  'rgba(255, 18, 18, 0.8)',
]

function getColor(
  themes: Record<string, string[]>,
  themeName: string | undefined,
  level: number,
): string {
  const colors
    = themeName == null
      ? DEFAULT_BRACKETS_COLORS
      : getThemeColors(themeName, themes) ?? getThemeColors(themeName, builtInThemes) ?? DEFAULT_BRACKETS_COLORS

  const isUnexpected = level === -1
  if (isUnexpected) {
    return colors[colors.length - 1]
  }
  else {
    return colors[level % (colors.length - 1)]
  }
}

function getThemeColors(themeName: string, themes: Record<string, string[]>): string[] | null {
  if (themes[themeName])
    return themes[themeName]

  // check if the start of the name matches any themes
  // this improves compatibility with "Expressive Code", which appends unique IDs to the end of themeNames
  const startsWithName = Object.keys(themes).sort().reverse().find(key => themeName.startsWith(key))
  if (startsWithName)
    return themes[startsWithName]

  return null
}
