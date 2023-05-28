import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { parseJson } from '../util/parse'

const GRAMMAR_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/grammars')
const VSCODE_EXTENSION_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/vscode/extensions')
const SCOPE_TO_DISPLAY_NAME_MAP_PATH = path.join(__dirname, '../..', 'tmp', 'displayNameMap.json')

/**
 * Collect display names from grammar files
 *
 * @example
 * ```js
 * const nameList = collectFromGrammarFiles()
 * [
 *   { id: 'go', scopeName: 'source.go', name: 'Go' },
 *   { id: 'lua', scopeName: 'source.lua', name: 'Lua' },
 * ]
 * ```
 */
async function collectGrammarNames() {
  const files = fs.readdirSync(GRAMMAR_FOLDER_PATH)
  const grammarList: { id: string; scopeName: string; name: string }[] = []
  for (let f of files) {
    const fPath = path.resolve(GRAMMAR_FOLDER_PATH, f)
    const parsedContent = parseJson(fs.readFileSync(fPath, 'utf-8'))
    if (!('scopeName' in parsedContent)) {
      console.log(`${chalk.red("'scopeName' not found in")} ${chalk.blue(f)}`)
      continue
    }
    if (!('name' in parsedContent)) {
      continue
    }
    grammarList.push({
      id: f.split('.')[0],
      scopeName: parsedContent.scopeName,
      name: parsedContent.name
    })
  }
  return grammarList
}

type LanguageExtensionJSON = {
  contributes: {
    /**
     * See https://code.visualstudio.com/api/references/contribution-points#contributes.languages
     */
    languages: {
      id: string
      aliases?: string[]
      extensions?: string[]
      filenames?: string[]
      firstLine?: string
      configuration?: string[]
    }[]
    /**
     * See https://code.visualstudio.com/api/references/contribution-points#contributes.grammars
     */
    grammars: {
      language?: string
      scopeName: string
      path: string
      embeddedLanguages?: unknown
    }[]
  }
}

/**
 * Collect language information from VSCode extensions
 *
 * @example
 * ```js
 * [
 *   {
 *     languageId: 'typescriptreact',
 *     alias: [ 'TypeScript JSX', 'TypeScript React', 'tsx' ],
 *     extensions: [ '.tsx' ],
 *     scopeName: 'source.tsx'
 *   },
 * ]
 * ```
 */
async function collectVscodeGrammars() {
  const files = fs.readdirSync(VSCODE_EXTENSION_FOLDER_PATH).filter(f => {
    const dirPath = path.resolve(VSCODE_EXTENSION_FOLDER_PATH, f, 'syntaxes')
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()
  })
  const grammarList: {
    languageId: string
    alias: string[]
    extensions: string[]
    scopeName: string
  }[] = []
  for (let f of files) {
    const packagePath = path.resolve(VSCODE_EXTENSION_FOLDER_PATH, f, 'package.json')
    if (!fs.existsSync(packagePath)) {
      console.log(`${chalk.red("'package.json' not found in")} ${chalk.blue(f)}`)
      continue
    }
    const parsedContent: LanguageExtensionJSON = parseJson(fs.readFileSync(packagePath, 'utf-8'))
    if (!('contributes' in parsedContent)) {
      console.log(`${chalk.red("'contributes' not found in")} ${chalk.blue(f)}`)
      continue
    }
    const availableGrammars = parsedContent.contributes.grammars.filter(g => g.language)
    for (const grammar of availableGrammars) {
      const language = parsedContent.contributes.languages.find(
        lang => lang.id === grammar.language
      )
      if (!language) {
        console.log(
          `${chalk.red(grammar.language)} ${chalk.blue('not found in')} ${chalk.blue(f)}}`
        )
        continue
      }
      grammarList.push({
        languageId: language.id,
        alias: language.aliases,
        extensions: language.extensions,
        scopeName: grammar.scopeName
      })
    }
  }
  return grammarList
}

async function collectDisplayNames() {
  const grammarNames = await collectGrammarNames()
  const vscodeGrammars = await collectVscodeGrammars()
  const scopeToDisplayNameMap: Record<string, string> = {}
  for (const grammarName of grammarNames) {
    scopeToDisplayNameMap[grammarName.scopeName] = grammarName.name
  }
  for (const g of vscodeGrammars) {
    if (!g.alias || g.alias.length === 0) {
      continue
    }
    // The first item of `contributes.languages.aliases` in the list
    // will be used as the human-readable label in the VS Code UI.
    const displayName = g.alias[0]
    if (
      g.scopeName in scopeToDisplayNameMap &&
      scopeToDisplayNameMap[g.scopeName] !== displayName
    ) {
      console.log(
        chalk.red('renamed'),
        chalk.blue(g.scopeName),
        'from',
        chalk.yellow(scopeToDisplayNameMap[g.scopeName]),
        'to',
        chalk.yellow(displayName)
      )
    }
    scopeToDisplayNameMap[g.scopeName] = displayName
  }
  fs.writeFileSync(SCOPE_TO_DISPLAY_NAME_MAP_PATH, JSON.stringify(scopeToDisplayNameMap, null, 2))
}

collectDisplayNames()
