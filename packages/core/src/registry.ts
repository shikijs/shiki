import type { IGrammarConfiguration, IRawTheme } from './textmate'
import { Registry as TextMateRegistry, Theme as TextMateTheme } from './textmate'
import type { Grammar, LanguageRegistration, ThemeRegistrationAny, ThemeRegistrationResolved } from './types'
import type { Resolver } from './resolver'
import { normalizeTheme } from './normalize'
import { ShikiError } from './error'

export class Registry extends TextMateRegistry {
  private _resolvedThemes: Map<string, ThemeRegistrationResolved> = new Map()
  private _resolvedGrammars: Map<string, Grammar> = new Map()
  private _langMap: Map<string, LanguageRegistration> = new Map()
  private _langGraph: Map<string, LanguageRegistration> = new Map()

  private _textmateThemeCache = new WeakMap<IRawTheme, TextMateTheme>()
  private _loadedThemesCache: string[] | null = null
  private _loadedLanguagesCache: string[] | null = null

  constructor(
    private _resolver: Resolver,
    private _themes: ThemeRegistrationResolved[],
    private _langs: LanguageRegistration[],
    private _alias: Record<string, string> = {},
  ) {
    super(_resolver)

    _themes.forEach(t => this.loadTheme(t))
    _langs.forEach(l => this.loadLanguage(l))
  }

  public getTheme(theme: ThemeRegistrationAny | string) {
    if (typeof theme === 'string')
      return this._resolvedThemes.get(theme)
    else
      return this.loadTheme(theme)
  }

  public loadTheme(theme: ThemeRegistrationAny): ThemeRegistrationResolved {
    const _theme = normalizeTheme(theme)
    if (_theme.name) {
      this._resolvedThemes.set(_theme.name, _theme)
      // Reset cache
      this._loadedThemesCache = null
    }
    return _theme
  }

  public getLoadedThemes() {
    if (!this._loadedThemesCache)
      this._loadedThemesCache = [...this._resolvedThemes.keys()]
    return this._loadedThemesCache
  }

  // Override and re-implement this method to cache the textmate themes as `TextMateTheme.createFromRawTheme`
  // is expensive. Themes can switch often especially for dual-theme support.
  //
  // The parent class also accepts `colorMap` as the second parameter, but since we don't use that,
  // we omit here so it's easier to cache the themes.
  public override setTheme(theme: IRawTheme): void {
    let textmateTheme = this._textmateThemeCache.get(theme)
    if (!textmateTheme) {
      textmateTheme = TextMateTheme.createFromRawTheme(theme)
      this._textmateThemeCache.set(theme, textmateTheme)
    }

    // @ts-expect-error Access private `_syncRegistry`, but should work in runtime
    this._syncRegistry.setTheme(textmateTheme)
  }

  public getGrammar(name: string) {
    if (this._alias[name]) {
      const resolved = new Set<string>([name])
      while (this._alias[name]) {
        name = this._alias[name]
        if (resolved.has(name))
          throw new ShikiError(`Circular alias \`${Array.from(resolved).join(' -> ')} -> ${name}\``)
        resolved.add(name)
      }
    }
    return this._resolvedGrammars.get(name)
  }

  public async loadLanguage(lang: LanguageRegistration) {
    if (this.getGrammar(lang.name))
      return

    const embeddedLazilyBy = new Set(
      [...this._langMap.values()]
        .filter(i => i.embeddedLangsLazy?.includes(lang.name)),
    )

    this._resolver.addLanguage(lang)

    const grammarConfig: IGrammarConfiguration = {
      balancedBracketSelectors: lang.balancedBracketSelectors || ['*'],
      unbalancedBracketSelectors: lang.unbalancedBracketSelectors || [],
    }

    // @ts-expect-error Private members, set this to override the previous grammar (that can be a stub)
    this._syncRegistry._rawGrammars.set(lang.scopeName, lang)
    const g = await this.loadGrammarWithConfiguration(lang.scopeName, 1, grammarConfig) as Grammar
    g.name = lang.name
    this._resolvedGrammars.set(lang.name, g)
    if (lang.aliases) {
      lang.aliases.forEach((alias) => {
        this._alias[alias] = lang.name
      })
    }
    // Reset cache
    this._loadedLanguagesCache = null

    // If there is a language that embeds this language lazily, we need to reload it
    if (embeddedLazilyBy.size) {
      for (const e of embeddedLazilyBy) {
        this._resolvedGrammars.delete(e.name)
        // Reset cache
        this._loadedLanguagesCache = null
        // @ts-expect-error clear cache
        this._syncRegistry?._injectionGrammars?.delete(e.scopeName)
        // @ts-expect-error clear cache
        this._syncRegistry?._grammars?.delete(e.scopeName)
        await this.loadLanguage(this._langMap.get(e.name)!)
      }
    }
  }

  async init() {
    this._themes.map(t => this.loadTheme(t))
    await this.loadLanguages(this._langs)
  }

  public override dispose(): void {
    super.dispose()
    this._resolvedThemes.clear()
    this._resolvedGrammars.clear()
    this._langMap.clear()
    this._langGraph.clear()
    this._loadedThemesCache = null
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
      throw new ShikiError(`Missing languages ${missingLangs.map(([name]) => `\`${name}\``).join(', ')}, required by ${dependents.map(([name]) => `\`${name}\``).join(', ')}`)
    }

    for (const [_, lang] of langsGraphArray)
      this._resolver.addLanguage(lang)

    for (const [_, lang] of langsGraphArray)
      await this.loadLanguage(lang)
  }

  public getLoadedLanguages() {
    if (!this._loadedLanguagesCache) {
      this._loadedLanguagesCache = [
        ...new Set([...this._resolvedGrammars.keys(), ...Object.keys(this._alias)]),
      ]
    }
    return this._loadedLanguagesCache
  }

  private resolveEmbeddedLanguages(lang: LanguageRegistration) {
    this._langMap.set(lang.name, lang)
    this._langGraph.set(lang.name, lang)
    if (lang.embeddedLangs) {
      for (const embeddedLang of lang.embeddedLangs)
        this._langGraph.set(embeddedLang, this._langMap.get(embeddedLang)!)
    }
  }
}
