import { IGrammar, Registry as TextMateRegistry } from 'vscode-textmate'
import { IShikiTheme, IThemeRegistration, ILanguageRegistration } from './types'
import { loadTheme, repairTheme } from './loader'
import { Theme } from './themes'

export class Registry extends TextMateRegistry {
  private _resolvedThemes: Record<string, IShikiTheme> = {}
  private _resolvedGammer: Record<string, IGrammar> = {}

  getTheme(theme: Theme | IShikiTheme | string) {
    if (typeof theme === 'string') {
      return this._resolvedThemes[theme]
    } else {
      return theme
    }
  }

  async loadTheme(theme: Theme | IShikiTheme | string) {
    if (typeof theme === 'string') {
      if (!this._resolvedThemes[theme]) {
        this._resolvedThemes[theme] = await loadTheme(`${theme}.json`)
      }
      return this._resolvedThemes[theme]
    } else {
      repairTheme(theme)
      if (theme.name) {
        this._resolvedThemes[theme.name] = theme
      }
      return theme
    }
  }

  async loadThemes(themes: IThemeRegistration[]) {
    return await Promise.all(themes.map(theme => this.loadTheme(theme)))
  }

  getGrammer(name: string) {
    return this._resolvedGammer[name]
  }

  async loadLanguage(lang: ILanguageRegistration) {
    const g = await this.loadGrammar(lang.scopeName)
    this._resolvedGammer[lang.id] = g
    if (lang.aliases) {
      lang.aliases.forEach(la => {
        this._resolvedGammer[la] = g
      })
    }
  }

  async loadLanguages(langs: ILanguageRegistration[]) {
    return await Promise.all(langs.map(lang => this.loadLanguage(lang)))
  }
}
