// We re-bundled vscode-textmate from source to have ESM support.
import type { OnigScanner, OnigString } from '../vendor/vscode-textmate/src/main'

// This file re-exports some runtime values we need.
export { Registry, INITIAL, StateStack } from '../vendor/vscode-textmate/src/main'
export { Theme } from '../vendor/vscode-textmate/src/theme'
export type {
  IRawTheme,
  IRawGrammar,
  IGrammar,
  IGrammarConfiguration,
  RegistryOptions,
} from '../vendor/vscode-textmate/src/main'
export type { IRawThemeSetting } from '../vendor/vscode-textmate/src/theme'
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
