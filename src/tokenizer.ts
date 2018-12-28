import { IEmbeddedLanguagesMap, IGrammar } from 'vscode-textmate'
import { ThemeData } from './themes'
import { tokenizeWithTheme } from './themedTokenizer'

export class ThemeTokenizer {
  constructor(
    private themeData: ThemeData,
    private initialScopeName: string,
    private initialLanguage: number,
    private embeddedLanguages: IEmbeddedLanguagesMap
  ) {}

  public loadGrammarAsync() {
    return this.themeData.registry.loadGrammarWithEmbeddedLanguages(
      this.initialScopeName,
      this.initialLanguage,
      this.embeddedLanguages
    )
  }

  public tokenizeWithTheme(contents: string, grammar: IGrammar) {
    return tokenizeWithTheme(
      this.themeData.theme,
      this.themeData.registry.getColorMap(),
      contents,
      grammar
    )
  }
}
