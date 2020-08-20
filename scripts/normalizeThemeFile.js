//@ts-check
const fs = require('fs')
const path = require('path')
const json5 = require('json5')
const kebabCase = require('lodash.kebabcase')

const THEME_FOLDER_PATH = path.join(__dirname, '..', 'tmp/themes')

/**
 * Give each file a kebab-case name and name its file accordingly
 */

function normalizeThemeFile(file, newName) {
  const oldPath = path.resolve(THEME_FOLDER_PATH, file)
  if (fs.existsSync(oldPath)) {
    const newJson = json5.parse(fs.readFileSync(oldPath, 'utf-8'))
    const kebabName = newName || kebabCase(newJson.name.toLowerCase())

    const newPath = path.resolve(THEME_FOLDER_PATH, `${kebabName}.json`)
    newJson.name = kebabName

    if (newPath !== oldPath) {
      fs.unlinkSync(oldPath)
    }

    fs.writeFileSync(newPath, JSON.stringify(newJson, null, 2))
    console.log(`normalized ${oldPath} to ${newPath}`)
  }
}

module.exports = {
  THEME_FOLDER_PATH,
  normalizeThemeFile
}
