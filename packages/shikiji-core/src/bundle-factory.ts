import type { BundledHighlighterOptions, CodeToHastOptions, CodeToThemedTokensOptions, CodeToTokensWithThemesOptions, HighlighterCoreOptions, HighlighterGeneric, LanguageInput, MaybeArray, RequireKeys, SpecialLanguage, ThemeInput, ThemeRegistration, ThemeRegistrationRaw } from './types'
import { isSpecialLang, toArray } from './utils'
import { getHighlighterCore } from './highlighter'

export type GetHighlighterFactory<L extends string, T extends string> = (options?: BundledHighlighterOptions<L, T>) => Promise<HighlighterGeneric<L, T>>

/**
 * Create a `getHighlighter` function with bundled themes and languages.
 *
 * @param bundledLanguages
 * @param bundledThemes
 * @param ladWasm
 */
export function createdBundledHighlighter<BundledLangs extends string, BundledThemes extends string>(
  bundledLanguages: Record<BundledLangs, LanguageInput>,
  bundledThemes: Record<BundledThemes, ThemeInput>,
  ladWasm: HighlighterCoreOptions['loadWasm'],
): GetHighlighterFactory<BundledLangs, BundledThemes> {
  async function getHighlighter(options: BundledHighlighterOptions<BundledLangs, BundledThemes> = {}): Promise<HighlighterGeneric<BundledLangs, BundledThemes>> {
    function resolveLang(lang: LanguageInput | BundledLangs | SpecialLanguage): LanguageInput {
      if (typeof lang === 'string') {
        if (isSpecialLang(lang))
          return []
        const bundle = bundledLanguages[lang as BundledLangs]
        if (!bundle)
          throw new Error(`[shikiji] Language \`${lang}\` is not built-in.`)
        return bundle
      }
      return lang as LanguageInput
    }

    function resolveTheme(theme: ThemeInput | BundledThemes): ThemeInput {
      if (typeof theme === 'string') {
        const bundle = bundledThemes[theme]
        if (!bundle)
          throw new Error(`[shikiji] Theme \`${theme}\` is not built-in.`)
        return bundle
      }
      return theme
    }

    const _themes = (options.themes ?? []).map(i => resolveTheme(i as ThemeInput)) as ThemeInput[]

    const langs = (options.langs ?? [] as BundledLangs[])
      .map(i => resolveLang(i as BundledLangs))

    const core = await getHighlighterCore({
      ...options,
      themes: _themes,
      langs,
      loadWasm: ladWasm,
    })

    return {
      ...core,
      loadLanguage(...langs) {
        return core.loadLanguage(...langs.map(resolveLang))
      },
      loadTheme(...themes) {
        return core.loadTheme(...themes.map(resolveTheme))
      },
    }
  }

  return getHighlighter
}

export function createSingletonShorthands<L extends string, T extends string >(getHighlighter: GetHighlighterFactory<L, T>) {
  let _shiki: ReturnType<typeof getHighlighter>

  async function _getHighlighter(options: {
    theme?: MaybeArray<T | ThemeRegistration | ThemeRegistrationRaw>
    lang?: MaybeArray<L | SpecialLanguage>
  } = {}) {
    if (!_shiki) {
      _shiki = getHighlighter({
        themes: toArray(options.theme || []),
        langs: toArray(options.lang || []),
      })
      return _shiki
    }
    else {
      const s = await _shiki
      await Promise.all([
        s.loadTheme(...toArray(options.theme || [])),
        s.loadLanguage(...toArray(options.lang || [])),
      ])
      return s
    }
  }

  /**
   * Shorthand for `codeToHtml` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   *
   * Differences from `shiki.codeToHtml()`, this function is async.
   */
  async function codeToHtml(code: string, options: CodeToHastOptions<L, T>) {
    const shiki = await _getHighlighter({
      lang: options.lang as L,
      theme: ('theme' in options ? [options.theme] : Object.values(options.themes)) as T[],
    })
    return shiki.codeToHtml(code, options)
  }

  /**
   * Shorthand for `codeToHtml` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   *
   * Differences from `shiki.codeToHtml()`, this function is async.
   */
  async function codeToHast(code: string, options: CodeToHastOptions<L, T>) {
    const shiki = await _getHighlighter({
      lang: options.lang as L,
      theme: ('theme' in options ? [options.theme] : Object.values(options.themes)) as T[],
    })
    return shiki.codeToHast(code, options)
  }

  /**
   * Shorthand for `codeToThemedTokens` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   *
   * Differences from `shiki.codeToThemedTokens()`, this function is async.
   */
  async function codeToThemedTokens(code: string, options: RequireKeys<CodeToThemedTokensOptions<L, T>, 'theme' | 'lang'>) {
    const shiki = await _getHighlighter(options)
    return shiki.codeToThemedTokens(code, options)
  }

  /**
   * Shorthand for `codeToTokensWithThemes` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   *
   * Differences from `shiki.codeToTokensWithThemes()`, this function is async.
   */
  async function codeToTokensWithThemes(code: string, options: RequireKeys<CodeToTokensWithThemesOptions<L, T>, 'themes' | 'lang'>) {
    const shiki = await _getHighlighter({
      lang: options.lang,
      theme: Object.values(options.themes).filter(Boolean) as T[],
    })
    return shiki.codeToTokensWithThemes(code, options)
  }

  return {
    getSingletonHighlighter: () => _getHighlighter(),
    codeToHtml,
    codeToHast,
    codeToThemedTokens,
    codeToTokensWithThemes,
  }
}
