/**
 * Update themes from upstream sources
 */

const { get } = require('./getURLContent')
const fs = require('fs')
const url = require('url')
const path = require('path')

const THEME_FOLDER_PATH = path.join(__dirname, '..', 'tmp/themes')

function convertURL(ghURL) {
  const oldPath = url.parse(ghURL).path
  return 'https://raw.githubusercontent.com' + oldPath.replace('/blob/', '/')
}

const themes = [
  'https://github.com/arcticicestudio/nord-visual-studio-code/blob/develop/themes/nord-color-theme.json',
  'https://github.com/misolori/min-theme/blob/master/themes/min-light.json',
  'https://github.com/misolori/min-theme/blob/master/themes/min-dark.json'
]

async function go() {
  for (let t of themes) {
    const targetUrl = convertURL(t)
    const fileName = path.parse(url.parse(t).path).base
    const content = await get(targetUrl)
    fs.writeFileSync(path.resolve(THEME_FOLDER_PATH, fileName), content)
  }
}

go()
