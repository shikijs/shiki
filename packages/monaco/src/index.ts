import type * as monaco from 'monaco-editor-core'
import type { ShikiInternal, ThemeRegistrationResolved } from '@shikijs/core'
import type { StateStack } from '@shikijs/core/textmate'
import { INITIAL, StackElementMetadata } from '@shikijs/core/textmate'

type Monaco = typeof monaco

export interface MonacoInferface {
  editor: Monaco['editor']
  languages: Monaco['languages']
}

export interface MonacoTheme extends monaco.editor.IStandaloneThemeData { }

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
            foreground: settings.foreground.replace('#', ''),
          })
        }
      }
    }
  }

  return {
    base: theme.type === 'light' ? 'vs' : 'vs-dark',
    inherit: false,
    colors: theme.colors || {},
    rules,
  }
}

export function shikiToMonaco(
  highlighter: ShikiInternal<any, any>,
  monaco: MonacoInferface,
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

  let currentTheme = themeIds[0]

  // Because Monaco does not have the API of reading the current theme,
  // We hijack it here to keep track of the current theme.
  const _setTheme = monaco.editor.setTheme.bind(monaco.editor)
  monaco.editor.setTheme = (theme: string) => {
    _setTheme(theme)
    currentTheme = theme
  }

  for (const lang of highlighter.getLoadedLanguages()) {
    if (monaco.languages.getLanguages().some(l => l.id === lang)) {
      monaco.languages.setTokensProvider(lang, {
        getInitialState() {
          return new TokenizerState(INITIAL, highlighter)
        },
        tokenize(line, state: TokenizerState) {
          // Do not attempt to tokenize if a line is too long
          // default to 20000 (as in monaco-editor-core defaults)
          const maxTokenizationLineLength = 20000
          if (line.length >= maxTokenizationLineLength) {
            return {
              endState: state,
              tokens: [{ startIndex: 0, scopes: '' }],
            }
          }

          const grammar = state.highlighter.getLanguage(lang)
          const { colorMap } = state.highlighter.setTheme(currentTheme)
          const theme = themeMap.get(currentTheme)
          const result = grammar.tokenizeLine2(line, state.ruleStack, 500)

          if (result.stoppedEarly)
            console.warn(`Time limit reached when tokenizing line: ${line.substring(0, 100)}`)

          const colorToScopeMap = new Map<string, string>()

          theme!.rules.forEach((rule) => {
            const c = rule.foreground?.replace('#', '').toLowerCase()
            if (c && !colorToScopeMap.has(c))
              colorToScopeMap.set(c, rule.token)
          })

          function findScopeByColor(color: string) {
            return colorToScopeMap.get(color)
          }

          const tokensLength = result.tokens.length / 2
          const tokens: any[] = []
          for (let j = 0; j < tokensLength; j++) {
            const startIndex = result.tokens[2 * j]
            const metadata = result.tokens[2 * j + 1]
            const color = (colorMap[StackElementMetadata.getForeground(metadata)] || '').replace('#', '').toLowerCase()
            // Because Monaco only support one scope per token,
            // we workaround this to use color to trace back the scope
            const scope = findScopeByColor(color) || ''
            tokens.push({
              startIndex,
              scopes: scope,
            })
          }

          return {
            endState: new TokenizerState(result.ruleStack, state.highlighter),
            tokens,
          }
        },
      })
    }
  }
}

class TokenizerState implements monaco.languages.IState {
  constructor(
    private _ruleStack: StateStack,
    public highlighter: ShikiInternal<any, any>,
  ) { }

  public get ruleStack(): StateStack {
    return this._ruleStack
  }

  public clone(): TokenizerState {
    return new TokenizerState(this._ruleStack, this.highlighter)
  }

  public equals(other: monaco.languages.IState): boolean {
    if (!other
      || !(other instanceof TokenizerState)
      || other !== this
      || other._ruleStack !== this._ruleStack
    )
      return false

    return true
  }
}
