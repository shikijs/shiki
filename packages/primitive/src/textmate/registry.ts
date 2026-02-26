import type {
  Grammar,
  LanguageRegistration,
  ThemeRegistrationAny,
  ThemeRegistrationResolved,
} from '@shikijs/types'
import type { IGrammarConfiguration, IRawTheme } from '@shikijs/vscode-textmate'
import type { Resolver } from './resolver'
import { ShikiError } from '@shikijs/types'
import { Registry as TextMateRegistry, Theme as TextMateTheme } from '@shikijs/vscode-textmate'
import { resolveLangAlias } from '../utils/alias'
import { normalizeTheme } from './normalize-theme'

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

    this._themes.map(t => this.loadTheme(t))
    this.loadLanguages(this._langs)
  }

  public getTheme(theme: ThemeRegistrationAny | string): ThemeRegistrationResolved | undefined {
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

  public getLoadedThemes(): string[] {
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

    this._syncRegistry.setTheme(textmateTheme)
  }

  public getGrammar(name: string): Grammar | undefined {
    name = resolveLangAlias(name, this._alias)
    return this._resolvedGrammars.get(name)
  }

  public loadLanguage(lang: LanguageRegistration): void {
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

    this._syncRegistry._rawGrammars.set(lang.scopeName, lang)
    const g = this.loadGrammarWithConfiguration(lang.scopeName, 1, grammarConfig) as Grammar
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
        this._syncRegistry?._injectionGrammars?.delete(e.scopeName)
        this._syncRegistry?._grammars?.delete(e.scopeName)
        this.loadLanguage(this._langMap.get(e.name)!)
      }
    }
  }

  public override dispose(): void {
    super.dispose()
    this._resolvedThemes.clear()
    this._resolvedGrammars.clear()
    this._langMap.clear()
    this._langGraph.clear()
    this._loadedThemesCache = null
  }

  public loadLanguages(langs: LanguageRegistration[]): void {
    for (const lang of langs)
      this.resolveEmbeddedLanguages(lang)

    const langsGraphArray = Array.from(this._langGraph.entries())

    const missingLangs = langsGraphArray.filter(([_, lang]) => !lang)
    if (missingLangs.length) {
      const dependents = langsGraphArray
        .filter(([_, lang]) => {
          if (!lang)
            return false
          const embedded = lang.embeddedLanguages || lang.embeddedLangs
          return embedded?.some(l => missingLangs.map(([name]) => name).includes(l))
        })
        .filter(lang => !missingLangs.includes(lang))
      throw new ShikiError(`Missing languages ${missingLangs.map(([name]) => `\`${name}\``).join(', ')}, required by ${dependents.map(([name]) => `\`${name}\``).join(', ')}`)
    }

    for (const [_, lang] of langsGraphArray)
      this._resolver.addLanguage(lang)

    for (const [_, lang] of langsGraphArray)
      this.loadLanguage(lang)
  }

  public getLoadedLanguages(): string[] {
    if (!this._loadedLanguagesCache) {
      this._loadedLanguagesCache = [
        ...new Set([...this._resolvedGrammars.keys(), ...Object.keys(this._alias)]),
      ]
    }
    return this._loadedLanguagesCache
  }

  private resolveEmbeddedLanguages(lang: LanguageRegistration): void {
    this._langMap.set(lang.name, lang)
    this._langGraph.set(lang.name, lang)
    const embedded = lang.embeddedLanguages ?? lang.embeddedLangs
    if (embedded) {
      for (const embeddedLang of embedded)
        this._langGraph.set(embeddedLang, this._langMap.get(embeddedLang)!)
    }
  }
}
