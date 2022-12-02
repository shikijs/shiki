import { IGrammar, Registry as TextMateRegistry } from 'vscode-textmate'
import { IShikiTheme, IThemeRegistration, ILanguageRegistration } from './types'
import { fetchTheme, toShikiTheme } from './loader'
import { Theme } from './themes'
import { Resolver } from './resolver'
import { Lang, languages } from './languages'

export class Registry extends TextMateRegistry {
  public themesPath: string = 'themes/'

  private _resolvedThemes: Record<string, IShikiTheme> = {}
  private _resolvedGrammars: Record<string, IGrammar> = {}
  private _langGraph: Map<string, ILanguageRegistration> = new Map()
  private _langMap = languages.reduce((acc, lang) => {
    acc[lang.id] = lang
    return acc
  }, {} as Record<string, ILanguageRegistration>)

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
    const g = await this.loadGrammar(lang.scopeName)
    this._resolvedGrammars[lang.id] = g
    if (lang.aliases) {
      lang.aliases.forEach(la => {
        this._resolvedGrammars[la] = g
      })
    }
  }

  public async loadLanguages(langs: ILanguageRegistration[]) {
    for (const lang of langs) {
      this.resolveEmbeddedLanguages(lang)
    }

    const langsGraphArray = Array.from(this._langGraph.values())

    for (const lang of langsGraphArray) {
      this._resolver.addLanguage(lang)
    }
    for (const lang of langsGraphArray) {
      await this.loadLanguage(lang)
    }
  }

  public getLoadedLanguages() {
    return Object.keys(this._resolvedGrammars) as Lang[]
  }

  private resolveEmbeddedLanguages(lang: ILanguageRegistration) {
    if (!this._langGraph.has(lang.id)) {
      this._langGraph.set(lang.id, lang)
    }

    if (lang.embeddedLangs) {
      for (const embeddedLang of lang.embeddedLangs) {
        this._langGraph.set(embeddedLang, this._langMap[embeddedLang])
      }
    }
  }
}
