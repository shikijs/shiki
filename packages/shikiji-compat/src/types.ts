import type { BuiltinLanguage, BuiltinTheme, BundledHighlighterOptions, LanguageRegistration, LineOption, StringLiteralUnion, ThemeRegistration, ThemeRegistrationRaw } from 'shikiji'

export interface AnsiToHtmlOptions {
  theme?: StringLiteralUnion<BuiltinTheme>
  lineOptions?: LineOption[]
}

export interface HighlighterOptions extends BundledHighlighterOptions<BuiltinLanguage, BuiltinTheme> {
  theme?: BuiltinTheme
}

export type IThemeRegistration = ThemeRegistrationRaw | ThemeRegistration | StringLiteralUnion<BuiltinTheme>

export interface IShikiTheme extends ThemeRegistration {}

export interface ILanguageRegistration extends LanguageRegistration {}

export type Lang = StringLiteralUnion<BuiltinLanguage>
export type Theme = StringLiteralUnion<BuiltinTheme>
