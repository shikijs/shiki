const fs = require('fs')
const path = require('path')
const json5 = require('json5')
const kebabCase = require('lodash.kebabcase')
const { parse: plistParse } = require('fast-plist')

const GRAMMAR_FOLDER_PATH = path.join(__dirname, '..', 'tmp/grammars')

/**
 * Give each file a kebab-case name and name its file accordingly
 */

function normalizeGrammarFile(file, newName) {
  const oldPath = path.resolve(GRAMMAR_FOLDER_PATH, file)
  if (fs.existsSync(oldPath)) {
    const parsedContent = oldPath.endsWith('.json')
      ? json5.parse(fs.readFileSync(oldPath, 'utf-8'))
      : plistParse(fs.readFileSync(oldPath, 'utf-8'))

    let kebabName = newName
    if (!kebabName && parsedContent.name) {
      kebabName = kebabCase(parsedContent.name.toLowerCase())
    } else if (!kebabName && parsedContent.scopeName) {
      kebabName = kebabCase(parsedContent.scopeName.split('.').pop())
    }
    if (kebabName === 'cpp') {
      console.log('skip normalization for cpp grammar files')
      return
    }
    const newPath = path.resolve(GRAMMAR_FOLDER_PATH, `${kebabName}.tmLanguage.json`)
    parsedContent.name = kebabName
    if (newPath !== oldPath) {
      fs.unlinkSync(oldPath)
    }

    fs.writeFileSync(newPath, JSON.stringify(parsedContent, null, 2))
    console.log(`normalized ${oldPath} to ${newPath}`)
  }
}

module.exports = {
  GRAMMAR_FOLDER_PATH,
  normalizeGrammarFile
}
