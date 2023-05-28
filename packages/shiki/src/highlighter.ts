import type {
  Highlighter,
  HighlighterOptions,
  CodeToHtmlOptions,
  ILanguageRegistration,
  IShikiTheme,
  IThemeRegistration,
  StringLiteralUnion,
  AnsiToHtmlOptions
} from './types'
import { Resolver } from './resolver'
import { tokenizeWithTheme } from './themedTokenizer'
import { tokenizeAnsiWithTheme } from './ansiThemedTokenizer'
import { renderToHtml } from './renderer'

import { getOniguruma, WASM_PATH } from './loader'
import { Lang, languages as BUNDLED_LANGUAGES } from './languages'
import { Registry } from './registry'
import { Theme } from './themes'
import { namedColors as ansiNamedColors } from 'ansi-sequence-parser'

function resolveLang(lang: ILanguageRegistration | Lang) {
  return typeof lang === 'string'
    ? BUNDLED_LANGUAGES.find(l => l.id === lang || l.aliases?.includes(lang))
    : lang
}

function resolveOptions(options: HighlighterOptions) {
  let _languages: ILanguageRegistration[] = BUNDLED_LANGUAGES
  let _themes: IThemeRegistration[] = options.themes || []
  let _wasmPath: string = options.paths?.wasm
    ? options.paths.wasm.endsWith('/')
      ? options.paths.wasm
      : options.paths.wasm + '/'
    : WASM_PATH

  if (options.langs) {
    _languages = options.langs.map(resolveLang)
  }
  if (options.theme) {
    _themes.unshift(options.theme)
  }
  if (!_themes.length) {
    _themes = ['nord']
  }

  return { _languages, _themes, _wasmPath }
}

function generateDefaultColorReplacements() {
  const replacements: Record<string, string> = {
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

  // Generates a color replacement for each ANSI color with the form #A00000, #A00001, etc.
  // Note that dimmed colors will use variables with the name var(--shiki-color-ansi-<color>-dim)
  for (let i = 0; i < ansiNamedColors.length; i++) {
    const code = `#A${i.toString().padStart(5, '0')}`
    const colorNameKebab = ansiNamedColors[i].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    replacements[code] = `var(--shiki-color-ansi-${colorNameKebab})`
  }

  return replacements
}

export async function getHighlighter(options: HighlighterOptions): Promise<Highlighter> {
  const { _languages, _themes, _wasmPath } = resolveOptions(options)
  const _resolver = new Resolver(getOniguruma(_wasmPath), 'vscode-oniguruma')
  const _registry = new Registry(_resolver)

  if (options.paths?.themes) {
    _registry.themesPath = options.paths.themes.endsWith('/')
      ? options.paths.themes
      : options.paths.themes + '/'
  }

  if (options.paths?.languages) {
    _resolver.languagesPath = options.paths.languages.endsWith('/')
      ? options.paths.languages
      : options.paths.languages + '/'
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
  let COLOR_REPLACEMENTS = generateDefaultColorReplacements()
  function setColorReplacements(map: Record<string, string>) {
    COLOR_REPLACEMENTS = map
  }
  function fixCssVariablesTheme(theme: IShikiTheme, colorMap: string[]) {
    theme.bg = COLOR_REPLACEMENTS[theme.bg] || theme.bg
    theme.fg = COLOR_REPLACEMENTS[theme.fg] || theme.fg

    Object.entries(theme.colors).forEach(([key, value]) => {
      theme.colors[key] = COLOR_REPLACEMENTS[value] || value
    })

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
    if (_theme.type === 'css') {
      fixCssVariablesTheme(_theme, _colorMap)
    }
    return { _theme, _colorMap }
  }

  function getGrammar(lang: string) {
    const _grammar = _registry.getGrammar(lang)
    if (!_grammar) {
      throw Error(`No language registration for ${lang}`)
    }
    return { _grammar }
  }

  function codeToThemedTokens(
    code: string,
    lang = 'text',
    theme?: IThemeRegistration,
    options = { includeExplanation: true }
  ) {
    if (isPlaintext(lang)) {
      const lines = code.split(/\r\n|\r|\n/)
      return [...lines.map(line => [{ content: line }])]
    }
    const { _grammar } = getGrammar(lang)
    const { _theme, _colorMap } = getTheme(theme)
    return tokenizeWithTheme(_theme, _colorMap, code, _grammar, options)
  }

  function ansiToThemedTokens(ansi: string, theme?: IThemeRegistration) {
    const { _theme } = getTheme(theme)
    return tokenizeAnsiWithTheme(_theme, ansi)
  }

  function codeToHtml(code: string, options?: CodeToHtmlOptions): string
  function codeToHtml(
    code: string,
    lang?: StringLiteralUnion<Lang>,
    theme?: StringLiteralUnion<Theme>
  ): string
  function codeToHtml(
    code: string,
    arg1: StringLiteralUnion<Lang> | CodeToHtmlOptions = 'text',
    arg2?: StringLiteralUnion<Theme>
  ) {
    let options: CodeToHtmlOptions

    // codeToHtml(code, options?) overload
    if (typeof arg1 === 'object') {
      options = arg1
    }
    // codeToHtml(code, lang?, theme?) overload
    else {
      options = {
        lang: arg1,
        theme: arg2
      }
    }

    const tokens = codeToThemedTokens(code, options.lang, options.theme, {
      includeExplanation: false
    })
    const { _theme } = getTheme(options.theme)
    return renderToHtml(tokens, {
      fg: _theme.fg,
      bg: _theme.bg,
      lineOptions: options?.lineOptions,
      themeName: _theme.name
    })
  }

  function ansiToHtml(ansi: string, options?: AnsiToHtmlOptions) {
    const tokens = ansiToThemedTokens(ansi, options?.theme)
    const { _theme } = getTheme(options?.theme)
    return renderToHtml(tokens, {
      fg: _theme.fg,
      bg: _theme.bg,
      lineOptions: options?.lineOptions,
      themeName: _theme.name
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

  function getBackgroundColor(theme?: IThemeRegistration) {
    const { _theme } = getTheme(theme)
    return _theme.bg
  }

  function getForegroundColor(theme?: IThemeRegistration) {
    const { _theme } = getTheme(theme)
    return _theme.fg
  }

  return {
    codeToThemedTokens,
    codeToHtml,
    ansiToThemedTokens,
    ansiToHtml,
    getTheme: (theme: IThemeRegistration) => {
      return getTheme(theme)._theme
    },
    loadTheme,
    loadLanguage,
    getBackgroundColor,
    getForegroundColor,
    getLoadedThemes,
    getLoadedLanguages,
    setColorReplacements
  }
}

function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text'].includes(lang)
}
