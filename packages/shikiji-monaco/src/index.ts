import type * as monaco from 'monaco-editor-core'
import type { HighlighterGeneric, ShikiInternal } from 'shikiji-core'
import type { StateStack } from 'shikiji-core/textmate'
import { INITIAL, StackElementMetadata } from 'shikiji-core/textmate'

type Monaco = typeof monaco
type AcceptableShiki = HighlighterGeneric<any, any> | ShikiInternal

export interface MonacoInferface {
  editor: Monaco['editor']
  languages: Monaco['languages']
}

export interface HighlighterInterface {
  getLoadedThemes: AcceptableShiki['getLoadedThemes']
  getTheme: AcceptableShiki['getTheme']
  getLoadedLanguages: AcceptableShiki['getLoadedLanguages']
  getLangGrammar: AcceptableShiki['getLangGrammar']
  setTheme: AcceptableShiki['setTheme']
}

export function shikijiToMonaco(
  highlighter: HighlighterInterface,
  monaco: MonacoInferface,
) {
  const themes = highlighter.getLoadedThemes()
  for (const theme of themes)
    monaco.editor.defineTheme(theme, highlighter.getTheme(theme) as any)

  let currentTheme = themes[0]

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
          const grammar = state.highlighter.getLangGrammar(lang)
          const { theme, colorMap } = state.highlighter.setTheme(currentTheme)
          const result = grammar.tokenizeLine2(line, state.ruleStack)

          const colorToScopeMap = new Map<string, string>()

          // @ts-expect-error - 'rules' is presented on resolved theme
          theme?.rules.forEach((rule) => {
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
    public highlighter: HighlighterInterface,
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
