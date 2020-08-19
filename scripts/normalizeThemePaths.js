//@ts-check

const fs = require('fs')
const { THEME_FOLDER_PATH, normalizeFile } = require('./normalizeFile')

const files = fs.readdirSync(THEME_FOLDER_PATH).filter(x => !x.startsWith('vscode'))

for (let f of files) {
  normalizeFile(f)
}
