const fs = require('fs')
const { THEME_FOLDER_PATH, normalizeThemeFile } = require('./normalizeThemeFile')

const files = fs.readdirSync(THEME_FOLDER_PATH).filter(x => !x.startsWith('vscode'))

for (let f of files) {
  normalizeThemeFile(f)
}
