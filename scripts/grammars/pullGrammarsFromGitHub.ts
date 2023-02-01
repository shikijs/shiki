import { parse as plistParse } from 'fast-plist'
import yaml from 'js-yaml'
import path from 'path'
import CSON from 'cson'
import { githubGrammarSources } from '../grammarSources'
import { parseJson } from '../util/parse'
import { downloadFromGH } from '../util/downloadFromGitHub'
import fs from 'fs'

const GRAMMAR_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/grammars')

const errors = []

const outputErrors = process.argv?.[2] === '--output-errors'

async function go() {
  for (let [name, url] of githubGrammarSources) {
    const outPath = path.resolve(GRAMMAR_FOLDER_PATH, name + '.tmLanguage.json')
    const result = await downloadFromGH(
      url,
      'grammar',
      content => {
        let contentObj
        if (url.endsWith('.cson')) {
          contentObj = CSON.parseString(content)
        } else if (url.endsWith('.json')) {
          contentObj = parseJson(content)
        } else if (url.endsWith('.plist')) {
          contentObj = plistParse(content)
        } else if (url.endsWith('.yml') || url.endsWith('.yaml')) {
          contentObj = yaml.load(content)
        } else {
          if (content[0] === '{') {
            contentObj = parseJson(content)
          } else if (content[0] === '<') {
            contentObj = plistParse(content)
          } else {
            contentObj = yaml.load(content)
          }
        }

        contentObj['name'] = name
        return contentObj
      },
      outPath
    )
    if (!result.success) {
      errors.push({ language: name, ...result })
    }
  }

  if (errors.length && outputErrors) {
    fs.writeFileSync(
      path.join(__dirname, '../..', 'tmp/errors.grammar.json'),
      JSON.stringify({ errors }, null, 2)
    )
  }
}

go()
