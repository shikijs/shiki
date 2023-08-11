import type { IGrammar, IGrammarConfiguration } from 'vscode-textmate'
import { Registry as TextMateRegistry } from 'vscode-textmate'
import type { LanguageRegistration, ThemeRegisteration } from './types'
import type { Resolver } from './resolver'

export class Registry extends TextMateRegistry {
  public themesPath: string = 'themes/'

  private _resolvedThemes: Record<string, ThemeRegisteration> = {}
  private _resolvedGrammars: Record<string, IGrammar> = {}
  private _langMap: Record<string, LanguageRegistration> = {}
  private _langGraph: Map<string, LanguageRegistration> = new Map()

  constructor(
    private _resolver: Resolver,
    public _themes: ThemeRegisteration[],
    public _langs: LanguageRegistration[],
  ) {
    super(_resolver)

    this._resolvedThemes = Object.fromEntries(
      _themes.map(i => [i.name, i]),
    )
    this._langMap = Object.fromEntries(
      _langs.map(i => [i.name, i]),
    )
  }

  public getTheme(theme: ThemeRegisteration | string) {
    if (typeof theme === 'string')
      return this._resolvedThemes[theme]
    else
      return theme
  }

  public getLoadedThemes() {
    return Object.keys(this._resolvedThemes) as string[]
  }

  public getGrammar(name: string) {
    return this._resolvedGrammars[name]
  }

  public async loadLanguage(lang: LanguageRegistration) {
    const embeddedLanguages = lang.embeddedLangs?.reduce(async (acc, l, idx) => {
      if (!this.getLoadedLanguages().includes(l) && this._resolver.getLangRegistration(l)) {
        await this._resolver.loadGrammar(this._resolver.getLangRegistration(l).scopeName)
        acc[this._resolver.getLangRegistration(l).scopeName] = idx + 2
        return acc
      }
    }, {} as any)

    const grammarConfig: IGrammarConfiguration = {
      embeddedLanguages,
      balancedBracketSelectors: lang.balancedBracketSelectors || ['*'],
      unbalancedBracketSelectors: lang.unbalancedBracketSelectors || [],
    }

    const g = await this.loadGrammarWithConfiguration(lang.scopeName, 1, grammarConfig)
    this._resolvedGrammars[lang.name] = g!
    if (lang.aliases) {
      lang.aliases.forEach((la) => {
        this._resolvedGrammars[la] = g!
      })
    }
  }

  public async loadLanguages(langs: LanguageRegistration[]) {
    for (const lang of langs)
      this.resolveEmbeddedLanguages(lang)

    const langsGraphArray = Array.from(this._langGraph.values())

    for (const lang of langsGraphArray)
      this._resolver.addLanguage(lang)

    for (const lang of langsGraphArray)
      await this.loadLanguage(lang)
  }

  public getLoadedLanguages() {
    return Object.keys(this._resolvedGrammars) as string[]
  }

  private resolveEmbeddedLanguages(lang: LanguageRegistration) {
    if (!this._langGraph.has(lang.name))
      this._langGraph.set(lang.name, lang)

    if (lang.embeddedLangs) {
      for (const embeddedLang of lang.embeddedLangs)
        this._langGraph.set(embeddedLang, this._langMap[embeddedLang])
    }
  }
}
