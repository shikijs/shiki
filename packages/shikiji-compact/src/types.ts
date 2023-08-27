import type { BuiltinLanguage, BuiltinTheme, BundledHighlighterOptions, LanguageRegistration, LineOption, StringLiteralUnion, ThemeRegistration } from 'shikiji'

export interface AnsiToHtmlOptions {
  theme?: StringLiteralUnion<BuiltinTheme>
  lineOptions?: LineOption[]
}

export interface HighlighterOptions extends BundledHighlighterOptions<BuiltinLanguage, BuiltinTheme> {
  theme?: BuiltinTheme
}

export interface IThemeRegistration extends ThemeRegistration {}

export interface ILanguageRegistration extends LanguageRegistration {}

export type Lang = StringLiteralUnion<BuiltinLanguage>
export type Theme = StringLiteralUnion<BuiltinTheme>
