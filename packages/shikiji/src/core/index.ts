import type { CodeToHtmlDualThemesOptions, CodeToHtmlOptions, CodeToThemedTokensOptions, LanguageInput, MaybeGetter, PlainTextLanguage, ThemeInput, ThemeRegisteration, ThemedToken } from '../types'
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

  function codeToHtmlDualThemes(code: string, options: CodeToHtmlDualThemesOptions): string {
    const {
      defaultColor = 'light',
      cssVariablePrefix = '--shiki-',
    } = options

    const themes = Object.entries(options.themes)
      .filter(i => i[1])
      .sort(a => a[0] === defaultColor ? -1 : 1)

    const tokens = themes.map(([color, theme]) => [
      color,
      codeToThemedTokens(code, {
        ...options,
        theme,
        includeExplanation: false,
      }),
      getTheme(theme),
    ] as [string, ThemedToken[][], ThemeRegisteration])

    return renderToHtmlDualThemes(
      tokens,
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

export interface BundledHighlighterOptions<L extends string, T extends string> {
  themes?: (ThemeInput | T)[]
  langs?: (LanguageInput | L | PlainTextLanguage)[]
}

/**
 * Create a `getHighlighter` function with bundled themes and languages.
 *
 * @param bundledLanguages
 * @param bundledThemes
 * @param ladWasm
 */
export function createdBundledHighlighter<L extends string, T extends string >(
  bundledLanguages: Record<L, LanguageInput>,
  bundledThemes: Record<T, ThemeInput>,
  ladWasm: HighlighterCoreOptions['loadWasm'],
) {
  async function getHighlighter(options: BundledHighlighterOptions<L, T> = {}) {
    function resolveLang(lang: LanguageInput | L | PlainTextLanguage): LanguageInput {
      if (typeof lang === 'string') {
        if (isPlaintext(lang))
          return []
        const bundle = bundledLanguages[lang as L]
        if (!bundle)
          throw new Error(`[shikiji] Language \`${lang}\` is not built-in.`)
        return bundle
      }
      return lang as LanguageInput
    }

    function resolveTheme(theme: ThemeInput | T): ThemeInput {
      if (typeof theme === 'string') {
        const bundle = bundledThemes[theme]
        if (!bundle)
          throw new Error(`[shikiji] Theme \`${theme}\` is not built-in.`)
        return bundle
      }
      return theme
    }

    const _themes = (options.themes ?? []).map(i => resolveTheme(i)) as ThemeInput[]

    const langs = (options.langs ?? [] as L[])
      .map(i => resolveLang(i))

    const core = await getHighlighterCore({
      ...options,
      themes: _themes,
      langs,
      loadWasm: ladWasm,
    })

    return {
      ...core,
      codeToHtml(code: string, options: CodeToHtmlOptions<L, T> = {}) {
        return core.codeToHtml(code, options as CodeToHtmlOptions)
      },
      loadLanguage(...langs: (LanguageInput | L | PlainTextLanguage)[]) {
        return core.loadLanguage(...langs.map(resolveLang))
      },
      loadTheme(...themes: (ThemeInput | T)[]) {
        return core.loadTheme(...themes.map(resolveTheme))
      },
    }
  }

  return getHighlighter
}
