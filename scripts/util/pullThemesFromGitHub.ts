import { get, convertGHURLToDownloadURL } from './download'
import fs from 'fs'
import url from 'url'
import path from 'path'

const THEME_FOLDER_PATH = path.join(__dirname, '..', 'tmp/themes')

const themes = [
  'https://github.com/arcticicestudio/nord-visual-studio-code/blob/develop/themes/nord-color-theme.json',
  'https://github.com/misolori/min-theme/blob/master/themes/min-light.json',
  'https://github.com/misolori/min-theme/blob/master/themes/min-dark.json',
  'https://github.com/slack-theme/visual-studio-code/blob/master/themes/ochin.json',
  'https://github.com/slack-theme/visual-studio-code/blob/master/themes/dark-mode.json'
]

async function go() {
  for (let t of themes) {
    const targetUrl = convertGHURLToDownloadURL(t)
    const fileName = path.parse(url.parse(t).path).base
    const content = await get(targetUrl)
    fs.writeFileSync(path.resolve(THEME_FOLDER_PATH, fileName), content)
    console.log(`Downloaded ${fileName}`)
  }
}

go()
