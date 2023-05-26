import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { parseJson } from '../util/parse'

const GRAMMAR_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/grammars')
const VSCODE_EXTENSION_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/vscode/extensions')
const DISPLAY_NAME_MAP_PATH = path.join(__dirname, '../..', 'tmp', 'displayNameMap.json')

async function collectFromGrammarFiles() {
  const files = fs.readdirSync(GRAMMAR_FOLDER_PATH)
  const nameList: { id: string; scopeName: string; name: string }[] = []
  for (let f of files) {
    const fPath = path.resolve(GRAMMAR_FOLDER_PATH, f)
    if (!fs.existsSync(fPath)) {
      console.log(`${chalk.red("'file not found in")} ${chalk.blue(f)}`)
      return
    }
    const parsedContent = parseJson(fs.readFileSync(fPath, 'utf-8'))
    if (!('scopeName' in parsedContent)) {
      console.log(`${chalk.red("'scopeName' not found in")} ${chalk.blue(f)}`)
      continue
    }
    if (!('name' in parsedContent)) {
      continue
    }
    nameList.push({
      id: f.split('.')[0],
      scopeName: parsedContent.scopeName,
      name: parsedContent.name
    })
  }
  return nameList
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

async function collectFromVscodeExtensions() {
  const files = fs
    .readdirSync(VSCODE_EXTENSION_FOLDER_PATH)
    // .filter(f => fs.lstatSync(path.resolve(VSCODE_EXTENSION_FOLDER_PATH, f)).isDirectory())
    .filter(f => {
      const dirPath = path.resolve(VSCODE_EXTENSION_FOLDER_PATH, f, 'syntaxes')
      return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()
    })
  const nameList: {
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
      nameList.push({
        languageId: language.id,
        alias: language.aliases,
        extensions: language.extensions,
        scopeName: grammar.scopeName
      })
    }
  }
  return nameList
}

async function collectDisplayname() {
  const grammarNames = await collectFromGrammarFiles()
  const languageData = await collectFromVscodeExtensions()
  const displayNameMap: Record<string, string> = {}
  for (const grammarName of grammarNames) {
    displayNameMap[grammarName.scopeName] = grammarName.name
  }
  for (const language of languageData) {
    if (!language.alias || language.alias.length === 0) {
      continue
    }
    const displayName = language.alias[0]
    if (
      language.scopeName in displayNameMap &&
      displayNameMap[language.scopeName] !== language.languageId
    ) {
      console.log(
        'override',
        language.scopeName,
        'from',
        displayNameMap[language.scopeName],
        'to',
        displayName
      )
    }
    displayNameMap[language.scopeName] = displayName
  }
  fs.writeFileSync(DISPLAY_NAME_MAP_PATH, JSON.stringify(displayNameMap, null, 2))
}

collectDisplayname()
