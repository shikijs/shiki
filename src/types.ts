import type { IGrammar, IRawTheme } from 'vscode-textmate'
import type { languages } from './vendor/langs'
import type { themes } from './vendor/themes'
import type { IThemedToken } from './themedTokenizer'

export type BuiltinLanguages = keyof typeof languages
export type BuiltinThemes = keyof typeof themes

export type Awaitable<T> = T | Promise<T>
export type MaybeGetter<T> = T | (() => Awaitable<T>)

export type ThemeInput = MaybeGetter<ThemeRegisteration | ThemeRegisteration>
export type LanguageInput = MaybeGetter<LanguageRegistration>

export interface LanguageRegistration {
  id: string
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
  grammar?: IGrammar
}

export interface CodeToHtmlOptions {
  lang?: string
  theme?: string
  lineOptions?: LineOption[]
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
  lines: IThemedToken[][]
  line: IThemedToken[]
  index: number
}

interface TokenElementProps extends ElementProps {
  style: string
  tokens: IThemedToken[]
  token: IThemedToken
  index: number
}
