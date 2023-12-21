import type { Element, Root } from 'hast'
import type {
  IGrammar as Grammar,
  IRawThemeSetting,
  IRawGrammar as RawGrammar,
  IRawTheme as RawTheme,
} from './textmate'
import type { OnigurumaLoadOptions } from './oniguruma'

export {
  Grammar,
  RawGrammar,
  // TODO: remove these in the next major version
  Grammar as IGrammar,
  RawGrammar as IRawGrammar,
}

export enum FontStyle {
  NotSet = -1,
  None = 0,
  Italic = 1,
  Bold = 2,
  Underline = 4,
}

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

export type ResolveBundleKey<T extends string> = [T] extends [never] ? string : T

export interface ShikiInternal {
  setTheme(name: string | ThemeRegistration | ThemeRegistrationRaw): {
    theme: ThemeRegistration
    colorMap: string[]
  }

  getTheme(name: string | ThemeRegistration | ThemeRegistrationRaw): ThemeRegistration
  getLangGrammar(name: string): Grammar

  getLoadedThemes(): string[]
  getLoadedLanguages(): string[]
  loadLanguage(...langs: LanguageInput[]): Promise<void>
  loadTheme(...themes: ThemeInput[]): Promise<void>

  getAlias(): Record<string, string>
  updateAlias(alias: Record<string, string>): void
}

export interface HighlighterGeneric<BundledLangKeys extends string, BundledThemeKeys extends string> {
  /**
   * Get highlighted code in HTML string
   */
  codeToHtml(
    code: string,
    options: CodeToHastOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ): string
  /**
   * Get highlighted code in HAST.
   * @see https://github.com/syntax-tree/hast
   */
  codeToHast(
    code: string,
    options: CodeToHastOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ): Root
  /**
   * Get highlighted code in tokens.
   * @returns A 2D array of tokens, first dimension is lines, second dimension is tokens in a line.
   */
  codeToThemedTokens(
    code: string,
    options: CodeToThemedTokensOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ): ThemedToken[][]
  /**
   * Get highlighted code in tokens with multiple themes.
   *
   * Different from `codeToThemedTokens`, each token will have a `variants` property consisting of an object of color name to token styles.
   *
   * @returns A 2D array of tokens, first dimension is lines, second dimension is tokens in a line.
   */
  codeToTokensWithThemes(
    code: string,
    options: CodeToTokensWithThemesOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>
  ): ThemedTokenWithVariants[][]

  /**
   * Load a theme to the highlighter, so later it can be used synchronously.
   */
  loadTheme(...themes: (ThemeInput | BundledThemeKeys)[]): Promise<void>
  /**
   * Load a language to the highlighter, so later it can be used synchronously.
   */
  loadLanguage(...langs: (LanguageInput | BundledLangKeys | SpecialLanguage)[]): Promise<void>

  /**
   * Get the registered theme object
   */
  getTheme(name: string | ThemeRegistration | ThemeRegistrationRaw): ThemeRegistration
  /**
   * Get the registered language object
   */
  getLangGrammar(name: string | LanguageRegistration): Grammar

  /**
   * Set the current theme and get the resolved theme object and color map.
   * @internal
   */
  setTheme: ShikiInternal['setTheme']

  /**
   * Get the names of loaded languages
   *
   * Special-handled languages like `text`, `plain` and `ansi` are not included.
   */
  getLoadedLanguages(): string[]
  /**
   * Get the names of loaded themes
   */
  getLoadedThemes(): string[]

  /**
   * Get internal context object
   * @internal
   * @deprecated
   */
  getInternalContext(): ShikiInternal
}

export interface HighlighterCoreOptions {
  /**
   * Theme names, or theme registration objects to be loaded upfront.
   */
  themes?: ThemeInput[]
  /**
   * Language names, or language registration objects to be loaded upfront.
   */
  langs?: LanguageInput[]
  /**
   * Alias of languages
   * @example { 'my-lang': 'javascript' }
   */
  langAlias?: Record<string, string>
  /**
   * Load wasm file from a custom path or using a custom function.
   */
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
  /**
   * Alias of languages
   * @example { 'my-lang': 'javascript' }
   */
  langAlias?: Record<string, StringLiteralUnion<L>>
}

export interface LanguageRegistration extends RawGrammar {
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

  foldingStopMarker?: string
  foldingStartMarker?: string

  /**
   * Inject this language to other scopes.
   * Same as `injectTo` in VSCode's `contributes.grammars`.
   *
   * @see https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide#injection-grammars
   */
  injectTo?: string[]
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

export interface CodeToHastOptionsCommon<Languages extends string = string> extends TransformerOptions {
  lang: StringLiteralUnion<Languages | SpecialLanguage>

  /**
   * Merge token with only whitespace to the next token,
   * Saving a few extra `<span>`
   *
   * @default true
   */
  mergeWhitespaces?: boolean
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

export interface CodeOptionsMeta {
  /**
   * Meta data passed to Shikiji, usually used by plugin integrations to pass the code block header.
   *
   * Key values in meta will be serialized to the attributes of the root `<pre>` element.
   *
   * Keys starting with `_` will be ignored.
   *
   * A special key `__raw` key will be used to pass the raw code block header (if the integration supports it).
   */
  meta?: {
    /**
     * Raw string of the code block header.
     */
    __raw?: string
    [key: string]: any
  }
}

export interface TransformerOptions {
  /**
   * Transform the generated HAST tree.
   */
  transformers?: ShikijiTransformer[]

  /**
   * @deprecated use `transformers` instead
   */
  transforms?: ShikijiTransformer
}

export type CodeToHastOptions<Languages extends string = string, Themes extends string = string> =
  & CodeToHastOptionsCommon<Languages>
  & CodeOptionsThemes<Themes>
  & CodeOptionsMeta

export interface ThemeRegistrationRaw extends RawTheme {}

export interface ThemeRegistration extends ThemeRegistrationRaw {
  /**
   * Theme name
   */
  name: string

  /**
   * Display name
   */
  displayName?: string

  /**
   * Light/dark theme
   */
  type: 'light' | 'dark'

  /**
   * TokenColors of the theme file
   */
  settings: IRawThemeSetting[]

  /**
   * Text default foreground color
   */
  fg: string

  /**
   * Text default background color
   */
  bg: string

  /**
   * Relative path of included theme
   */
  include?: string

  /**
   * Color map of the theme file
   */
  colors?: Record<string, string>

  tokenColors?: any[]
  semanticHighlighting?: boolean
  semanticTokenColors?: any[]
}

export interface ShikijiTransformerContextMeta {}

export interface ShikijiTransformerContextCommon {
  meta: ShikijiTransformerContextMeta
  codeToHast: (code: string, options: CodeToHastOptions) => Root
}

export interface ShikijiTransformerContext extends ShikijiTransformerContextCommon {
  readonly tokens: ThemedToken[][]
  readonly options: CodeToHastOptions
  readonly root: Root
  readonly pre: Element
  readonly code: Element
  readonly lines: Element[]
}

export interface ShikijiTransformer {
  /**
   * Name of the transformer
   */
  name?: string
  /**
   * Transform the entire generated HAST tree. Return a new Node will replace the original one.
   */
  root?(this: ShikijiTransformerContext, hast: Root): Root | void
  /**
   * Transform the `<pre>` element. Return a new Node will replace the original one.
   */
  pre?(this: ShikijiTransformerContext, hast: Element): Element | void
  /**
   * Transform the `<code>` element. Return a new Node will replace the original one.
   */
  code?(this: ShikijiTransformerContext, hast: Element): Element | void
  /**
   * Transform each line `<span class="line">` element.
   *
   * @param hast
   * @param line 1-based line number
   */
  line?(this: ShikijiTransformerContext, hast: Element, line: number): Element | void
  /**
   * Transform each token `<span>` element.
   */
  token?(this: ShikijiTransformerContext, hast: Element, line: number, col: number, lineElement: Element): Element | void

  /**
   * Transform the raw input code before passing to the highlighter.
   * This hook will only be called with `codeToHtml`.
   */
  preprocess?(this: ShikijiTransformerContextCommon, code: string, options: CodeToHastOptions): string | void

  /**
   * Transform the generated HTML string before returning.
   * This hook will only be called with `codeToHtml`.
   */
  postprocess?(this: ShikijiTransformerContextCommon, code: string, options: CodeToHastOptions): string | void
}

export interface HtmlRendererOptionsCommon extends TransformerOptions {
  lang?: string
  langId?: string
  fg?: string
  bg?: string

  themeName?: string

  /**
   * Custom style string to be applied to the root `<pre>` element.
   * When specified, `fg` and `bg` will be ignored.
   */
  rootStyle?: string
}

export type HtmlRendererOptions = HtmlRendererOptionsCommon & CodeToHastOptions

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
export interface ThemedToken extends TokenStyles, TokenBase {}

export interface TokenBase {
  /**
   * The content of the token
   */
  content: string
  /**
   * Explanation of
   *
   * - token text's matching scopes
   * - reason that token text is given a color (one matching scope matches a rule (scope -> color) in the theme)
   */
  explanation?: ThemedTokenExplanation[]
}

export interface TokenStyles {
  /**
   * 6 or 8 digit hex code representation of the token's color
   */
  color?: string
  /**
   * Font style of token. Can be None/Italic/Bold/Underline
   */
  fontStyle?: FontStyle
  /**
   * Override with custom inline style for HTML renderer.
   * When specified, `color` and `fontStyle` will be ignored.
   */
  htmlStyle?: string
}

export interface ThemedTokenWithVariants extends TokenBase {
  /**
   * An object of color name to token styles
   */
  variants: Record<string, TokenStyles>
}

export type DynamicImportLanguageRegistration = () => Promise<{ default: LanguageRegistration[] }>
export type DynamicImportThemeRegistration = () => Promise<{ default: ThemeRegistration }>

export interface BundledLanguageInfo {
  id: string
  name: string
  import: DynamicImportLanguageRegistration
  aliases?: string[]
}

export interface BundledThemeInfo {
  id: string
  displayName: string
  type: 'light' | 'dark'
  import: DynamicImportThemeRegistration
}

export {}
