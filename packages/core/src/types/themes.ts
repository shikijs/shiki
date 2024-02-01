import type { RawTheme, RawThemeSetting } from './textmate'
import type { MaybeGetter } from './utils'

export type SpecialTheme = 'none'

export type ThemeInput = MaybeGetter<ThemeRegistrationAny>

export interface ThemeRegistrationRaw extends RawTheme, Partial<Omit<ThemeRegistration, 'name' | 'settings'>> {}

export interface ThemeRegistration extends Partial<ThemeRegistrationResolved> {}

export interface ThemeRegistrationResolved extends RawTheme {
  /**
   * Theme name
   */
  name: string

  /**
   * Display name
   *
   * @field shiki custom property
   */
  displayName?: string

  /**
   * Light/dark theme
   *
   * @field shiki custom property
   */
  type: 'light' | 'dark'

  /**
   * Token rules
   */
  settings: RawThemeSetting[]

  /**
   * Same as `settings`, will use as fallback if `settings` is not present.
   */
  tokenColors?: RawThemeSetting[]

  /**
   * Default foreground color
   *
   * @field shiki custom property
   */
  fg: string

  /**
   * Background color
   *
   * @field shiki custom property
   */
  bg: string

  /**
   * A map of color names to new color values.
   *
   * The color key starts with '#' and should be lowercased.
   *
   * @field shiki custom property
   */
  colorReplacements?: Record<string, string>

  /**
   * Color map of VS Code options
   *
   * Will be used by shiki on `lang: 'ansi'` to find ANSI colors, and to find the default foreground/background colors.
   */
  colors?: Record<string, string>

  /**
   * JSON schema path
   *
   * @field not used by shiki
   */
  $schema?: string

  /**
   * Enable semantic highlighting
   *
   * @field not used by shiki
   */
  semanticHighlighting?: boolean

  /**
   * Tokens for semantic highlighting
   *
   * @field not used by shiki
   */
  semanticTokenColors?: Record<string, string>
}

export type ThemeRegistrationAny = ThemeRegistrationRaw | ThemeRegistration | ThemeRegistrationResolved

export type DynamicImportThemeRegistration = () => Promise<{ default: ThemeRegistration }>

export interface BundledThemeInfo {
  id: string
  displayName: string
  type: 'light' | 'dark'
  import: DynamicImportThemeRegistration
}
