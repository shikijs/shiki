import { parse as plistParse } from 'fast-plist'
import fs from 'fs'
import yaml from 'js-yaml'
import kebabCase from 'lodash.kebabcase'
import path from 'path'
import { githubGrammarSources } from '../grammarSources'
import { convertGHURLToDownloadURL, get } from '../util/download'
import json5 from 'json5'
import chalk from 'chalk'

const GRAMMAR_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/grammars')

async function go() {
  for (let urlOrNameWithUrl of githubGrammarSources) {
    await downloadGrammarFromGH(urlOrNameWithUrl)
  }
}

go()

async function downloadGrammarFromGH(urlOrNameWithUrl: string | [string, string]) {
  const ghUrl = typeof urlOrNameWithUrl === 'string' ? urlOrNameWithUrl : urlOrNameWithUrl[1]
  const targetUrl = convertGHURLToDownloadURL(ghUrl)

  let content
  try {
    content = await get(targetUrl)
  } catch (e) {
    throw Error(`Failed to download grammar from ${ghUrl}: ${e}`)
  }

  let contentObj
  if (ghUrl.endsWith('.json')) {
    contentObj = json5.parse(content)
  } else if (ghUrl.endsWith('.plist')) {
    contentObj = plistParse(content)
  } else if (ghUrl.endsWith('.yml') || ghUrl.endsWith('.yaml')) {
    contentObj = yaml.load(content)
  } else {
    if (content[0] === '{') {
      contentObj = json5.parse(content)
    } else if (content[0] === '<') {
      contentObj = plistParse(content)
    } else {
      contentObj = yaml.load(content)
    }
  }

  /**
   * Make sure downloaded grammar has correct `name`
   */
  const specifiedLangId = typeof urlOrNameWithUrl === 'string' ? undefined : urlOrNameWithUrl[0]
  if (specifiedLangId) {
    contentObj['name'] = specifiedLangId
  }

  const newFileName = specifiedLangId
    ? specifiedLangId + '.tmLanguage.json'
    : kebabCase(contentObj['name'].toLowerCase()) + '.tmLanguage.json'

  /**
   * Write file
   */
  fs.writeFileSync(
    path.resolve(GRAMMAR_FOLDER_PATH, newFileName),
    JSON.stringify(contentObj, null, 2)
  )
  console.log(`Downloaded grammar: ${chalk.blue(newFileName)}`)
}
