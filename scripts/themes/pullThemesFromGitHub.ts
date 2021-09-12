import fs from 'fs'
import kebabCase from 'lodash.kebabcase'
import path from 'path'
import { githubThemeSources } from '../themeSources'
import { convertGHURLToDownloadURL, get } from '../util/download'
import chalk from 'chalk'
import { parseJson } from '../util/parse'

const THEME_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/themes')

async function go() {
  for (let urlOrNameWithUrl of githubThemeSources) {
    await downloadThemeFromGH(urlOrNameWithUrl)
  }
}

go()

async function downloadThemeFromGH(urlOrNameWithUrl: string | [string, string]) {
  const ghUrl = typeof urlOrNameWithUrl === 'string' ? urlOrNameWithUrl : urlOrNameWithUrl[1]
  const targetUrl = convertGHURLToDownloadURL(ghUrl)

  let content
  try {
    content = await get(targetUrl)
  } catch (e) {
    throw Error(`Failed to download grammar from ${ghUrl}: ${e}`)
  }

  const contentObj = parseJson(content)

  /**
   * Make sure downloaded theme has correct `name`
   */
  const specifiedLangId = typeof urlOrNameWithUrl === 'string' ? undefined : urlOrNameWithUrl[0]
  if (specifiedLangId) {
    contentObj['name'] = specifiedLangId
  }

  const newFileName = specifiedLangId
    ? specifiedLangId + '.json'
    : kebabCase(contentObj['name'].toLowerCase()) + '.json'

  /**
   * Write file
   */
  fs.writeFileSync(
    path.resolve(THEME_FOLDER_PATH, newFileName),
    JSON.stringify(contentObj, null, 2)
  )
  console.log(`Downloaded theme: ${chalk.blue(newFileName)}`)
}
