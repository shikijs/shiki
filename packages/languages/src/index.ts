import { IRawGrammar } from 'vscode-textmate'

export interface ILanguageRegistration {
  id: string
  scopeName: string
  path: string
  aliases?: string[]
  grammar?: IRawGrammar
}

export { Lang, languages } from './lang'
