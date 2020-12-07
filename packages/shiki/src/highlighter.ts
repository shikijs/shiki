import { Registry } from 'vscode-textmate'

import { ILanguageRegistration } from './types'

import { Resolver } from './resolver'
import { tokenizeWithTheme, IThemedToken } from './themedTokenizer'
import { renderToHtml } from './renderer'

import { getOnigasm } from './loader'
import { IShikiTheme, IThemeRegistration } from './types'
import { Theme } from './themes'
import { Lang, languages as BUNDLED_LANGUAGES } from './languages'

export interface HighlighterOptions {
  theme: IThemeRegistration
  langs?: ILanguageRegistration[]
  themes?: IThemeRegistration[]
}

export async function getHighlighter(options: HighlighterOptions) {
  let languages: ILanguageRegistration[] = BUNDLED_LANGUAGES
  let themes: IThemeRegistration[] = options.themes || []

  if (options.langs) {
    languages = [...BUNDLED_LANGUAGES, ...options.langs]
  }

  if (options.theme) {
    themes.unshift(options.theme)
  }

  if (!themes.length) {
    themes = ['nord']
  }

  const s = new Shiki(languages, themes)
  return await s.getHighlighter(themes[0])
}

interface ThemedTokenizerOptions {
  /**
   * Whether to include explanation of each token's matching scopes
   * and why it's given its color. Default to false.
   */
  includeExplanation: boolean

  theme?: StringLiteralUnion<Theme>
}

class Shiki {
  private _resolver: Resolver

  private _langs: ILanguageRegistration[]
  private _themes: IThemeRegistration[]

  private _resolvedThemes: Record<string, IShikiTheme> = {}

  constructor(langs: ILanguageRegistration[], themes: IThemeRegistration[] = []) {
    this._resolver = new Resolver(langs, getOnigasm(), 'onigasm')
    this._langs = langs
    this._themes = themes
  }

  async getHighlighter(_theme: IThemeRegistration): Promise<Highlighter> {
    const ltog = {}

    this._resolvedThemes = await this._resolver.resolveThemes(this._themes)
    const _defaultTheme = await this._resolver.resolveTheme(_theme)

    const _registry = new Registry(this._resolver)
    _registry.setTheme(_defaultTheme)

    await Promise.all(
      this._langs.map(async l => {
        const g = await _registry.loadGrammar(l.scopeName)
        ltog[l.id] = g
        if (l.aliases) {
          l.aliases.forEach(la => {
            ltog[la] = g
          })
        }
      })
    )

    const getLangTheme = (lang: string, theme: string) => {
      if (!ltog[lang]) {
        throw Error(`No language registration for ${lang}`)
      }
      const _theme = theme ? this._resolvedThemes[theme] : _defaultTheme
      if (!_theme) {
        throw Error(`No theme registration for ${theme}`)
      }
      _registry.setTheme(_theme)
      const _colorMap = _registry.getColorMap()

      return { _lang: ltog[lang], _theme, _colorMap }
    }

    return {
      codeToThemedTokens: (code: string, lang = 'text', options = { includeExplanation: true }) => {
        if (isPlaintext(lang)) {
          throw Error('Cannot tokenize plaintext')
        }
        const { _lang, _theme, _colorMap } = getLangTheme(lang, options.theme)
        return tokenizeWithTheme(_theme, _colorMap, code, _lang, options)
      },
      codeToHtml: (code: string, lang = 'text', theme?: string) => {
        if (isPlaintext(lang)) {
          return renderToHtml([[{ content: code }]], {
            fg: _defaultTheme.fg,
            bg: _defaultTheme.bg
          })
        }
        const { _lang, _theme, _colorMap } = getLangTheme(lang, theme)

        const tokens = tokenizeWithTheme(_theme, _colorMap, code, _lang, {
          includeExplanation: false
        })
        return renderToHtml(tokens, {
          bg: _theme.bg
        })
      }
    }
  }
}

function isPlaintext(lang) {
  return ['plaintext', 'txt', 'text'].indexOf(lang) !== -1
}

/**
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 * Since `string | 'foo'` doesn't offer auto completion
 */
type StringLiteralUnion<T extends U, U = string> = T | (U & {})
export interface Highlighter {
  codeToThemedTokens(
    code: string,
    lang?: StringLiteralUnion<Lang>,
    options?: ThemedTokenizerOptions
  ): IThemedToken[][]
  codeToHtml(
    code: string,
    lang?: StringLiteralUnion<Lang>,
    theme?: StringLiteralUnion<Theme>
  ): string

  // codeToRawHtml?(code: string): string
  // getRawCSS?(): string

  // codeToImage?(): string
}
