import fs from 'fs'
import path from 'path'
import { vscodeGrammarsToRemove, vscodeGrammarsToRename } from '../grammarSources'
import chalk from 'chalk'
import { parseJson } from '../util/parse'

const GRAMMAR_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/grammars')

/**
 * Remove unneeded grammars
 */
let files = fs.readdirSync(GRAMMAR_FOLDER_PATH)
for (let f of files) {
  const fName = f.replace(/\.tmLanguage.json$/i, '')

  if (vscodeGrammarsToRemove.includes(fName)) {
    const fPath = path.resolve(GRAMMAR_FOLDER_PATH, f)
    fs.unlinkSync(fPath)
    console.log(`${chalk.red('removed')} ${chalk.blue(fPath)}`)
  }
}

/**
 * Rename some grammars
 */
files = fs.readdirSync(GRAMMAR_FOLDER_PATH)
for (let f of files) {
  const fPath = path.resolve(GRAMMAR_FOLDER_PATH, f)
  const fName = f.replace(/\.tmLanguage.json$/i, '')
  if (vscodeGrammarsToRename[fName]) {
    const fNewPath = path.resolve(
      GRAMMAR_FOLDER_PATH,
      vscodeGrammarsToRename[fName] + '.tmLanguage.json'
    )
    fs.renameSync(fPath, fNewPath)
    console.log(
      `${chalk.red('renamed')} ${chalk.blue(f)} to ${chalk.blue(
        vscodeGrammarsToRename[fName] + '.tmLanguage.json'
      )}`
    )
  }
}

/**
 * - Make sure each grammar's file name matches its `name` key
 */
files = fs.readdirSync(GRAMMAR_FOLDER_PATH)
for (let f of files) {
  normalizeGrammarFile(f)
}

function normalizeGrammarFile(f: string) {
  const fPath = path.resolve(GRAMMAR_FOLDER_PATH, f)
  const fNameWithoutSuffix = f.replace(/\.tmLanguage.json$/i, '')
  const fName = fNameWithoutSuffix.toLowerCase()

  if (fs.existsSync(fPath)) {
    const parsedContent = parseJson(fs.readFileSync(fPath, 'utf-8'))

    if (parsedContent.name !== fName) {
      parsedContent.name = fName
      fs.writeFileSync(fPath, JSON.stringify(parsedContent, null, 2))
      console.log(`${chalk.red('normalized')} ${f}'s \`name\` to ${chalk.yellow(fName)}`)
    }
    if (fNameWithoutSuffix !== fNameWithoutSuffix.toLowerCase()) {
      const fNewPath = path.resolve(
        GRAMMAR_FOLDER_PATH,
        fNameWithoutSuffix.toLowerCase() + '.tmLanguage.json'
      )
      fs.renameSync(fPath, fNewPath)
      console.log(`${chalk.red('renamed')} ${chalk.blue(f)} to ${chalk.blue(f.toLowerCase())}`)
    }
  }
}
