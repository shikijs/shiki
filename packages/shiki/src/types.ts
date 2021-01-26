import { IRawGrammar, IRawTheme, IRawThemeSetting } from 'vscode-textmate'
import { Lang } from './languages'
import { IThemedToken } from './themedTokenizer'
import { Theme } from './themes'

export interface HighlighterOptions {
  theme?: IThemeRegistration
  langs?: (Lang | ILanguageRegistration)[]
  themes?: IThemeRegistration[]
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
  loadTheme(theme: IThemeRegistration): Promise<void>
  loadLanguage(theme: ILanguageRegistration | Lang): Promise<void>

  getForegroundColor(theme?: StringLiteralUnion<Theme>): string
  getBackgroundColor(theme?: StringLiteralUnion<Theme>): string

  // codeToRawHtml?(code: string): string
  // getRawCSS?(): string

  // codeToImage?(): string
}

export interface IHighlighterPaths {
  themes?: string
  languages?: string
}

export interface ILanguageRegistration {
  id: string
  scopeName: string
  path: string
  aliases?: string[]
  grammar?: IRawGrammar
}

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
