import type { CodeOptionsSingleTheme, CodeOptionsThemes, ThemedToken } from 'shiki'
import type { ResolvedConfig, TransformerColorizedBracketsOptions } from './types'
import { ShikiError } from 'shiki'
import builtInThemes from './themes'
import { getEmbeddedLang, resolveConfig, shouldIgnoreToken } from './utils'

/**
 * Per `(config, lang)` cache for the indexed bracket-pair data. Walking the
 * `bracketPairs` array and building Sets/Maps for every token of every file
 * is wasteful — the data only depends on the resolved config, not the token.
 */
const indexedConfigCache = new WeakMap<TransformerColorizedBracketsOptions, Map<string, IndexedConfig>>()

interface IndexedConfig extends ResolvedConfig {
  openers: Set<string>
  closers: Set<string>
  /** `opener-or-closer string → BracketPair` for O(1) classification. */
  byBracket: Map<string, ResolvedConfig['bracketPairs'][number]>
  closerToOpener: Map<string, string>
}

function getIndexedConfig(config: TransformerColorizedBracketsOptions, lang: string): IndexedConfig {
  let bucket = indexedConfigCache.get(config)
  if (!bucket) {
    bucket = new Map()
    indexedConfigCache.set(config, bucket)
  }
  let indexed = bucket.get(lang)
  if (indexed)
    return indexed

  const resolved = resolveConfig(config, lang) as ResolvedConfig
  const openers = new Set<string>()
  const closers = new Set<string>()
  const byBracket = new Map<string, ResolvedConfig['bracketPairs'][number]>()
  const closerToOpener = new Map<string, string>()
  for (const pair of resolved.bracketPairs) {
    openers.add(pair.opener)
    closers.add(pair.closer)
    byBracket.set(pair.opener, pair)
    byBracket.set(pair.closer, pair)
    closerToOpener.set(pair.closer, pair.opener)
  }
  indexed = { ...resolved, openers, closers, byBracket, closerToOpener }
  bucket.set(lang, indexed)
  return indexed
}

export default function colorizeBracketTokens(
  tokens: ThemedToken[],
  config: TransformerColorizedBracketsOptions,
  shikiOptions: CodeOptionsThemes,
  lang: string,
): void {
  const openerStack: ThemedToken[] = []

  for (const token of tokens) {
    const embeddedLang = getEmbeddedLang(token)
    const resolved = getIndexedConfig(config, embeddedLang ?? lang)
    const trimmed = token.content.trim()

    const pairDefinition = resolved.byBracket.get(trimmed)
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
    if (resolved.openers.has(trimmed)) {
      openerStack.push(token)
    }
    else if (resolved.closers.has(trimmed)) {
      const expectedOpener = resolved.closerToOpener.get(trimmed)
      const opener = openerStack.findLast(t => t.content.trim() === expectedOpener)
      if (opener) {
        while (openerStack.at(-1) !== opener) {
          const unexpected = openerStack.pop()
          if (unexpected) {
            assignColorToToken(
              unexpected,
              resolved.themes,
              shikiOptions,
              -1,
            )
          }
        }
        openerStack.pop()
        assignColorToToken(
          token,
          resolved.themes,
          shikiOptions,
          openerStack.length,
        )
        assignColorToToken(
          opener,
          resolved.themes,
          shikiOptions,
          openerStack.length,
        )
      }
      else {
        assignColorToToken(token, resolved.themes, shikiOptions, -1)
      }
    }
  }

  if (openerStack.length) {
    const fallback = getIndexedConfig(config, lang)
    for (const token of openerStack) {
      assignColorToToken(
        token,
        fallback.themes,
        shikiOptions,
        -1,
      )
    }
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
    return colors.at(-1)!
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
