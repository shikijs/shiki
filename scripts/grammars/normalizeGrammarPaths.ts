import fs from 'fs'
import path from 'path'
import json5 from 'json5'
import { vscodeGrammarsToRemove, vscodeGrammarsToRename } from '../grammarSources'

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
    console.log(`removed ${fPath}`)
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
    console.log(`renamed ${f} to ${vscodeGrammarsToRename[fName]}.tmLanguage.json`)
  }
}

/**
 * - Make sure each grammar's file name matches its `name` key
 */
files = fs.readdirSync(GRAMMAR_FOLDER_PATH)
for (let f of files) {
  normalizeGrammarFile(f)
}

export function normalizeGrammarFile(f: string) {
  const fPath = path.resolve(GRAMMAR_FOLDER_PATH, f)
  const fNameWithoutSuffix = f.replace(/\.tmLanguage.json$/i, '')
  const fName = fNameWithoutSuffix.toLowerCase()

  if (fs.existsSync(fPath)) {
    const parsedContent = json5.parse(fs.readFileSync(fPath, 'utf-8'))

    if (parsedContent.name !== fName) {
      parsedContent.name = fName
      fs.writeFileSync(fPath, JSON.stringify(parsedContent, null, 2))
      console.log(`normalized ${f}'s \`name\` as ${fName}`)
    }
    if (fNameWithoutSuffix !== fNameWithoutSuffix.toLowerCase()) {
      const fNewPath = path.resolve(
        GRAMMAR_FOLDER_PATH,
        fNameWithoutSuffix.toLowerCase() + '.tmLanguage.json'
      )
      fs.renameSync(fPath, fNewPath)
      console.log(`renamed ${f} as ${f.toLowerCase()}`)
    }
  }
}
