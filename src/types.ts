import type { IRawGrammar, IRawTheme } from 'vscode-textmate'
import type { bundledLanguages } from './langs'
import type { bundledThemes } from './themes'
import type { FontStyle } from './core/stackElementMetadata'

export type BuiltinLanguages = keyof typeof bundledLanguages
export type BuiltinThemes = keyof typeof bundledThemes

export type PlainTextLanguage = 'text' | 'plaintext' | 'txt'

export type Awaitable<T> = T | Promise<T>
export type MaybeGetter<T> = Awaitable<MaybeModule<T>> | (() => Awaitable<MaybeModule<T>>)
export type MaybeModule<T> = T | { default: T }
export type MaybeArray<T> = T | T[]
export type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export type ThemeInput = MaybeGetter<ThemeRegisteration | ThemeRegisterationRaw>
export type LanguageInput = MaybeGetter<MaybeArray<LanguageRegistration>>

interface Nothing {}

/**
 * type StringLiteralUnion<'foo'> = 'foo' | string
 * This has auto completion whereas `'foo' | string` doesn't
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 */
export type StringLiteralUnion<T extends U, U = string> = T | (U & Nothing)

export interface LanguageRegistration extends IRawGrammar {
  name: string
  scopeName: string
  displayName?: string
  aliases?: string[]
  /**
   * A list of languages the current language embeds.
   * If manually specifying languages to load, make sure to load the embedded
   * languages for each parent language.
   */
  embeddedLangs?: string[]
  balancedBracketSelectors?: string[]
  unbalancedBracketSelectors?: string[]
}

export interface CodeToHtmlOptions<Languages = string, Themes = string> {
  lang?: Languages | PlainTextLanguage
  theme?: Themes
  lineOptions?: LineOption[]
}

export interface CodeToHtmlDualThemesOptions<Languages = string, Themes = string> {
  lang?: Languages | PlainTextLanguage
  theme: {
    light: Themes
    dark: Themes
  }
  /**
   * @default 'light'
   */
  defaultColor?: 'light' | 'dark'
  /**
   * @default '--shiki-dark'
   */
  cssVariableName?: string
  lineOptions?: LineOption[]
}

export interface CodeToThemedTokensOptions<Languages = string, Themes = string> {
  lang?: Languages | PlainTextLanguage
  theme?: Themes
  /**
   * Include explanation of why a token is given a color.
   *
   * @default true
   */
  includeExplanation?: boolean
}

export interface LineOption {
  /**
   * 1-based line number.
   */
  line: number
  classes?: string[]
}

export interface ThemeRegisterationRaw extends IRawTheme {

}

export interface ThemeRegisteration extends ThemeRegisterationRaw {
  /**
   * @description theme name
   */
  name: string

  /**
   * @description light/dark theme
   */
  type: 'light' | 'dark' | 'css'

  /**
   * @description tokenColors of the theme file
   */
  settings: any[]

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

export interface HtmlRendererOptions {
  langId?: string
  fg?: string
  bg?: string
  lineOptions?: LineOption[]
  elements?: ElementsOptions
  themeName?: string
}

export interface ElementsOptions {
  pre?: (props: PreElementProps) => string
  code?: (props: CodeElementProps) => string
  line?: (props: LineElementProps) => string
  token?: (props: TokenElementProps) => string
}

interface ElementProps {
  children: string
  [key: string]: unknown
}

interface PreElementProps extends ElementProps {
  className: string
  style: string
}

interface CodeElementProps extends ElementProps {}

interface LineElementProps extends ElementProps {
  className: string
  lines: ThemedToken[][]
  line: ThemedToken[]
  index: number
}

interface TokenElementProps extends ElementProps {
  style: string
  tokens: ThemedToken[]
  token: ThemedToken
  index: number
}

export interface ThemedTokenScopeExplanation {
  scopeName: string
  themeMatches: any[]
}

export interface ThemedTokenExplanation {
  content: string
  scopes: ThemedTokenScopeExplanation[]
}

/**
 * A single token with color, and optionally with explanation.
 *
 * For example:
 *
 * {
 *   "content": "shiki",
 *   "color": "#D8DEE9",
 *   "explanation": [
 *     {
 *       "content": "shiki",
 *       "scopes": [
 *         {
 *           "scopeName": "source.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.objectliteral.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.object.member.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.array.literal.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "variable.other.object.js",
 *           "themeMatches": [
 *             {
 *               "name": "Variable",
 *               "scope": "variable.other",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             },
 *             {
 *               "name": "[JavaScript] Variable Other Object",
 *               "scope": "source.js variable.other.object",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 */
export interface ThemedToken {
  /**
   * The content of the token
   */
  content: string
  /**
   * 6 or 8 digit hex code representation of the token's color
   */
  color?: string
  /**
   * Font style of token. Can be None/Italic/Bold/Underline
   */
  fontStyle?: FontStyle
  /**
   * Explanation of
   *
   * - token text's matching scopes
   * - reason that token text is given a color (one matching scope matches a rule (scope -> color) in the theme)
   */
  explanation?: ThemedTokenExplanation[]
}

export {}
