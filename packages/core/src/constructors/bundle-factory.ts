import type {
  Awaitable,
  BundledHighlighterOptions,
  CodeToHastOptions,
  CodeToTokensBaseOptions,
  CodeToTokensOptions,
  CodeToTokensWithThemesOptions,
  CreatedBundledHighlighterOptions,
  CreateHighlighterFactory,
  GrammarState,
  HighlighterCoreOptions,
  HighlighterGeneric,
  LanguageInput,
  RegexEngine,
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

import { createOnigurumaEngine } from '../engines/oniguruma'
import { isSpecialLang, isSpecialTheme } from '../utils'
import { warnDeprecated } from '../warn'
import { createHighlighterCore } from './highlighter'

/**
 * Create a `createHighlighter` function with bundled themes, languages, and engine.
 *
 * @example
 * ```ts
 * const createHighlighter = createdBundledHighlighter({
 *   langs: {
 *     typescript: () => import('shiki/langs/typescript.mjs'),
 *     // ...
 *   },
 *   themes: {
 *     nord: () => import('shiki/themes/nord.mjs'),
 *     // ...
 *   },
 *   engine: () => createOnigurumaEngine(), // or createJavaScriptRegexEngine()
 * })
 * ```
 *
 * @param options
 */
export function createdBundledHighlighter<BundledLangs extends string, BundledThemes extends string>(
  options: CreatedBundledHighlighterOptions<BundledLangs, BundledThemes>
): CreateHighlighterFactory<BundledLangs, BundledThemes>

/**
 * Create a `createHighlighter` function with bundled themes and languages.
 *
 * @deprecated Use `createdBundledHighlighter({ langs, themes, engine })` signature instead.
 */
export function createdBundledHighlighter<BundledLangs extends string, BundledThemes extends string>(
  bundledLanguages: Record<BundledLangs, LanguageInput>,
  bundledThemes: Record<BundledThemes, ThemeInput>,
  loadWasm: HighlighterCoreOptions['loadWasm'],
): CreateHighlighterFactory<BundledLangs, BundledThemes>

// Implementation
export function createdBundledHighlighter<BundledLangs extends string, BundledThemes extends string>(
  arg1: Record<BundledLangs, LanguageInput> | CreatedBundledHighlighterOptions<BundledLangs, BundledThemes>,
  arg2?: Record<BundledThemes, ThemeInput>,
  arg3?: HighlighterCoreOptions['loadWasm'],
): CreateHighlighterFactory<BundledLangs, BundledThemes> {
  let bundledLanguages: Record<BundledLangs, LanguageInput>
  let bundledThemes: Record<BundledThemes, ThemeInput>
  let engine: () => Awaitable<RegexEngine>

  if (arg2) {
    warnDeprecated('`createdBundledHighlighter` signature with `bundledLanguages` and `bundledThemes` is deprecated. Use the options object signature instead.')
    bundledLanguages = arg1 as Record<BundledLangs, LanguageInput>
    bundledThemes = arg2
    engine = () => createOnigurumaEngine(arg3)
  }
  else {
    const options = arg1 as CreatedBundledHighlighterOptions<BundledLangs, BundledThemes>
    bundledLanguages = options.langs
    bundledThemes = options.themes
    engine = options.engine
  }

  async function createHighlighter(
    options: BundledHighlighterOptions<BundledLangs, BundledThemes>,
  ): Promise<HighlighterGeneric<BundledLangs, BundledThemes>> {
    function resolveLang(lang: LanguageInput | BundledLangs | SpecialLanguage): LanguageInput {
      if (typeof lang === 'string') {
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
        themes: options.themes || [],
        langs: options.langs || [],
      })
      return _shiki
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

export function createSingletonShorthands<L extends string, T extends string >(
  createHighlighter: CreateHighlighterFactory<L, T>,
): ShorthandsBundle<L, T> {
  const getSingletonHighlighter = makeSingletonHighlighter(createHighlighter)

  return {
    getSingletonHighlighter(options) {
      return getSingletonHighlighter(options)
    },

    async codeToHtml(code, options) {
      const shiki = await getSingletonHighlighter({
        langs: [options.lang as L],
        themes: ('theme' in options ? [options.theme] : Object.values(options.themes)) as T[],
      })
      return shiki.codeToHtml(code, options)
    },

    async codeToHast(code, options) {
      const shiki = await getSingletonHighlighter({
        langs: [options.lang as L],
        themes: ('theme' in options ? [options.theme] : Object.values(options.themes)) as T[],
      })
      return shiki.codeToHast(code, options)
    },

    async codeToTokens(code, options) {
      const shiki = await getSingletonHighlighter({
        langs: [options.lang as L],
        themes: ('theme' in options ? [options.theme] : Object.values(options.themes)) as T[],
      })
      return shiki.codeToTokens(code, options)
    },

    async codeToTokensBase(code, options) {
      const shiki = await getSingletonHighlighter({
        langs: [options.lang as L],
        themes: [options.theme as T],
      })
      return shiki.codeToTokensBase(code, options)
    },

    async codeToTokensWithThemes(code, options) {
      const shiki = await getSingletonHighlighter({
        langs: [options.lang as L],
        themes: Object.values(options.themes).filter(Boolean) as T[],
      })
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
