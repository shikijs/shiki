import { IGrammar, IGrammarConfiguration, Registry as TextMateRegistry } from 'vscode-textmate'
import { IShikiTheme, IThemeRegistration, ILanguageRegistration } from './types'
import { fetchTheme, toShikiTheme } from './loader'
import { Theme } from './themes'
import { Resolver } from './resolver'
import { Lang } from './languages'

export class Registry extends TextMateRegistry {
  public themesPath: string = 'themes/'

  private _resolvedThemes: Record<string, IShikiTheme> = {}
  private _resolvedGrammars: Record<string, IGrammar> = {}

  constructor(private _resolver: Resolver) {
    super(_resolver)
  }

  public getTheme(theme: Theme | IShikiTheme | string) {
    if (typeof theme === 'string') {
      return this._resolvedThemes[theme]
    } else {
      return theme
    }
  }

  public async loadTheme(theme: Theme | IShikiTheme | string) {
    if (typeof theme === 'string') {
      if (!this._resolvedThemes[theme]) {
        this._resolvedThemes[theme] = await fetchTheme(`${this.themesPath}${theme}.json`)
      }
      return this._resolvedThemes[theme]
    } else {
      theme = toShikiTheme(theme)
      if (theme.name) {
        this._resolvedThemes[theme.name] = theme
      }
      return theme
    }
  }

  public async loadThemes(themes: IThemeRegistration[]) {
    return await Promise.all(themes.map(theme => this.loadTheme(theme)))
  }

  public getLoadedThemes() {
    return Object.keys(this._resolvedThemes) as Theme[]
  }

  public getGrammar(name: string) {
    return this._resolvedGrammars[name]
  }

  public async loadLanguage(lang: ILanguageRegistration) {
    const embeddedLanguages = lang.embeddedLangs?.reduce(async (acc, l, idx) => {
      if (!this.getLoadedLanguages().includes(l) && this._resolver.getLangRegistration(l)) {
        await this._resolver.loadGrammar(this._resolver.getLangRegistration(l).scopeName)
        acc[this._resolver.getLangRegistration(l).scopeName] = idx + 2
        return acc
      }
    }, {})

    const grammarConfig: IGrammarConfiguration = {
      embeddedLanguages,
      balancedBracketSelectors: lang.balancedBracketSelectors || ['*'],
      unbalancedBracketSelectors: lang.unbalancedBracketSelectors || []
    }

    const g = await this.loadGrammarWithConfiguration(lang.scopeName, 1, grammarConfig)
    this._resolvedGrammars[lang.id] = g
    if (lang.aliases) {
      lang.aliases.forEach(la => {
        this._resolvedGrammars[la] = g
      })
    }
  }

  public async loadLanguages(langs: ILanguageRegistration[]) {
    for (const lang of langs) {
      this._resolver.addLanguage(lang)
    }
    for (const lang of langs) {
      await this.loadLanguage(lang)
    }
  }

  public getLoadedLanguages() {
    return Object.keys(this._resolvedGrammars) as Lang[]
  }
}
