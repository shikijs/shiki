import type { CodeToHtmlDualThemesOptions, CodeToHtmlOptions, CodeToThemedTokensOptions, LanguageInput, MaybeGetter, ThemeInput, ThemedToken } from '../types'
import type { OnigurumaLoadOptions } from '../oniguruma'
import { createOnigScanner, createOnigString, loadWasm } from '../oniguruma'
import { Registry } from './registry'
import { Resolver } from './resolver'
import { tokenizeWithTheme } from './themedTokenizer'
import { renderToHtml } from './renderer-html'
import { isPlaintext } from './utils'
import { renderToHtmlDualThemes } from './renderer-html-dual-themes'

export interface HighlighterCoreOptions {
  themes: ThemeInput[]
  langs: LanguageInput[]
  loadWasm?: OnigurumaLoadOptions | (() => Promise<OnigurumaLoadOptions>)
}

export type HighlighterCore = Awaited<ReturnType<typeof getHighlighterCore>>

export {
  loadWasm,
}

export async function getHighlighterCore(options: HighlighterCoreOptions) {
  async function resolveLangs(langs: LanguageInput[]) {
    return Array.from(new Set((await Promise.all(
      langs.map(async lang => await normalizeGetter(lang).then(r => Array.isArray(r) ? r : [r])),
    )).flat()))
  }

  const [
    themes,
    langs,
  ] = await Promise.all([
    Promise.all(options.themes.map(normalizeGetter)),
    resolveLangs(options.langs),
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

  const defaultTheme = themes[0].name

  function codeToThemedTokens(
    code: string,
    options: CodeToThemedTokensOptions = {},
  ): ThemedToken[][] {
    const {
      lang = 'text',
      theme = defaultTheme,
      includeExplanation = true,
    } = options

    if (isPlaintext(lang)) {
      const lines = code.split(/\r\n|\r|\n/)
      return [...lines.map(line => [{ content: line }])]
    }
    const _grammar = getLang(lang)
    const { _theme, _colorMap } = getTheme(theme)
    return tokenizeWithTheme(code, _grammar, _theme, _colorMap, {
      includeExplanation,
    })
  }

  function getLang(name: string) {
    const _lang = _registry.getGrammar(name)
    if (!_lang)
      throw new Error(`[shikiji] Language \`${name}\` not found`)
    return _lang
  }

  function getTheme(name = defaultTheme) {
    const _theme = _registry.getTheme(name!)
    if (!_theme)
      throw new Error(`[shikiji] Theme \`${name}\` not found`)
    _registry.setTheme(_theme)
    const _colorMap = _registry.getColorMap()
    return {
      _theme,
      _colorMap,
    }
  }

  function codeToHtml(code: string, options: CodeToHtmlOptions = {}): string {
    const tokens = codeToThemedTokens(code, {
      ...options,
      includeExplanation: false,
    })
    const { _theme } = getTheme(options.theme)
    return renderToHtml(tokens, {
      fg: _theme.fg,
      bg: _theme.bg,
      lineOptions: options?.lineOptions,
      themeName: _theme.name,
    })
  }

  function codeToHtmlDualThemes(code: string, options: CodeToHtmlDualThemesOptions): string {
    const {
      defaultColor = 'light',
      cssVariableName = '--shiki-dark',
    } = options

    const tokens1 = codeToThemedTokens(code, {
      ...options,
      theme: defaultColor === 'light' ? options.theme.light : options.theme.dark,
      includeExplanation: false,
    })

    const tokens2 = codeToThemedTokens(code, {
      ...options,
      theme: defaultColor === 'light' ? options.theme.dark : options.theme.light,
      includeExplanation: false,
    })

    const { _theme: _theme1 } = getTheme(defaultColor === 'light' ? options.theme.light : options.theme.dark)
    const { _theme: _theme2 } = getTheme(defaultColor === 'light' ? options.theme.dark : options.theme.light)

    return renderToHtmlDualThemes(tokens1, tokens2, cssVariableName, {
      fg: `${_theme1.fg};${cssVariableName}:${_theme2.fg}`,
      bg: `${_theme1.bg};${cssVariableName}-bg:${_theme2.bg}`,
      lineOptions: options?.lineOptions,
      themeName: `shiki-dual-themes ${_theme1.name}--${_theme2.name}`,
    })
  }

  async function loadLanguage(...langs: LanguageInput[]) {
    await _registry.loadLanguages(await resolveLangs(langs))
  }

  async function loadTheme(...themes: ThemeInput[]) {
    await Promise.all(
      themes.map(async theme =>
        _registry.loadTheme(await normalizeGetter(theme)),
      ),
    )
  }

  return {
    codeToThemedTokens,
    codeToHtml,
    codeToHtmlDualThemes,
    loadLanguage,
    loadTheme,
    getLoadedThemes: () => _registry.getLoadedThemes(),
    getLoadedLanguages: () => _registry.getLoadedLanguages(),
  }
}

async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
  return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
}
