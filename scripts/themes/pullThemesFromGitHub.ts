import path from 'path'
import { githubThemeSources } from '../themeSources'
import { parseJson } from '../util/parse'
import { downloadFromGH } from '../util/downloadFromGitHub'

const THEME_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/themes')

async function go() {
  for (let [name, url] of githubThemeSources) {
    const outPath = path.resolve(THEME_FOLDER_PATH, name + '.json')
    await downloadFromGH(url, 'theme', content => parseJson(content), outPath)
  }
}

go()
