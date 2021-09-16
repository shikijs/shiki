import type {
  Highlighter,
  HighlighterOptions,
  ILanguageRegistration,
  IShikiTheme,
  IThemeRegistration,
  StringLiteralUnion
} from './types'
import { Resolver } from './resolver'
import { tokenizeWithTheme } from './themedTokenizer'
import { renderToHtml } from './renderer'

import { getOnigasm } from './loader'
import { Lang, languages as BUNDLED_LANGUAGES } from './languages'
import { Registry } from './registry'
import { Theme } from './themes'

function resolveLang(lang: ILanguageRegistration | Lang) {
  return typeof lang === 'string'
    ? BUNDLED_LANGUAGES.find(l => l.id === lang || l.aliases?.includes(lang))
    : lang
}

function resolveOptions(options: HighlighterOptions) {
  let _languages: ILanguageRegistration[] = BUNDLED_LANGUAGES
  let _themes: IThemeRegistration[] = options.themes || []

  if (options.langs?.length) {
    _languages = options.langs.map(resolveLang)
  }
  if (options.theme) {
    _themes.unshift(options.theme)
  }
  if (!_themes.length) {
    _themes = ['nord']
  }

  return { _languages, _themes }
}

export async function getHighlighter(options: HighlighterOptions): Promise<Highlighter> {
  const { _languages, _themes } = resolveOptions(options)
  const _resolver = new Resolver(getOnigasm(), 'onigasm')
  const _registry = new Registry(_resolver)

  if (options.paths?.themes) {
    _registry.themesPath = options.paths.themes
  }

  if (options.paths?.languages) {
    _resolver.languagesPath = options.paths.languages
  }

  const themes = await _registry.loadThemes(_themes)
  const _defaultTheme = themes[0]
  let _currentTheme: IShikiTheme | undefined
  await _registry.loadLanguages(_languages)

  /**
   * Shiki was designed for VS Code, so CSS variables are not currently supported.
   * See: https://github.com/shikijs/shiki/pull/212#issuecomment-906924986
   *
   * Instead, we work around this by using valid hex color codes as lookups in a
   * final "repair" step which translates those codes to the correct CSS variables.
   */
  const COLOR_REPLACEMENTS: Record<string, string> = {
    '#000001': 'var(--shiki-color-text)',
    '#000002': 'var(--shiki-color-background)',
    '#000004': 'var(--shiki-token-constant)',
    '#000005': 'var(--shiki-token-string)',
    '#000006': 'var(--shiki-token-comment)',
    '#000007': 'var(--shiki-token-keyword)',
    '#000008': 'var(--shiki-token-parameter)',
    '#000009': 'var(--shiki-token-function)',
    '#000010': 'var(--shiki-token-string-expression)',
    '#000011': 'var(--shiki-token-punctuation)',
    '#000012': 'var(--shiki-token-link)'
  }

  function fixCssVariablesTheme(theme: IShikiTheme, colorMap: string[]) {
    theme.bg = COLOR_REPLACEMENTS[theme.bg] || theme.bg
    theme.fg = COLOR_REPLACEMENTS[theme.fg] || theme.fg
    colorMap.forEach((val, i) => {
      colorMap[i] = COLOR_REPLACEMENTS[val] || val
    })
  }

  function getTheme(theme?: IThemeRegistration) {
    const _theme = theme ? _registry.getTheme(theme) : _defaultTheme
    if (!_theme) {
      throw Error(`No theme registration for ${theme}`)
    }
    if (!_currentTheme || _currentTheme.name !== _theme.name) {
      _registry.setTheme(_theme)
      _currentTheme = _theme
    }
    const _colorMap = _registry.getColorMap()
    if (_theme.name === 'css-variables') {
      fixCssVariablesTheme(_theme, _colorMap)
    }
    return { _theme, _colorMap }
  }

  function getGrammer(lang: string) {
    const _grammer = _registry.getGrammer(lang)
    if (!_grammer) {
      throw Error(`No language registration for ${lang}`)
    }
    return { _grammer }
  }

  function codeToThemedTokens(
    code: string,
    lang = 'text',
    theme?: StringLiteralUnion<Theme>,
    options = { includeExplanation: true }
  ) {
    if (isPlaintext(lang)) {
      return [[{ content: code }]]
    }
    const { _grammer } = getGrammer(lang)
    const { _theme, _colorMap } = getTheme(theme)
    return tokenizeWithTheme(_theme, _colorMap, code, _grammer, options)
  }

  function codeToHtml(code: string, lang = 'text', theme?: StringLiteralUnion<Theme>) {
    const tokens = codeToThemedTokens(code, lang, theme, {
      includeExplanation: false
    })
    const { _theme } = getTheme(theme)
    return renderToHtml(tokens, {
      fg: _theme.fg,
      bg: _theme.bg
    })
  }

  async function loadTheme(theme: IShikiTheme | Theme) {
    await _registry.loadTheme(theme)
  }

  async function loadLanguage(lang: ILanguageRegistration | Lang) {
    const _lang = resolveLang(lang)
    _resolver.addLanguage(_lang)
    await _registry.loadLanguage(_lang)
  }

  function getLoadedThemes() {
    return _registry.getLoadedThemes()
  }

  function getLoadedLanguages() {
    return _registry.getLoadedLanguages()
  }

  function getBackgroundColor(theme?: StringLiteralUnion<Theme>) {
    const { _theme } = getTheme(theme)
    return _theme.bg
  }

  function getForegroundColor(theme?: StringLiteralUnion<Theme>) {
    const { _theme } = getTheme(theme)
    return _theme.fg
  }

  return {
    codeToThemedTokens,
    codeToHtml,
    getTheme: (theme: IThemeRegistration) => {
      return getTheme(theme)._theme
    },
    loadTheme,
    loadLanguage,
    getBackgroundColor,
    getForegroundColor,
    getLoadedThemes,
    getLoadedLanguages
  }
}

function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text'].includes(lang)
}
