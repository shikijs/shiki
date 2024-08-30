import type { LoadWasmOptions } from '../types'
import type { RegexEngine } from '../textmate'
import type { StringLiteralUnion } from './utils'
import type { LanguageInput, SpecialLanguage } from './langs'
import type { SpecialTheme, ThemeInput, ThemeRegistrationAny } from './themes'
import type { TransformerOptions } from './transformers'
import type { TokenizeWithThemeOptions, TokensResult } from './tokens'
import type { DecorationOptions } from './decorations'

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
  loadWasm?: LoadWasmOptions
  /**
   * Emit console warnings to alert users of potential issues.
   * @default true
   */
  warnings?: boolean
  /**
   * Custom RegExp engine.
   */
  engine?: RegexEngine | Promise<RegexEngine>
}

export interface BundledHighlighterOptions<L extends string, T extends string> extends Pick<HighlighterCoreOptions, 'warnings' | 'engine'> {
  /**
   * Theme registation
   *
   * @default []
   */
  themes: (ThemeInput | StringLiteralUnion<T> | SpecialTheme)[]
  /**
   * Language registation
   *
   * @default []
   */
  langs: (LanguageInput | StringLiteralUnion<L> | SpecialLanguage)[]
  /**
   * Alias of languages
   * @example { 'my-lang': 'javascript' }
   */
  langAlias?: Record<string, StringLiteralUnion<L>>
}

export interface CodeOptionsSingleTheme<Themes extends string = string> {
  theme: ThemeRegistrationAny | StringLiteralUnion<Themes>
}

export interface CodeOptionsMultipleThemes<Themes extends string = string> {
  /**
   * A map of color names to themes.
   * This allows you to specify multiple themes for the generated code.
   *
   * ```ts
   * highlighter.codeToHtml(code, {
   *   lang: 'js',
   *   themes: {
   *     light: 'vitesse-light',
   *     dark: 'vitesse-dark',
   *   }
   * })
   * ```
   *
   * Will generate:
   *
   * ```html
   * <span style="color:#111;--shiki-dark:#fff;">code</span>
   * ```
   *
   * @see https://github.com/shikijs/shiki#lightdark-dual-themes
   */
  themes: Partial<Record<string, ThemeRegistrationAny | StringLiteralUnion<Themes>>>

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
  & CodeOptionsMeta

export interface CodeToHastOptionsCommon<Languages extends string = string>
  extends
  TransformerOptions,
  DecorationOptions,
  Pick<TokenizeWithThemeOptions, 'colorReplacements' | 'tokenizeMaxLineLength' | 'tokenizeTimeLimit' | 'grammarState' | 'grammarContextCode'> {

  lang: StringLiteralUnion<Languages | SpecialLanguage>

  /**
   * Merge whitespace tokens to saving extra `<span>`.
   *
   * When set to true, it will merge whitespace tokens with the next token.
   * When set to false, it keep the output as-is.
   * When set to `never`, it will force to separate leading and trailing spaces from tokens.
   *
   * @default true
   */
  mergeWhitespaces?: boolean | 'never'

  /**
   * The structure of the generated HAST and HTML.
   *
   * - `classic`: The classic structure with `<pre>` and `<code>` elements, each line wrapped with a `<span class="line">` element.
   * - `inline`: All tokens are rendered as `<span>`, line breaks are rendered as `<br>`. No `<pre>` or `<code>` elements. Default forground and background colors are not applied.
   *
   * @default 'classic'
   */
  structure?: 'classic' | 'inline'
}

export interface CodeOptionsMeta {
  /**
   * Meta data passed to Shiki, usually used by plugin integrations to pass the code block header.
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

export interface CodeToHastRenderOptionsCommon extends TransformerOptions, Omit<TokensResult, 'tokens'> {
  lang?: string
  langId?: string
}

export type CodeToHastRenderOptions = CodeToHastRenderOptionsCommon & CodeToHastOptions
