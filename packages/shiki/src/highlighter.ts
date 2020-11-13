import { Registry } from 'vscode-textmate'

import { Lang, ILanguageRegistration, BUNDLED_LANGUAGES } from 'shiki-languages'

import { Resolver } from './resolver'
import { getOnigasm } from './onigLibs'
import { tokenizeWithTheme, IThemedToken } from './themedTokenizer'
import { renderToHtml } from './renderer'

import { getTheme, Theme, IShikiTheme } from 'shiki-themes'

export interface HighlighterOptions {
  theme: Theme | IShikiTheme
  langs?: ILanguageRegistration[]
}

export async function getHighlighter(options: HighlighterOptions) {
  let t: IShikiTheme
  if (typeof options.theme === 'string') {
    t = getTheme(options.theme)
  } else if (options.theme.name) {
    t = options.theme
  } else {
    t = getTheme('nord')
  }

  let languages: ILanguageRegistration[] = BUNDLED_LANGUAGES

  if (options.langs) {
    languages = [...BUNDLED_LANGUAGES, ...options.langs]
  }

  const s = new Shiki(t, languages)
  return await s.getHighlighter()
}

interface ThemedTokenizerOptions {
  /**
   * Whether to include explanation of each token's matching scopes
   * and why it's given its color. Default to false.
   */
  includeExplanation: boolean
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

    repairThemeIfNoFallbackColor(theme)
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
        if (l.aliases) {
          l.aliases.forEach(la => {
            ltog[la] = g
          })
        }
      })
    )

    return {
      codeToThemedTokens: (code, lang, options = { includeExplanation: true }) => {
        if (isPlaintext(lang)) {
          throw Error('Cannot tokenize plaintext')
        }
        if (!ltog[lang]) {
          throw Error(`No language registration for ${lang}`)
        }
        return tokenizeWithTheme(this._theme, this._colorMap, code, ltog[lang], options)
      },
      codeToHtml: (code, lang) => {
        if (isPlaintext(lang)) {
          return renderToHtml([[{ content: code }]], {
            fg: this._theme.fg,
            bg: this._theme.bg
          })
        }
        if (!ltog[lang]) {
          throw Error(`No language registration for ${lang}`)
        }
        const tokens = tokenizeWithTheme(this._theme, this._colorMap, code, ltog[lang], {
          includeExplanation: false
        })
        return renderToHtml(tokens, {
          bg: this._theme.bg
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
    lang: StringLiteralUnion<Lang>,
    options?: ThemedTokenizerOptions
  ): IThemedToken[][]
  codeToHtml?(code: string, lang: StringLiteralUnion<Lang>): string

  // codeToRawHtml?(code: string): string
  // getRawCSS?(): string

  // codeToImage?(): string
}

function repairThemeIfNoFallbackColor(theme: IShikiTheme) {
  // Has the default no-scope setting with fallback colors
  if (theme.settings[0].settings && !theme.settings[0].scope) {
    return
  }

  // Push a no-scope setting with fallback colors
  theme.settings.unshift({
    settings: {
      foreground: theme.fg,
      background: theme.bg
    }
  })
}
