import { IRawGrammar, IRawTheme, IRawThemeSetting } from 'vscode-textmate'
import { Lang } from './languages'
import { IThemedToken } from './themedTokenizer'
import { Theme } from './themes'

export interface HighlighterOptions {
  theme?: IThemeRegistration
  langs?: (Lang | ILanguageRegistration)[]
  themes?: IThemeRegistration[]
  /**
   * Paths for loading themes and langs. Relative to the package's root.
   */
  paths?: IHighlighterPaths
}

export interface Highlighter {
  codeToThemedTokens(
    code: string,
    lang?: StringLiteralUnion<Lang>,
    theme?: StringLiteralUnion<Theme>,
    options?: ThemedTokenizerOptions
  ): IThemedToken[][]
  codeToHtml(
    code: string,
    lang?: StringLiteralUnion<Lang>,
    theme?: StringLiteralUnion<Theme>
  ): string
  getTheme(theme: IThemeRegistration): IShikiTheme
  loadTheme(theme: IThemeRegistration): Promise<void>
  loadLanguage(lang: ILanguageRegistration | Lang): Promise<void>

  /**
   * Get all loaded themes
   */
  getLoadedThemes(): Theme[]
  /**
   * Get all loaded languages
   */
  getLoadedLanguages(): Lang[]

  getForegroundColor(theme?: StringLiteralUnion<Theme>): string
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
  name?: string

  /**
   * tokenColors of the theme file
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
   * @private
   * Make public with API to consume `colorMap`
   * @description color map of the theme file
   */
  colors?: Record<string, string>
}

/**
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 * Since `string | 'foo'` doesn't offer auto completion
 */
export type StringLiteralUnion<T extends U, U = string> = T | (U & {})

export interface ThemedTokenizerOptions {
  /**
   * Whether to include explanation of each token's matching scopes
   * and why it's given its color. Default to false.
   */
  includeExplanation?: boolean
}
