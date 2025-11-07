import type { ShikiInternal, ThemeRegistrationResolved } from '@shikijs/types'
import type monacoNs from 'monaco-editor-core'
import type { MonacoLineToken } from './types'
import { EncodedTokenMetadata, FontStyle, INITIAL } from '@shikijs/vscode-textmate'
import { TokenizerState } from './tokenizer'
import { normalizeColor } from './utils'

export interface MonacoTheme extends monacoNs.editor.IStandaloneThemeData { }

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
  let rules = 'rules' in theme
    ? theme.rules as MonacoTheme['rules']
    : undefined

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
    Object.entries(theme.colors || {})
      .map(([key, value]) => [key, `#${normalizeColor(value)}`]),
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
    monaco.editor.defineTheme(themeId, monacoTheme)
  }

  const colorMap: string[] = []
  const colorToScopeMap = new Map<string, string>()
  const colorAndStyleToScopeMap = new Map<string, string>()

  // Because Monaco does not have the API of reading the current theme,
  // We hijack it here to keep track of the current theme.
  const _setTheme = monaco.editor.setTheme.bind(monaco.editor)
  monaco.editor.setTheme = (themeName: string) => {
    const ret = highlighter.setTheme(themeName)
    const theme = themeMap.get(themeName)
    colorMap.length = ret.colorMap.length
    ret.colorMap.forEach((color, i) => {
      colorMap[i] = color
    })
    colorToScopeMap.clear()
    theme?.rules.forEach((rule) => {
      const c = normalizeColor(rule.foreground)
      if (!c)
        return

      const normalizedStyle = normalizeFontStyleString(rule.fontStyle)

      if (normalizedStyle) {
        const key = makeColorAndStyleKey(c, normalizedStyle)
        if (!colorAndStyleToScopeMap.has(key))
          colorAndStyleToScopeMap.set(key, rule.token)
      }

      if (!colorToScopeMap.has(c))
        colorToScopeMap.set(c, rule.token)
    })
    _setTheme(themeName)
  }

  // Set the first theme as the default theme
  monaco.editor.setTheme(themeIds[0])

  function findScopeByColorAndStyle(color: string, fontStyle: FontStyle): string | undefined {
    const normalizedStyle = normalizeFontStyleBits(fontStyle)
    if (normalizedStyle) {
      const key = makeColorAndStyleKey(color, normalizedStyle)
      const scoped = colorAndStyleToScopeMap.get(key)
      if (scoped)
        return scoped
    }
    return colorToScopeMap.get(color)
  }

  // Do not attempt to tokenize if a line is too long
  // default to 20000 (as in monaco-editor-core defaults)
  const {
    tokenizeMaxLineLength = 20000,
    tokenizeTimeLimit = 500,
  } = options

  const monacoLanguageIds = new Set(monaco.languages.getLanguages().map(l => l.id))

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
          const result = grammar.tokenizeLine2(line, state.ruleStack, tokenizeTimeLimit)

          if (result.stoppedEarly)
            console.warn(`Time limit reached when tokenizing line: ${line.substring(0, 100)}`)

          const tokensLength = result.tokens.length / 2
          const tokens: MonacoLineToken[] = []

          for (let j = 0; j < tokensLength; j++) {
            const startIndex = result.tokens[2 * j]
            const metadata = result.tokens[2 * j + 1]
            const color = normalizeColor(colorMap[EncodedTokenMetadata.getForeground(metadata)] || '')
            const fontStyle = EncodedTokenMetadata.getFontStyle(metadata)

            // Because Monaco only support one scope per token,
            // we workaround this to use color (and font style when available) to trace back the scope
            const scope = color ? (findScopeByColorAndStyle(color, fontStyle) || '') : ''
            tokens.push({ startIndex, scopes: scope })
          }

          return { endState: new TokenizerState(result.ruleStack), tokens }
        },
      })
    }
  }
}

function normalizeFontStyleBits(fontStyle: FontStyle): string {
  if (fontStyle <= FontStyle.None)
    return ''

  const styles: string[] = []

  if (fontStyle & FontStyle.Italic)
    styles.push('italic')
  if (fontStyle & FontStyle.Bold)
    styles.push('bold')
  if (fontStyle & FontStyle.Underline)
    styles.push('underline')
  if (fontStyle & FontStyle.Strikethrough)
    styles.push('strikethrough')

  return styles.join(' ')
}

function normalizeFontStyleString(fontStyle?: string): string {
  if (!fontStyle)
    return ''

  const styles = new Set(
    fontStyle
      .split(/[\s,]+/)
      .map(style => style.trim().toLowerCase())
      .filter(Boolean),
  )

  styles.delete('')
  styles.delete('normal')
  styles.delete('none')

  const ordered: string[] = []
  if (styles.has('italic'))
    ordered.push('italic')
  if (styles.has('bold'))
    ordered.push('bold')
  if (styles.has('underline'))
    ordered.push('underline')
  if (styles.has('strikethrough') || styles.has('line-through'))
    ordered.push('strikethrough')

  return ordered.join(' ')
}

function makeColorAndStyleKey(color: string, style: string): string {
  return `${color}|${style}`
}
