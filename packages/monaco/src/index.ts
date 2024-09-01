import type monacoNs from 'monaco-editor-core'
import type { ShikiInternal, ThemeRegistrationResolved } from '@shikijs/core'
import type { StateStack } from '@shikijs/vscode-textmate'
import { EncodedTokenMetadata, INITIAL } from '@shikijs/vscode-textmate'

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
  let rules = 'rules' in theme
    ? theme.rules as MonacoTheme['rules']
    : undefined

  if (!rules) {
    rules = []
    const themeSettings = theme.settings || theme.tokenColors
    for (const { scope, settings } of themeSettings) {
      const scopes = Array.isArray(scope) ? scope : [scope]
      for (const s of scopes) {
        if (settings.foreground && s) {
          rules.push({
            token: s,
            foreground: normalizeColor(settings.foreground),
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
) {
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
      if (c && !colorToScopeMap.has(c))
        colorToScopeMap.set(c, rule.token)
    })
    _setTheme(themeName)
  }

  // Set the first theme as the default theme
  monaco.editor.setTheme(themeIds[0])

  function findScopeByColor(color: string) {
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
        tokenize(line, state: TokenizerState) {
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
          const tokens: any[] = []
          for (let j = 0; j < tokensLength; j++) {
            const startIndex = result.tokens[2 * j]
            const metadata = result.tokens[2 * j + 1]
            const color = normalizeColor(colorMap[EncodedTokenMetadata.getForeground(metadata)] || '')
            // Because Monaco only support one scope per token,
            // we workaround this to use color to trace back the scope
            const scope = findScopeByColor(color) || ''
            tokens.push({ startIndex, scopes: scope })
          }

          return { endState: new TokenizerState(result.ruleStack), tokens }
        },
      })
    }
  }
}

class TokenizerState implements monacoNs.languages.IState {
  constructor(
    private _ruleStack: StateStack,
  ) {}

  public get ruleStack(): StateStack {
    return this._ruleStack
  }

  public clone(): TokenizerState {
    return new TokenizerState(this._ruleStack)
  }

  public equals(other: monacoNs.languages.IState): boolean {
    if (
      !other
      || !(other instanceof TokenizerState)
      || other !== this
      || other._ruleStack !== this._ruleStack
    ) {
      return false
    }

    return true
  }
}

function normalizeColor(color: undefined): undefined
function normalizeColor(color: string): string
function normalizeColor(color: string | undefined): string | undefined
function normalizeColor(color: string | undefined) {
  if (!color)
    return color

  color = (color.charCodeAt(0) === 35 ? color.slice(1) : color).toLowerCase()

  // #RGB => #RRGGBB - Monaco does not support hex color with 3 or 4 digits
  if (color.length === 3 || color.length === 4)
    color = color.split('').map(c => c + c).join('')

  return color
}
