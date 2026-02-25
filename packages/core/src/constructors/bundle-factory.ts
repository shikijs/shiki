import type {
  Awaitable,
  BundledHighlighterOptions,
  CodeToHastOptions,
  CodeToTokensBaseOptions,
  CodeToTokensOptions,
  CodeToTokensWithThemesOptions,
  CreateBundledHighlighterOptions,
  CreateHighlighterFactory,
  GrammarState,
  HighlighterGeneric,
  LanguageInput,
  RequireKeys,
  SpecialLanguage,
  SpecialTheme,
  ThemedToken,
  ThemedTokenWithVariants,
  ThemeInput,
  TokensResult,
} from '@shikijs/types'

import type { Root } from 'hast'
import { ShikiError } from '@shikijs/types'

import { isSpecialLang, isSpecialTheme } from '../utils'
import { createHighlighterCore } from './highlighter'

/**
 * Create a `createHighlighter` function with bundled themes, languages, and engine.
 *
 * @example
 * ```ts
 * const createHighlighter = createBundledHighlighter({
 *   langs: {
 *     typescript: () => import('@shikijs/langs/typescript'),
 *     // ...
 *   },
 *   themes: {
 *     nord: () => import('@shikijs/themes/nord'),
 *     // ...
 *   },
 *   engine: () => createOnigurumaEngine(), // or createJavaScriptRegexEngine()
 * })
 * ```
 *
 * @param options
 */
export function createBundledHighlighter<BundledLangs extends string, BundledThemes extends string>(
  options: CreateBundledHighlighterOptions<BundledLangs, BundledThemes>,
): CreateHighlighterFactory<BundledLangs, BundledThemes>

// Implementation
export function createBundledHighlighter<BundledLangs extends string, BundledThemes extends string>(
  options: CreateBundledHighlighterOptions<BundledLangs, BundledThemes>,
): CreateHighlighterFactory<BundledLangs, BundledThemes> {
  const bundledLanguages = options.langs
  const bundledThemes = options.themes
  const engine = options.engine

  async function createHighlighter(
    options: BundledHighlighterOptions<BundledLangs, BundledThemes>,
  ): Promise<HighlighterGeneric<BundledLangs, BundledThemes>> {
    function resolveLang(lang: LanguageInput | BundledLangs | SpecialLanguage): LanguageInput {
      if (typeof lang === 'string') {
        lang = (options.langAlias?.[lang] || lang) as LanguageInput | BundledLangs | SpecialLanguage
        if (isSpecialLang(lang))
          return []
        const bundle = bundledLanguages[lang as BundledLangs]
        if (!bundle)
          throw new ShikiError(`Language \`${lang}\` is not included in this bundle. You may want to load it from external source.`)
        return bundle
      }
      return lang as LanguageInput
    }

    function resolveTheme(theme: ThemeInput | BundledThemes | SpecialTheme): ThemeInput | SpecialTheme {
      if (isSpecialTheme(theme))
        return 'none'
      if (typeof theme === 'string') {
        const bundle = bundledThemes[theme]
        if (!bundle)
          throw new ShikiError(`Theme \`${theme}\` is not included in this bundle. You may want to load it from external source.`)
        return bundle
      }
      return theme
    }

    const _themes = (options.themes ?? []).map(i => resolveTheme(i as ThemeInput)) as ThemeInput[]

    const langs = (options.langs ?? [] as BundledLangs[])
      .map(i => resolveLang(i as BundledLangs))

    const core = await createHighlighterCore({
      engine: options.engine ?? engine(),
      ...options,
      themes: _themes,
      langs,
    })

    return {
      ...core,
      loadLanguage(...langs) {
        return core.loadLanguage(...langs.map(resolveLang))
      },
      loadTheme(...themes) {
        return core.loadTheme(...themes.map(resolveTheme))
      },
      getBundledLanguages() {
        return bundledLanguages
      },
      getBundledThemes() {
        return bundledThemes
      },
    }
  }

  return createHighlighter
}

export interface ShorthandsBundle<L extends string, T extends string> {
  /**
   * Shorthand for `codeToHtml` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   *
   * Differences from `highlighter.codeToHtml()`, this function is async.
   */
  codeToHtml: (code: string, options: CodeToHastOptions<L, T>) => Promise<string>

  /**
   * Shorthand for `codeToHtml` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   *
   * Differences from `highlighter.codeToHtml()`, this function is async.
   */
  codeToHast: (code: string, options: CodeToHastOptions<L, T>) => Promise<Root>

  /**
   * Shorthand for `codeToTokens` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   *
   * Differences from `highlighter.codeToTokens()`, this function is async.
   */
  codeToTokens: (code: string, options: CodeToTokensOptions<L, T>) => Promise<TokensResult>

  /**
   * Shorthand for `codeToTokensBase` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   *
   * Differences from `highlighter.codeToTokensBase()`, this function is async.
   */
  codeToTokensBase: (code: string, options: RequireKeys<CodeToTokensBaseOptions<L, T>, 'theme' | 'lang'>) => Promise<ThemedToken[][]>

  /**
   * Shorthand for `codeToTokensWithThemes` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   *
   * Differences from `highlighter.codeToTokensWithThemes()`, this function is async.
   */
  codeToTokensWithThemes: (code: string, options: RequireKeys<CodeToTokensWithThemesOptions<L, T>, 'themes' | 'lang'>) => Promise<ThemedTokenWithVariants[][]>

  /**
   * Get the singleton highlighter.
   */
  getSingletonHighlighter: (options?: Partial<BundledHighlighterOptions<L, T>>) => Promise<HighlighterGeneric<L, T>>

  /**
   * Shorthand for `getLastGrammarState` with auto-loaded theme and language.
   * A singleton highlighter it maintained internally.
   */
  getLastGrammarState:
    | ((element: ThemedToken[][] | Root) => GrammarState)
    | ((code: string, options: CodeToTokensBaseOptions<L, T>) => Promise<GrammarState>)
}

export function makeSingletonHighlighter<L extends string, T extends string>(
  createHighlighter: CreateHighlighterFactory<L, T>,
): (options?: Partial<BundledHighlighterOptions<L, T>>) => Promise<HighlighterGeneric<L, T>> {
  let _shiki: ReturnType<typeof createHighlighter>

  async function getSingletonHighlighter(
    options: Partial<BundledHighlighterOptions<L, T>> = {},
  ): Promise<HighlighterGeneric<L, T>> {
    if (!_shiki) {
      _shiki = createHighlighter({
        ...options,
        themes: [],
        langs: [],
      })
      const s = await _shiki
      await Promise.all([
        s.loadTheme(...(options.themes as T[] || [])),
        s.loadLanguage(...(options.langs as L[] || [])),
      ])
      return s
    }
    else {
      const s = await _shiki
      await Promise.all([
        s.loadTheme(...(options.themes as T[] || [])),
        s.loadLanguage(...(options.langs as L[] || [])),
      ])
      return s
    }
  }

  return getSingletonHighlighter
}

export interface CreateSingletonShorthandsOptions<L extends string, T extends string> {
  /**
   * A custom function to guess embedded languages to be loaded.
   */
  guessEmbeddedLanguages?: (code: string, lang: string | undefined, highlighter: HighlighterGeneric<L, T>) => Awaitable<string[] | undefined>
}

export function createSingletonShorthands<L extends string, T extends string>(
  createHighlighter: CreateHighlighterFactory<L, T>,
  config?: CreateSingletonShorthandsOptions<L, T>,
): ShorthandsBundle<L, T> {
  const getSingletonHighlighter = makeSingletonHighlighter(createHighlighter)

  async function get(code: string, options: CodeToTokensOptions<L, T> | CodeToHastOptions<L, T>): Promise<HighlighterGeneric<L, T>> {
    const shiki = await getSingletonHighlighter({
      langs: [options.lang as L],
      themes: ('theme' in options ? [options.theme] : Object.values(options.themes)) as T[],
    })
    const langs = await config?.guessEmbeddedLanguages?.(code, options.lang, shiki) as L[]
    if (langs) {
      await shiki.loadLanguage(...langs)
    }
    return shiki
  }

  return {
    getSingletonHighlighter(options) {
      return getSingletonHighlighter(options)
    },

    async codeToHtml(code, options) {
      const shiki = await get(code, options)
      return shiki.codeToHtml(code, options)
    },

    async codeToHast(code, options) {
      const shiki = await get(code, options)
      return shiki.codeToHast(code, options)
    },

    async codeToTokens(code, options) {
      const shiki = await get(code, options)
      return shiki.codeToTokens(code, options)
    },

    async codeToTokensBase(code, options) {
      const shiki = await get(code, options)
      return shiki.codeToTokensBase(code, options)
    },

    async codeToTokensWithThemes(code, options) {
      const shiki = await get(code, options)
      return shiki.codeToTokensWithThemes(code, options)
    },

    async getLastGrammarState(code, options) {
      const shiki = await getSingletonHighlighter({
        langs: [options.lang as L],
        themes: [options.theme as T],
      })
      return shiki.getLastGrammarState(code, options)
    },
  }
}
