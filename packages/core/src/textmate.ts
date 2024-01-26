// We re-bundled vscode-textmate from source to have ESM support.
// This file re-exports some runtime values we need.
export { Registry, INITIAL, StateStack } from '../vendor/vscode-textmate/src/main'
export type {
  IRawTheme,
  IRawGrammar,
  IGrammar,
  IGrammarConfiguration,
  IOnigLib,
  RegistryOptions,
} from '../vendor/vscode-textmate/src/main'
export type { IRawThemeSetting } from '../vendor/vscode-textmate/src/theme'
export * from './stack-element-metadata'
