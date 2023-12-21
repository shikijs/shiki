import type { IGrammar, IGrammarConfiguration } from './textmate'
import { Registry as TextMateRegistry } from './textmate'
import type { LanguageRegistration, ThemeRegistration, ThemeRegistrationRaw } from './types'
import type { Resolver } from './resolver'
import { toShikiTheme } from './normalize'

export class Registry extends TextMateRegistry {
  public themesPath: string = 'themes/'

  private _resolvedThemes: Record<string, ThemeRegistration> = {}
  private _resolvedGrammars: Record<string, IGrammar> = {}
  private _langMap: Record<string, LanguageRegistration> = {}
  private _langGraph: Map<string, LanguageRegistration> = new Map()

  alias: Record<string, string> = {}

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
      return this.loadTheme(theme)
  }

  public loadTheme(theme: ThemeRegistration | ThemeRegistrationRaw): ThemeRegistration {
    const _theme = toShikiTheme(theme)
    if (_theme.name)
      this._resolvedThemes[_theme.name] = _theme
    return _theme
  }

  public getLoadedThemes() {
    return Object.keys(this._resolvedThemes) as string[]
  }

  public getGrammar(name: string) {
    if (this.alias[name]) {
      const resolved = new Set<string>([name])
      while (this.alias[name]) {
        name = this.alias[name]
        if (resolved.has(name))
          throw new Error(`[shikiji] Circular alias \`${Array.from(resolved).join(' -> ')} -> ${name}\``)
        resolved.add(name)
      }
    }
    return this._resolvedGrammars[name]
  }

  public async loadLanguage(lang: LanguageRegistration) {
    if (this.getGrammar(lang.name))
      return

    const embeddedLazilyBy = new Set(Object.values(this._langMap).filter(i => i.embeddedLangsLazy?.includes(lang.name)))

    this._resolver.addLanguage(lang)

    const grammarConfig: IGrammarConfiguration = {
      balancedBracketSelectors: lang.balancedBracketSelectors || ['*'],
      unbalancedBracketSelectors: lang.unbalancedBracketSelectors || [],
    }

    // @ts-expect-error Private members, set this to override the previous grammar (that can be a stub)
    this._syncRegistry._rawGrammars.set(lang.scopeName, lang)
    const g = await this.loadGrammarWithConfiguration(lang.scopeName, 1, grammarConfig)
    this._resolvedGrammars[lang.name] = g!
    if (lang.aliases) {
      lang.aliases.forEach((alias) => {
        this.alias[alias] = lang.name
      })
    }

    // If there is a language that embeds this language lazily, we need to reload it
    if (embeddedLazilyBy.size) {
      for (const e of embeddedLazilyBy) {
        delete this._resolvedGrammars[e.name]
        // @ts-expect-error clear cache
        this._syncRegistry?._injectionGrammars?.delete(e.scopeName)
        // @ts-expect-error clear cache
        this._syncRegistry?._grammars?.delete(e.scopeName)
        await this.loadLanguage(this._langMap[e.name])
      }
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
    return Object.keys({ ...this._resolvedGrammars, ...this.alias }) as string[]
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
