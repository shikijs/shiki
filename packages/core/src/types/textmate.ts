import type {
  IGrammar,
  IRawGrammar as RawGrammar,
  IRawTheme as RawTheme,
  IRawThemeSetting as RawThemeSetting,
} from '@shikijs/vscode-textmate'

export type {
  RawGrammar,
  RawTheme,
  RawThemeSetting,
}

export interface Grammar extends IGrammar {
  name: string
}
