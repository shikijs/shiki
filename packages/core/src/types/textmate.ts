import type {
  IGrammar as Grammar,
  IRawGrammar as RawGrammar,
  IRawTheme as RawTheme,
  IRawThemeSetting as RawThemeSetting,
} from '../textmate'

export type {
  Grammar,
  RawGrammar,
  RawTheme,
  RawThemeSetting,

  /**
   * @deprecated Renamed to `Grammar`
   */
  Grammar as IGrammar,
  /**
   * @deprecated Renamed to `RawGrammar`
   */
  RawGrammar as IRawGrammar,
}
