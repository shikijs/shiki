import type {
  BuiltinLanguage,
  BuiltinTheme,
  BundledHighlighterOptions,
  CodeOptionsMultipleThemes,
  CodeOptionsSingleTheme,
  CodeToHastOptionsCommon,
  LanguageRegistration,
  RawGrammar,
  StringLiteralUnion,
  ThemedToken,
  ThemeRegistrationAny,
  ThemeRegistrationResolved,
} from 'shiki'

export interface LineOption {
  /**
   * 1-based line number.
   */
  line: number
  classes?: string[]
}

export interface OptionsOfLineOptions {
  lineOptions?: LineOption[]
}

export interface AnsiToHtmlOptions extends OptionsOfLineOptions {
  theme?: StringLiteralUnion<BuiltinTheme>
}

export interface HighlighterOptions extends BundledHighlighterOptions<BuiltinLanguage, BuiltinTheme> {
  theme?: BuiltinTheme
}

export type IThemeRegistration = ThemeRegistrationAny | StringLiteralUnion<BuiltinTheme>

export interface IShikiTheme extends ThemeRegistrationResolved {}
export interface IThemedToken extends ThemedToken {}
export interface IRawGrammar extends RawGrammar {}

export interface ILanguageRegistration extends LanguageRegistration {
  grammar?: IRawGrammar
}

export type Lang = StringLiteralUnion<BuiltinLanguage>
export type Theme = StringLiteralUnion<BuiltinTheme>

export type CodeToHtmlOptions = (
  | Partial<CodeOptionsSingleTheme<BuiltinTheme>>
  | Partial<CodeOptionsMultipleThemes<BuiltinTheme>>
)
& CodeToHastOptionsCommon<BuiltinLanguage>
& OptionsOfLineOptions

export type CodeToHtmlOptionsExtra =
  & Omit<CodeToHastOptionsCommon<BuiltinLanguage>, 'lang'>
  & OptionsOfLineOptions
