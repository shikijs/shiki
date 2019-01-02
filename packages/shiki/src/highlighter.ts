import { Registry, IRawTheme } from 'vscode-textmate'

import { TLang, commonLangIds, commonLangAliases, ILanguageRegistration, getLangRegistrations } from 'shiki-languages'

import { Resolver } from './resolver'
import { getOnigasm } from './onigLibs'
import { tokenizeWithTheme, IThemedToken } from './themedTokenizer'
import { renderToHtml } from './renderer'

import { getTheme, TTheme, IShikiTheme } from 'shiki-themes'

export interface HighlighterOptions {
  theme: TTheme
  langs?: TLang[]
}

export async function getHighlighter(options: HighlighterOptions) {
  const t = getTheme(options.theme)

  let langs: TLang[] = [
    ...commonLangIds,
    ...commonLangAliases
  ]

  if (options.langs) {
    langs = options.langs
  }

  const langRegistrations = getLangRegistrations(langs)

  const s = new Shiki(t, langRegistrations)
  return await s.getHighlighter()
}

class Shiki {
  private _resolver: Resolver
  private _registry: Registry

  private _theme: IShikiTheme
  private _colorMap: string[]
  private _langs: ILanguageRegistration[]

  constructor(theme: IShikiTheme, langs: ILanguageRegistration[]) {
    this._resolver = new Resolver(langs, getOnigasm(), 'onigasm')
    this._registry = new Registry(this._resolver)

    this._registry.setTheme(theme)

    this._theme = theme
    this._colorMap = this._registry.getColorMap()

    this._langs = langs
  }

  async getHighlighter(): Promise<Highlighter> {
    const ltog = {}

    await Promise.all(
      this._langs.map(async l => {
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
          bg: this._theme.bg
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