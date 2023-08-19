import type { IGrammar, IGrammarConfiguration } from 'vscode-textmate'
import { Registry as TextMateRegistry } from 'vscode-textmate'
import type { LanguageRegistration, ThemeRegistration, ThemeRegistrationRaw } from '../types'
import type { Resolver } from './resolver'
import { toShikiTheme } from './normalize'

export class Registry extends TextMateRegistry {
  public themesPath: string = 'themes/'

  private _resolvedThemes: Record<string, ThemeRegistration> = {}
  private _resolvedGrammars: Record<string, IGrammar> = {}
  private _langMap: Record<string, LanguageRegistration> = {}
  private _langGraph: Map<string, LanguageRegistration> = new Map()

  constructor(
    private _resolver: Resolver,
    public _themes: (ThemeRegistration | ThemeRegistrationRaw)[],
    public _langs: LanguageRegistration[],
  ) {
    super(_resolver)

    _themes.forEach(t => this.loadTheme(t))
    _langs.forEach(l => this.loadLanguage(l))
  }

  public getTheme(theme: ThemeRegistration | string) {
    if (typeof theme === 'string')
      return this._resolvedThemes[theme]
    else
      return theme
  }

  public loadTheme(theme: ThemeRegistration | ThemeRegistrationRaw) {
    const _theme = toShikiTheme(theme)
    if (_theme.name)
      this._resolvedThemes[_theme.name] = _theme
    return theme
  }

  public getLoadedThemes() {
    return Object.keys(this._resolvedThemes) as string[]
  }

  public getGrammar(name: string) {
    return this._resolvedGrammars[name]
  }

  public async loadLanguage(lang: LanguageRegistration) {
    if (this._resolvedGrammars[lang.name])
      return

    this._resolver.addLanguage(lang)
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

  async init() {
    this._themes.map(t => this.loadTheme(t))
    await this.loadLanguages(this._langs)
  }

  public async loadLanguages(langs: LanguageRegistration[]) {
    for (const lang of langs)
      this.resolveEmbeddedLanguages(lang)

    const langsGraphArray = Array.from(this._langGraph.entries())

    const missingLangs = langsGraphArray.filter(([_, lang]) => !lang)
    if (missingLangs.length) {
      const dependents = langsGraphArray
        .filter(([_, lang]) => lang && lang.embeddedLangs?.some(l => missingLangs.map(([name]) => name).includes(l)))
        .filter(lang => !missingLangs.includes(lang))
      throw new Error(`[shikiji] Missing languages ${missingLangs.map(([name]) => `\`${name}\``).join(', ')}, required by ${dependents.map(([name]) => `\`${name}\``).join(', ')}`)
    }

    for (const [_, lang] of langsGraphArray)
      this._resolver.addLanguage(lang)

    for (const [_, lang] of langsGraphArray)
      await this.loadLanguage(lang)
  }

  public getLoadedLanguages() {
    return Object.keys(this._resolvedGrammars) as string[]
  }

  private resolveEmbeddedLanguages(lang: LanguageRegistration) {
    this._langMap[lang.name] = lang
    this._langGraph.set(lang.name, lang)
    if (lang.embeddedLangs) {
      for (const embeddedLang of lang.embeddedLangs)
        this._langGraph.set(embeddedLang, this._langMap[embeddedLang])
    }
  }
}
