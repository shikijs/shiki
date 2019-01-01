import * as path from 'path'

import { IRawGrammar } from 'vscode-textmate'

export interface ILanguageRegistration {
  id: string
  scopeName: string
  path: string
  aliases: string[]
  grammar?: IRawGrammar
}

const languageList: ILanguageRegistration[] = require('../languages.json')
languageList.forEach(l => {
  l.path = path.resolve(__dirname, '../', l.path)
})

/**
 * @description Grammars bundled with VS Code and:
 *   - Vue Gramar
 */
export const LANGUAGES = languageList

export { StackElementMetadata } from './stackElementMetadata'