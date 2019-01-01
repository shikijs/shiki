import { Registry, IRawTheme } from 'vscode-textmate'

import { LANGUAGES } from 'shiki-languages'

import { Resolver } from './resolver'
import { getOnigasm } from './onigLibs'
import { tokenizeWithTheme, IThemedToken } from './themedTokenizer'
import { renderToHtml } from './renderer'

export class Shiki {
  private _resolver: Resolver
  private _registry: Registry

  private _theme: IRawTheme
  private _colorMap: string[]
  private _themeBg: string

  constructor(theme: IRawTheme) {
    this._resolver = new Resolver(LANGUAGES, getOnigasm(), 'onigasm')
    this._registry = new Registry(this._resolver)

    this._registry.setTheme(theme)

    this._theme = theme
    this._colorMap = this._registry.getColorMap()

    this._themeBg = getThemeBg(this._theme)
  }

  async getHighlighter(): Promise<Highlighter> {
    const ltog = {}

    await Promise.all(
      LANGUAGES.map(async l => {
        const g = await this._registry.loadGrammar(l.scopeName)
        ltog[l.id] = g
        l.aliases.forEach(la => {
          ltog[la] = g
        })
      })
    )

    return {
      codeToThemedTokens: (code, lang) => {
        return tokenizeWithTheme(this._theme, this._colorMap, code, ltog[lang])
      },
      codeToHtml: (code, lang) => {
        const tokens = tokenizeWithTheme(this._theme, this._colorMap, code, ltog[lang])
        return renderToHtml(tokens, {
          bg: this._themeBg
        })
      }
    }
  }
}

export interface Highlighter {
  codeToThemedTokens(code: string, lang: string): IThemedToken[][]
  codeToHtml?(code: string, lang: string): string

  // codeToRawHtml?(code: string): string
  // getRawCSS?(): string

  // codeToSVG?(): string
  // codeToImage?(): string
}

function getThemeBg(theme: IRawTheme): string {
  const globalSetting = theme.settings.find(s => {
    return !s.name && !s.scope
  })

  return globalSetting ? globalSetting.settings.background : null
}
