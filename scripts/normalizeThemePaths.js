//@ts-check
const fs = require('fs')
const path = require('path')
const json5 = require('json5')
const kebabCase = require('lodash.kebabcase')

const THEME_FOLDER_PATH = path.join(__dirname, '..', 'tmp/themes')
const VSCODE_THEME_FOLDER_PATH = path.join(THEME_FOLDER_PATH, 'vscode')

/**
 * Handle dark/light plus
 *
 * - Merge dark_defaults/dark_vs into dark_plus
 * - Merge light_defaults/light_vs into light_plus
 */

function readJson5(f) {
  const p = path.resolve(VSCODE_THEME_FOLDER_PATH, f)
  return json5.parse(fs.readFileSync(p, 'utf-8'))
}
const darkDefaultsContent = readJson5('dark_defaults.json')
const darkVSContent = readJson5('dark_vs.json')
const darkPlusContent = readJson5('dark_plus.json')

delete darkPlusContent['include']
darkPlusContent.name = 'dark-plus'
darkPlusContent.colors = { ...darkDefaultsContent.colors }
darkPlusContent.tokenColors = [...darkVSContent.tokenColors, ...darkPlusContent.tokenColors]
darkPlusContent.semanticTokenColors = {
  ...darkVSContent.semanticTokenColors,
  ...darkPlusContent.semanticTokenColors
}

fs.writeFileSync(
  path.resolve(VSCODE_THEME_FOLDER_PATH, 'dark_plus.json'),
  JSON.stringify(darkPlusContent, null, 2)
)
fs.unlinkSync(path.resolve(VSCODE_THEME_FOLDER_PATH, 'dark_defaults.json'))
fs.unlinkSync(path.resolve(VSCODE_THEME_FOLDER_PATH, 'dark_vs.json'))

const lightDefaultsContent = readJson5('light_defaults.json')
const lightVSContent = readJson5('light_vs.json')
const lightPlusContent = readJson5('light_plus.json')

delete lightPlusContent['include']
lightPlusContent.name = 'light-plus'
lightPlusContent.colors = { ...lightDefaultsContent.colors }
lightPlusContent.tokenColors = [...lightVSContent.tokenColors, ...lightPlusContent.tokenColors]
lightPlusContent.semanticTokenColors = {
  ...lightVSContent.semanticTokenColors,
  ...lightPlusContent.semanticTokenColors
}

fs.writeFileSync(
  path.resolve(VSCODE_THEME_FOLDER_PATH, 'light_plus.json'),
  JSON.stringify(lightPlusContent, null, 2)
)
fs.unlinkSync(path.resolve(VSCODE_THEME_FOLDER_PATH, 'light_defaults.json'))
fs.unlinkSync(path.resolve(VSCODE_THEME_FOLDER_PATH, 'light_vs.json'))

/**
 * Give each file a kebab-case name and name its file accordingly
 */

function normalizeFile(file, newName) {
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
  }
}

normalizeFile('vscode/dark_plus.json')
normalizeFile('vscode/light_plus.json')
normalizeFile('vscode/monokai-color-theme.json', 'monokai')
normalizeFile('vscode/solarized-dark-color-theme.json', 'solarized-dark')
normalizeFile('vscode/solarized-light-color-theme.json', 'solarized-light')

/**
 * Normalize all other theme files
 */

const files = fs.readdirSync(THEME_FOLDER_PATH).filter(x => !x.startsWith('vscode'))

for (let f of files) {
  normalizeFile(f)
}
