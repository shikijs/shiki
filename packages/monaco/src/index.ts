import type { ShikiPrimitive, ThemeRegistrationResolved } from '@shikijs/types'
import type * as monacoNs from 'monaco-editor-core'
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
      if (!foreground && !background && !fontStyle)
        continue
      const scopes = Array.isArray(scope) ? scope : scope ? [scope] : []

      const normalizedFontStyle = normalizeFontStyleString(fontStyle)
      const normalizedForeground = normalizeColor(foreground)
      const normalizedBackground = normalizeColor(background)

      rules.push(...scopes.map(s => ({
        token: s,
        foreground: normalizedForeground,
        background: normalizedBackground,
        fontStyle: normalizedFontStyle,
      })))
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
  highlighter: ShikiPrimitive<any, any>,
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
  const colorStyleToScopeMap = new Map<string, string>()

  // Because Monaco does not have the API of reading the current theme,
  // We hijack it here to keep track of the current theme.
  const _setTheme = monaco.editor.setTheme.bind(monaco.editor)
  monaco.editor.setTheme = (themeName: string) => {
    const ret = highlighter.setTheme(themeName)
    const theme = themeMap.get(themeName)
    colorMap.length = ret.colorMap.length
    for (let i = 0; i < ret.colorMap.length; i++) {
      colorMap[i] = ret.colorMap[i]
    }
    colorStyleToScopeMap.clear()
    theme?.rules.forEach((rule) => {
      const c = normalizeColor(rule.foreground)
      if (!c)
        return

      const key = getColorStyleKey(c, normalizeFontStyleString(rule.fontStyle))
      if (!colorStyleToScopeMap.has(key))
        colorStyleToScopeMap.set(key, rule.token)
    })
    _setTheme(themeName)
  }

  const _create = monaco.editor.create
  monaco.editor.create = (element: HTMLElement, options?: monacoNs.editor.IStandaloneEditorConstructionOptions, override?: monacoNs.editor.IEditorOverrideServices) => {
    if (options?.theme) {
      monaco.editor.setTheme(options.theme)
    }
    return _create(element, options, override)
  }

  // Set the first theme as the default theme
  monaco.editor.setTheme(themeIds[0])

  function findScopeByColorAndStyle(color: string, fontStyle: FontStyle): string | undefined {
    const key = getColorStyleKey(color, normalizeFontStyleBits(fontStyle))
    return colorStyleToScopeMap.get(key)
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
            const colorIdx = EncodedTokenMetadata.getForeground(metadata)
            const color = normalizeColor(colorMap[colorIdx] || '')
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

const VALID_FONT_STYLES = [
  'italic',
  'bold',
  'underline',
  'strikethrough',
] as const

const VALID_FONT_ALIASES: Record<string, typeof VALID_FONT_STYLES[number]> = {
  'line-through': 'strikethrough',
}

function normalizeFontStyleString(fontStyle?: string): string {
  if (!fontStyle)
    return ''

  const styles = new Set(
    fontStyle
      .split(/[\s,]+/)
      .map(style => style.trim().toLowerCase())
      .map(style => VALID_FONT_ALIASES[style] || style)
      .filter(Boolean),
  )

  return VALID_FONT_STYLES
    .filter(style => styles.has(style))
    .join(' ')
}

function getColorStyleKey(color: string, fontStyle: string): string {
  if (!fontStyle)
    return color
  return `${color}|${fontStyle}`
}
