import { IRawGrammar, IRawTheme, IRawThemeSetting } from 'vscode-textmate'
import { Lang } from './languages'
import { IThemedToken } from './themedTokenizer'
import { Theme } from './themes'

export interface HighlighterOptions {
  /**
   * The theme to load upfront.
   */
  theme?: IThemeRegistration

  /**
   * A list of themes to load upfront.
   *
   * Default to: `['dark-plus', 'light-plus']`
   */
  themes?: IThemeRegistration[]

  /**
   * A list of languages to load upfront.
   *
   * Default to `['html', 'css', 'javascript']`
   */
  langs?: (Lang | ILanguageRegistration)[]

  /**
   * Paths for loading themes and langs. Relative to the package's root.
   */
  paths?: IHighlighterPaths
}

export interface Highlighter {
  /**
   * Convert code to HTML tokens.
   * `lang` and `theme` must have been loaded.
   */
  codeToHtml(
    code: string,
    lang?: StringLiteralUnion<Lang>,
    theme?: StringLiteralUnion<Theme>
  ): string

  /**
   * Convert code to themed tokens for custom processing.
   * `lang` and `theme` must have been loaded.
   * You may customize the bundled HTML / SVG renderer or write your own
   * renderer for another render target.
   */
  codeToThemedTokens(
    code: string,
    lang?: StringLiteralUnion<Lang>,
    theme?: StringLiteralUnion<Theme>,
    options?: ThemedTokenizerOptions
  ): IThemedToken[][]

  /**
   * Get the loaded theme
   */
  getTheme(theme?: IThemeRegistration): IShikiTheme

  /**
   * Load a theme
   */
  loadTheme(theme: IThemeRegistration): Promise<void>

  /**
   * Load a language
   */
  loadLanguage(lang: ILanguageRegistration | Lang): Promise<void>

  /**
   * Get all loaded themes
   */
  getLoadedThemes(): Theme[]

  /**
   * Get all loaded languages
   */
  getLoadedLanguages(): Lang[]

  /**
   * Get the foreground color for theme. Can be used for CSS `color`.
   */
  getForegroundColor(theme?: StringLiteralUnion<Theme>): string

  /**
   * Get the background color for theme. Can be used for CSS `background-color`.
   */
  getBackgroundColor(theme?: StringLiteralUnion<Theme>): string

  // codeToRawHtml?(code: string): string
  // getRawCSS?(): string

  // codeToImage?(): string
}

export interface IHighlighterPaths {
  /**
   * @default 'themes/'
   */
  themes?: string

  /**
   * @default 'languages/'
   */
  languages?: string
}

export type ILanguageRegistration = {
  id: string
  scopeName: string
  aliases?: string[]
  samplePath?: string
  /**
   * A list of languages the current language embeds.
   * If manually specifying languages to load, make sure to load the embedded
   * languages for each parent language.
   */
  embeddedLangs?: Lang[]
} & (
  | {
      path: string
      grammar?: IRawGrammar
    }
  | {
      path?: string
      grammar: IRawGrammar
    }
)

export type IThemeRegistration = IShikiTheme | StringLiteralUnion<Theme>

export interface IShikiTheme extends IRawTheme {
  /**
   * @description theme name
   */
  name: string

  /**
   * @description light/dark theme
   */
  type: 'light' | 'dark'

  /**
   * @description tokenColors of the theme file
   */
  settings: IRawThemeSetting[]

  /**
   * @description text default foreground color
   */
  fg: string

  /**
   * @description text default background color
   */
  bg: string

  /**
   * @description relative path of included theme
   */
  include?: string

  /**
   *
   * @description color map of the theme file
   */
  colors?: Record<string, string>
}

/**
 * type StringLiteralUnion<'foo'> = 'foo' | string
 * This has auto completion whereas `'foo' | string` doesn't
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 */
export type StringLiteralUnion<T extends U, U = string> = T | (U & {})

export interface ThemedTokenizerOptions {
  /**
   * Whether to include explanation of each token's matching scopes and
   * why it's given its color. Default to false to reduce output verbosity.
   */
  includeExplanation?: boolean
}
