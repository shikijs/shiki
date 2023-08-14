import type { CodeToHtmlOptions, CodeToHtmlThemesOptions, CodeToThemedTokensOptions, CodeToTokensWithThemesOptions, HighlighterCoreOptions, HighlighterGeneric, LanguageInput, MaybeGetter, ThemeInput, ThemedToken } from '../types'
import { createOnigScanner, createOnigString, loadWasm } from '../oniguruma'
import { Registry } from './registry'
import { Resolver } from './resolver'
import { tokenizeWithTheme } from './themedTokenizer'
import { renderToHtml } from './renderer-html'
import { isPlaintext } from './utils'
import { renderToHtmlThemes, syncThemesTokenization } from './renderer-html-themes'

export type HighlighterCore = HighlighterGeneric<never, never>

export async function getHighlighterCore(options: HighlighterCoreOptions = {}): Promise<HighlighterCore> {
  async function resolveLangs(langs: LanguageInput[]) {
    return Array.from(new Set((await Promise.all(
      langs.map(async lang => await normalizeGetter(lang).then(r => Array.isArray(r) ? r : [r])),
    )).flat()))
  }

  const [
    themes, langs,
  ] = await Promise.all([
    Promise.all((options.themes || []).map(normalizeGetter)),
    resolveLangs(options.langs || []),
    typeof options.loadWasm === 'function'
      ? Promise.resolve(options.loadWasm()).then(r => loadWasm(r))
      : options.loadWasm
        ? loadWasm(options.loadWasm)
        : undefined,
  ] as const)

  const resolver = new Resolver(Promise.resolve({
    createOnigScanner(patterns) {
      return createOnigScanner(patterns)
    },
    createOnigString(s) {
      return createOnigString(s)
    },
  }), 'vscode-oniguruma', langs)

  const _registry = new Registry(resolver, themes, langs)
  await _registry.init()

  const defaultTheme = themes[0]?.name

  function codeToThemedTokens(
    code: string,
    options: CodeToThemedTokensOptions = {},
  ): ThemedToken[][] {
    const {
      lang = 'text', theme = defaultTheme, includeExplanation = true,
    } = options

    if (isPlaintext(lang)) {
      const lines = code.split(/\r\n|\r|\n/)
      return [...lines.map(line => [{ content: line }])]
    }
    const _grammar = getLang(lang)
    const { _theme, _colorMap } = setTheme(theme)
    return tokenizeWithTheme(code, _grammar, _theme, _colorMap, {
      includeExplanation,
    })
  }

  function getLang(name: string) {
    const _lang = _registry.getGrammar(name)
    if (!_lang)
      throw new Error(`[shikiji] Language \`${name}\` not found, you may need to load it first`)
    return _lang
  }

  function getTheme(name = defaultTheme) {
    const _theme = _registry.getTheme(name!)
    if (!_theme)
      throw new Error(`[shikiji] Theme \`${name}\` not found, you may need to load it first`)
    return _theme
  }

  function setTheme(name = defaultTheme) {
    const _theme = getTheme(name)
    _registry.setTheme(_theme)
    const _colorMap = _registry.getColorMap()
    return {
      _theme,
      _colorMap,
    }
  }

  /**
   * Get highlighted code in HTML.
   */
  function codeToHtml(code: string, options: CodeToHtmlOptions = {}): string {
    const tokens = codeToThemedTokens(code, {
      ...options,
      includeExplanation: false,
    })
    const _theme = getTheme(options.theme)
    return renderToHtml(tokens, {
      fg: _theme.fg,
      bg: _theme.bg,
      lineOptions: options?.lineOptions,
      themeName: _theme.name,
    })
  }

  /**
   * Get tokens with multiple themes, with synced
   */
  function codeToTokensWithThemes(code: string, options: CodeToTokensWithThemesOptions) {
    const themes = Object.entries(options.themes)
      .filter(i => i[1]) as [string, string][]

    const tokens = syncThemesTokenization(...themes.map(t => codeToThemedTokens(code, {
      ...options,
      theme: t[1],
      includeExplanation: false,
    })))

    return themes.map(([color, theme], idx) => [
      color,
      theme,
      tokens[idx],
    ] as [string, string, ThemedToken[][]])
  }

  function codeToHtmlThemes(code: string, options: CodeToHtmlThemesOptions): string {
    const {
      defaultColor = 'light',
      cssVariablePrefix = '--shiki-',
    } = options

    const tokens = codeToTokensWithThemes(code, options)
      .sort(a => a[0] === defaultColor ? -1 : 1)

    return renderToHtmlThemes(
      tokens,
      tokens.map(i => getTheme(i[1])),
      cssVariablePrefix,
      defaultColor !== false,
      options,
    )
  }

  async function loadLanguage(...langs: LanguageInput[]) {
    await _registry.loadLanguages(await resolveLangs(langs))
  }

  async function loadTheme(...themes: ThemeInput[]) {
    await Promise.all(
      themes.map(async theme => _registry.loadTheme(await normalizeGetter(theme))),
    )
  }

  return {
    codeToHtml,
    codeToHtmlThemes,
    codeToThemedTokens,
    codeToTokensWithThemes,
    loadLanguage,
    loadTheme,
    getLoadedThemes: () => _registry.getLoadedThemes(),
    getLoadedLanguages: () => _registry.getLoadedLanguages(),
  }
}

async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
  return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
}
