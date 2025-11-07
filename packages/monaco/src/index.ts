import type { ShikiInternal, ThemeRegistrationResolved } from '@shikijs/types'
import type monacoNs from 'monaco-editor-core'
import type { MonacoLineToken } from './types'
import { EncodedTokenMetadata, FontStyle, INITIAL } from '@shikijs/vscode-textmate'
import { TokenizerState } from './tokenizer'
import { normalizeColor } from './utils'

export interface MonacoTheme extends monacoNs.editor.IStandaloneThemeData {}

export interface ShikiToMonacoOptions {
  /**
   * The maximum length of a line to tokenize.
   *
   * @default 20000
   */
  tokenizeMaxLineLength?: number
  /**
   * The time limit in milliseconds for tokenizing a line.
   *
   * @default 500
   */
  tokenizeTimeLimit?: number
}

export function textmateThemeToMonacoTheme(theme: ThemeRegistrationResolved): MonacoTheme {
  let rules
    = 'rules' in theme ? (theme.rules as MonacoTheme['rules']) : undefined

  if (!rules) {
    rules = []
    const themeSettings = theme.settings || theme.tokenColors

    for (const { scope, settings: { foreground, background, fontStyle } = {} } of themeSettings) {
      const scopes = Array.isArray(scope) ? scope : [scope]

      for (const s of scopes) {
        if (s && (foreground || background || fontStyle)) {
          rules.push({
            token: s,
            foreground: normalizeColor(foreground),
            background: normalizeColor(background),
            fontStyle,
          })
        }
      }
    }
  }

  const colors = Object.fromEntries(
    Object.entries(theme.colors || {}).map(([key, value]) => [
      key,
      `#${normalizeColor(value)}`,
    ]),
  )

  return {
    base: theme.type === 'light' ? 'vs' : 'vs-dark',
    inherit: false,
    colors,
    rules,
  }
}

export function shikiToMonaco(
  highlighter: ShikiInternal<any, any>,
  monaco: typeof monacoNs,
  options: ShikiToMonacoOptions = {},
): void {
  // Convert themes to Monaco themes and register them
  const themeMap = new Map<string, MonacoTheme>()
  const themeIds = highlighter.getLoadedThemes()

  for (const themeId of themeIds) {
    const tmTheme = highlighter.getTheme(themeId)
    const monacoTheme = textmateThemeToMonacoTheme(tmTheme)
    themeMap.set(themeId, monacoTheme)
    monaco.editor.defineTheme(themeId, {
      base: monacoTheme.base,
      inherit: true,
      colors: monacoTheme.colors,
      rules: monacoTheme.rules,
      encodedTokensColors: [],
    })
  }

  const colorMap: string[] = []
  const colorToScopeMap = new Map<string, string>()
  const styleKeyToScopeMap = new Map<string, string>()

  function parseFontStyleToMask(fontStyle?: string): number {
    if (!fontStyle)
      return 0
    let mask = 0
    const parts = fontStyle.split(/\s+/).filter(Boolean)
    for (const p of parts) {
      if (p === 'bold')
        mask |= FontStyle.Bold
      else if (p === 'italic')
        mask |= FontStyle.Italic
      else if (p === 'underline')
        mask |= FontStyle.Underline
      else if (p === 'strikethrough')
        mask |= FontStyle.Strikethrough
    }
    return mask
  }

  // Because Monaco does not have the API of reading the current theme,
  // we hijack it here to keep track of the current theme.
  const _setTheme = monaco.editor.setTheme.bind(monaco.editor)
  monaco.editor.setTheme = (themeName: string) => {
    const ret = highlighter.setTheme(themeName)
    const theme = themeMap.get(themeName)
    colorMap.length = ret.colorMap.length
    ret.colorMap.forEach((color, i) => {
      colorMap[i] = color
    })
    colorToScopeMap.clear()
    styleKeyToScopeMap.clear()

    theme?.rules.forEach((rule) => {
      const c = normalizeColor(rule.foreground)
      const mask = parseFontStyleToMask(rule.fontStyle as any)

      if (c) {
        // Map color-only for backward compatibility
        if (!colorToScopeMap.has(c))
          colorToScopeMap.set(c, rule.token)
        // Map color + fontStyle for better fidelity (bold/italic/etc.)
        const key = `${c}|${mask}`
        if (!styleKeyToScopeMap.has(key))
          styleKeyToScopeMap.set(key, rule.token)
      }
      else if (mask) {
        // Some theme rules specify only fontStyle without foreground
        // We still record them to allow matching by style when colors collide
        const key = `|${mask}`
        if (!styleKeyToScopeMap.has(key))
          styleKeyToScopeMap.set(key, rule.token)
      }
    })
    _setTheme(themeName)
  }

  // Set the first theme as the default theme
  monaco.editor.setTheme(themeIds[0])

  function findScopeByColorAndStyle(
    color: string,
    fontStyleMask: number,
  ): string | undefined {
    // Prefer exact color+style match
    const exact = styleKeyToScopeMap.get(`${color}|${fontStyleMask}`)
    if (exact)
      return exact
    // Fallback to color-only
    const byColor = colorToScopeMap.get(color)
    if (byColor)
      return byColor
    // Fallback to style-only (rare: when theme sets only fontStyle)
    const byStyle = styleKeyToScopeMap.get(`|${fontStyleMask}`)
    return byStyle
  }

  // Do not attempt to tokenize if a line is too long
  // default to 20000 (as in monaco-editor-core defaults)
  const {
    tokenizeMaxLineLength = 20000,
    tokenizeTimeLimit = 500,
  } = options

  const monacoLanguageIds = new Set(
    monaco.languages.getLanguages().map(l => l.id),
  )

  for (const lang of highlighter.getLoadedLanguages()) {
    if (monacoLanguageIds.has(lang)) {
      monaco.languages.setTokensProvider(lang, {
        getInitialState() {
          return new TokenizerState(INITIAL)
        },

        tokenize(line: string, state: TokenizerState) {
          if (line.length >= tokenizeMaxLineLength) {
            return {
              endState: state,
              tokens: [{ startIndex: 0, scopes: '' }],
            }
          }

          const grammar = highlighter.getLanguage(lang)
          const result = grammar.tokenizeLine2(
            line,
            state.ruleStack,
            tokenizeTimeLimit,
          )

          if (result.stoppedEarly) {
            console.warn(
              `Time limit reached when tokenizing line: ${line.substring(
                0,
                100,
              )}`,
            )
          }

          const tokensLength = result.tokens.length / 2
          const tokens: MonacoLineToken[] = []

          for (let j = 0; j < tokensLength; j++) {
            const startIndex = result.tokens[2 * j]
            const metadata = result.tokens[2 * j + 1]
            const color = normalizeColor(
              colorMap[EncodedTokenMetadata.getForeground(metadata)] || '',
            )
            const fontStyleMask = EncodedTokenMetadata.getFontStyle(metadata)

            // Because Monaco only supports one scope per token,
            // we workaround this by using color and style to trace back the scope
            const scope
              = findScopeByColorAndStyle(color, fontStyleMask) || ''
            tokens.push({ startIndex, scopes: scope })
          }

          return { endState: new TokenizerState(result.ruleStack), tokens }
        },
      })
    }
  }
}
