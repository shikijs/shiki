import { Highlighter, HighlighterOptions, ILanguageRegistration } from './types'

import { Resolver } from './resolver'
import { tokenizeWithTheme } from './themedTokenizer'
import { renderToHtml } from './renderer'

import { getOnigasm } from './loader'
import { IThemeRegistration } from './types'
import { languages as BUNDLED_LANGUAGES } from './languages'
import { Registry } from './registry'

function resolveOptions(options: HighlighterOptions) {
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

  return { languages, themes }
}

export async function getHighlighter(options: HighlighterOptions): Promise<Highlighter> {
  const { languages: _languages, themes: _themes } = resolveOptions(options)
  const _resolver = new Resolver(_languages, getOnigasm(), 'onigasm')
  const _registry = new Registry(_resolver)

  const themes = await _registry.loadThemes(_themes)
  const _defaultTheme = themes[0]
  await _registry.loadLanguages(_languages)

  const getTheme = (theme: IThemeRegistration) => {
    const _theme = theme ? _registry.getTheme(theme) : _defaultTheme
    if (!_theme) {
      throw Error(`No theme registration for ${theme}`)
    }
    _registry.setTheme(_theme)
    const _colorMap = _registry.getColorMap()
    return { _theme, _colorMap }
  }

  const getGrammer = (lang: string) => {
    const _grammer = _registry.getGrammer(lang)
    if (!_grammer) {
      throw Error(`No language registration for ${lang}`)
    }

    return { _grammer }
  }

  return {
    codeToThemedTokens: (code: string, lang = 'text', options = { includeExplanation: true }) => {
      if (isPlaintext(lang)) {
        throw Error('Cannot tokenize plaintext')
      }
      const { _grammer } = getGrammer(lang)
      const { _theme, _colorMap } = getTheme(options.theme)
      return tokenizeWithTheme(_theme, _colorMap, code, _grammer, options)
    },
    codeToHtml: (code: string, lang = 'text', theme?: string) => {
      const { _theme, _colorMap } = getTheme(theme)

      if (isPlaintext(lang)) {
        return renderToHtml([[{ content: code }]], {
          fg: _theme.fg,
          bg: _theme.bg
        })
      }

      const { _grammer } = getGrammer(lang)
      const tokens = tokenizeWithTheme(_theme, _colorMap, code, _grammer, {
        includeExplanation: false
      })
      return renderToHtml(tokens, {
        bg: _theme.bg
      })
    },
    async loadTheme(theme: IThemeRegistration) {
      return await _registry.loadTheme(theme)
    }
  }
}

function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text'].includes(lang)
}
