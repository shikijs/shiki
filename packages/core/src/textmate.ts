import type { OnigScanner, OnigString } from '@shikijs/vscode-textmate'

export { Registry, INITIAL, StateStack, Theme } from '@shikijs/vscode-textmate'
export type {
  IRawTheme,
  IRawGrammar,
  IGrammar,
  IGrammarConfiguration,
  IOnigLib,
  IRawThemeSetting,
  StateStackImpl,
  RegistryOptions,
} from '@shikijs/vscode-textmate'
export * from './stack-element-metadata'

export interface PatternScanner extends OnigScanner {}

export interface RegexEngineString extends OnigString {}

/**
 * Engine for RegExp matching and scanning.
 */
export interface RegexEngine {
  createScanner: (patterns: string[]) => PatternScanner
  createString: (s: string) => RegexEngineString
}
