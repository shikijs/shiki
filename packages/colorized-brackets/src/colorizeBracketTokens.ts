import type { CodeOptionsSingleTheme, CodeOptionsThemes, ThemedToken } from 'shiki'
import type { TransformerColorizedBracketsOptions } from './types'
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
    const styles: string[] = []

    for (const [colorName, theme] of Object.entries(shikiOptions.themes)) {
      const themeName = typeof theme === 'string' ? theme : theme?.name
      const cssProperty
        = colorName === defaultColor
          ? 'color'
          : `${cssVariablePrefix}${colorName}`
      styles.push(`${cssProperty}:${getColor(themes, themeName, level)}`)
    }

    token.htmlStyle = styles.join(';')
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
      : themes[themeName] ?? builtInThemes[themeName] ?? DEFAULT_BRACKETS_COLORS

  const isUnexpected = level === -1
  if (isUnexpected) {
    return colors[colors.length - 1]
  }
  else {
    return colors[level % (colors.length - 1)]
  }
}
