import type { Root } from 'hast'
import type { Grammar } from './textmate'
import type { LanguageInput, LanguageRegistration, ResolveBundleKey, SpecialLanguage } from './langs'
import type { SpecialTheme, ThemeInput, ThemeRegistrationAny, ThemeRegistrationResolved } from './themes'
import type { CodeToTokensBaseOptions, CodeToTokensOptions, CodeToTokensWithThemesOptions, ThemedToken, ThemedTokenWithVariants, TokensResult } from './tokens'
import type { CodeToHastOptions } from './options'

/**
 * Internal context of Shiki, core textmate logic
 */
export interface ShikiInternal<BundledLangKeys extends string = never, BundledThemeKeys extends string = never> {
  /**
   * Load a theme to the highlighter, so later it can be used synchronously.
   */
  loadTheme: (...themes: (ThemeInput | BundledThemeKeys | SpecialTheme)[]) => Promise<void>
  /**
   * Load a language to the highlighter, so later it can be used synchronously.
   */
  loadLanguage: (...langs: (LanguageInput | BundledLangKeys | SpecialLanguage)[]) => Promise<void>

  /**
   * Get the registered theme object
   */
  getTheme: (name: string | ThemeRegistrationAny) => ThemeRegistrationResolved
  /**
   * Get the registered language object
   */
  getLanguage: (name: string | LanguageRegistration) => Grammar

  /**
   * Set the current theme and get the resolved theme object and color map.
   * @internal
   */
  setTheme: (themeName: string | ThemeRegistrationAny) => {
    theme: ThemeRegistrationResolved
    colorMap: string[]
  }

  /**
   * Get the names of loaded languages
   *
   * Special-handled languages like `text`, `plain` and `ansi` are not included.
   */
  getLoadedLanguages: () => string[]
  /**
   * Get the names of loaded themes
   *
   * Special-handled themes like `none` are not included.
   */
  getLoadedThemes: () => string[]
  /**
   * Dispose the internal registry and release resources
   */
  dispose: () => void
  /**
   * Dispose the internal registry and release resources
   */
  [Symbol.dispose]: () => void
}

/**
 * Generic instance interface of Shiki
 */
export interface HighlighterGeneric<BundledLangKeys extends string, BundledThemeKeys extends string>
  extends ShikiInternal<BundledLangKeys, BundledThemeKeys> {
  /**
   * Get highlighted code in HTML string
   */
  codeToHtml: (
    code: string,
    options: CodeToHastOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ) => string
  /**
   * Get highlighted code in HAST.
   * @see https://github.com/syntax-tree/hast
   */
  codeToHast: (
    code: string,
    options: CodeToHastOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ) => Root
  /**
   * Get highlighted code in tokens. Uses `codeToTokensWithThemes` or `codeToTokensBase` based on the options.
   */
  codeToTokens: (
    code: string,
    options: CodeToTokensOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ) => TokensResult
  /**
   * Get highlighted code in tokens with a single theme.
   * @returns A 2D array of tokens, first dimension is lines, second dimension is tokens in a line.
   */
  codeToTokensBase: (
    code: string,
    options: CodeToTokensBaseOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ) => ThemedToken[][]
  /**
   * Get highlighted code in tokens with multiple themes.
   *
   * Different from `codeToTokensBase`, each token will have a `variants` property consisting of an object of color name to token styles.
   *
   * @returns A 2D array of tokens, first dimension is lines, second dimension is tokens in a line.
   */
  codeToTokensWithThemes: (
    code: string,
    options: CodeToTokensWithThemesOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ) => ThemedTokenWithVariants[][]

  /**
   * Get internal context object
   * @internal
   * @deprecated
   */
  getInternalContext: () => ShikiInternal
}

/**
 * The fine-grained core Shiki highlighter instance.
 */
export type HighlighterCore = HighlighterGeneric<never, never>
