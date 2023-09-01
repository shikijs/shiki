import type { IGrammar, IRawGrammar, IRawTheme } from 'vscode-textmate'
import type { Element, Root } from 'hast'
import type { bundledThemes } from './themes'
import type { bundledLanguages } from './assets/langs'
import type { FontStyle } from './core/stackElementMetadata'
import type { OnigurumaLoadOptions } from './oniguruma'

export { IRawGrammar, IGrammar }

export type BuiltinLanguage = keyof typeof bundledLanguages
export type BuiltinTheme = keyof typeof bundledThemes

export type PlainTextLanguage = 'text' | 'plaintext' | 'txt'
export type AnsiLanguage = 'ansi'
export type SpecialLanguage = PlainTextLanguage | AnsiLanguage

export type Awaitable<T> = T | Promise<T>
export type MaybeGetter<T> = Awaitable<MaybeModule<T>> | (() => Awaitable<MaybeModule<T>>)
export type MaybeModule<T> = T | { default: T }
export type MaybeArray<T> = T | T[]
export type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export type ThemeInput = MaybeGetter<ThemeRegistration | ThemeRegistrationRaw>
export type LanguageInput = MaybeGetter<MaybeArray<LanguageRegistration>>

interface Nothing {}

/**
 * type StringLiteralUnion<'foo'> = 'foo' | string
 * This has auto completion whereas `'foo' | string` doesn't
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 */
export type StringLiteralUnion<T extends U, U = string> = T | (U & Nothing)

export type ResolveBundleKey<T extends string> = never extends T ? string : T

export interface ShikiContext {
  setTheme(name: string | ThemeRegistration | ThemeRegistrationRaw): {
    theme: ThemeRegistration
    colorMap: string[]
  }

  getTheme(name: string | ThemeRegistration | ThemeRegistrationRaw): ThemeRegistration
  getLangGrammar(name: string): IGrammar

  getLoadedThemes(): string[]
  getLoadedLanguages(): string[]
  loadLanguage(...langs: LanguageInput[]): Promise<void>
  loadTheme(...themes: ThemeInput[]): Promise<void>
}

export interface HighlighterGeneric<BundledLangKeys extends string, BundledThemeKeys extends string> {
  codeToHtml(
    code: string,
    options: CodeToHastOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ): string
  codeToThemedTokens(
    code: string,
    options: CodeToThemedTokensOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ): ThemedToken[][]
  codeToTokensWithThemes(
    code: string,
    options: CodeToTokensWithThemesOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ): [color: string, theme: string, tokens: ThemedToken[][]][]
  codeToHast(
    code: string,
    options: CodeToHastOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ): Root

  loadTheme(...themes: (ThemeInput | BundledThemeKeys)[]): Promise<void>
  loadLanguage(...langs: (LanguageInput | BundledLangKeys | SpecialLanguage)[]): Promise<void>

  getTheme(name: string | ThemeRegistration | ThemeRegistrationRaw): ThemeRegistration

  getLoadedLanguages(): string[]
  getLoadedThemes(): string[]
}

export interface HighlighterCoreOptions {
  themes?: ThemeInput[]
  langs?: LanguageInput[]
  loadWasm?: OnigurumaLoadOptions | (() => Promise<OnigurumaLoadOptions>)
}

export interface BundledHighlighterOptions<L extends string, T extends string> {
  /**
   * Theme registation
   *
   * @default []
   */
  themes?: (ThemeInput | StringLiteralUnion<T>)[]
  /**
   * Language registation
   *
   * @default Object.keys(bundledThemes)
   */
  langs?: (LanguageInput | StringLiteralUnion<L> | SpecialLanguage)[]
}

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

export interface CodeToThemedTokensOptions<Languages = string, Themes = string> {
  lang?: Languages | SpecialLanguage
  theme?: Themes | ThemeRegistration | ThemeRegistrationRaw
  /**
   * Include explanation of why a token is given a color.
   *
   * @default true
   */
  includeExplanation?: boolean
}

export interface CodeToHastOptionsCommon<Languages extends string = string> {
  lang: StringLiteralUnion<Languages | SpecialLanguage>
  /**
   * Transform the generated HAST tree.
   */
  transforms?: HastTransformers
}

export interface CodeToTokensWithThemesOptions<Languages = string, Themes = string> {
  lang?: Languages | SpecialLanguage

  /**
   * A map of color names to themes.
   *
   * `light` and `dark` are required, and arbitrary color names can be added.
   *
   * @example
   * ```ts
   * themes: {
   *   light: 'vitesse-light',
   *   dark: 'vitesse-dark',
   *   soft: 'nord',
   *   // custom colors
   * }
   * ```
   */
  themes: Partial<Record<string, Themes | ThemeRegistration | ThemeRegistrationRaw>>
}

export interface CodeOptionsSingleTheme<Themes extends string = string> {
  theme: ThemeRegistration | ThemeRegistrationRaw | StringLiteralUnion<Themes>
}

export interface CodeOptionsMultipleThemes<Themes extends string = string> {
  /**
   * A map of color names to themes.
   * This allows you to specify multiple themes for the generated code.
   *
   * ```ts
   * shiki.codeToHtml(code, {
   *  lang: 'js',
   *  themes: {
   *    light: 'vitesse-light',
   *    dark: 'vitesse-dark',
   *  }
   * })
   * ```
   *
   * Will generate:
   *
   * ```html
   * <span style="color:#111;--shiki-dark:#fff;">code</span>
   * ```
   *
   * @see https://github.com/antfu/shikiji#lightdark-dual-themes
   */
  themes: Partial<Record<string, ThemeRegistration | ThemeRegistrationRaw | StringLiteralUnion<Themes>>>

  /**
   * The default theme applied to the code (via inline `color` style).
   * The rest of the themes are applied via CSS variables, and toggled by CSS overrides.
   *
   * For example, if `defaultColor` is `light`, then `light` theme is applied to the code,
   * and the `dark` theme and other custom themes are applied via CSS variables:
   *
   * ```html
   * <span style="color:#{light};--shiki-dark:#{dark};--shiki-custom:#{custom};">code</span>
   * ```
   *
   * When set to `false`, no default styles will be applied, and totally up to users to apply the styles:
   *
   * ```html
   * <span style="--shiki-light:#{light};--shiki-dark:#{dark};--shiki-custom:#{custom};">code</span>
   * ```
   *
   *
   * @default 'light'
   */
  defaultColor?: StringLiteralUnion<'light' | 'dark'> | false

  /**
   * Prefix of CSS variables used to store the color of the other theme.
   *
   * @default '--shiki-'
   */
  cssVariablePrefix?: string
}

export type CodeOptionsThemes<Themes extends string = string> =
  | CodeOptionsSingleTheme<Themes>
  | CodeOptionsMultipleThemes<Themes>

export type CodeToHastOptions<Languages extends string = string, Themes extends string = string> =
  & CodeToHastOptionsCommon<Languages>
  & CodeOptionsThemes<Themes>

export interface ThemeRegistrationRaw extends IRawTheme {

}

export interface ThemeRegistration extends ThemeRegistrationRaw {
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

export interface HastTransformers {
  /**
   * Transform the entire generated HAST tree. Return a new Node will replace the original one.
   *
   * @param hast
   */
  root?: (hast: Root) => Root | void
  pre?: (hast: Element) => Element | void
  code?: (hast: Element) => Element | void
  /**
   * Transform each line element.
   *
   * @param hast
   * @param line 1-based line number
   */
  line?: (hast: Element, line: number) => Element | void
  token?: (hast: Element, line: number, col: number, lineElement: Element) => Element | void
}

export interface HtmlRendererOptions {
  langId?: string
  fg?: string
  bg?: string

  /**
   * Hast transformers
   */
  transforms?: HastTransformers

  themeName?: string

  /**
   * Custom style string to be applied to the root `<pre>` element.
   * When specified, `fg` and `bg` will be ignored.
   */
  rootStyle?: string

  /**
   * Merge token with only whitespace to the next token,
   * Saving a few extra `<span>`
   *
   * @default true
   */
  mergeWhitespaces?: boolean
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
   * Override with custom inline style for HTML renderer.
   * When specified, `color` will be ignored.
   */
  htmlStyle?: string
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
