import * as fs from 'fs'
import * as path from 'path'

import { ThemeInfo } from './themes'
import { IGrammarRegistration, ILanguageRegistration, Resolver } from './resolver'
import { getOnigasm } from './onigLibs'
import { IEmbeddedLanguagesMap, IGrammar } from 'vscode-textmate'
import { IThemedToken } from './themedTokenizer'
import { ThemeTokenizer } from './tokenizer'

const DATA_PATH = path.resolve(__dirname, '../data')

let THEMES = [
  new ThemeInfo('abyss', 'Abyss.tmTheme'),
  new ThemeInfo('dark_vs', 'dark_vs.json'),
  new ThemeInfo('light_vs', 'light_vs.json'),
  new ThemeInfo('hc_black', 'hc_black.json'),
  new ThemeInfo('dark_plus', 'dark_plus.json', 'dark_vs.json'),
  new ThemeInfo('light_plus', 'light_plus.json', 'light_vs.json'),
  new ThemeInfo('kimbie_dark', 'Kimbie_dark.tmTheme'),
  new ThemeInfo('monokai', 'Monokai.tmTheme'),
  new ThemeInfo('monokai_dimmed', 'dimmed-monokai.tmTheme'),
  new ThemeInfo('quietlight', 'QuietLight.tmTheme'),
  new ThemeInfo('red', 'red.tmTheme'),
  new ThemeInfo('solarized_dark', 'Solarized-dark.tmTheme'),
  new ThemeInfo('solarized_light', 'Solarized-light.tmTheme'),
  new ThemeInfo('tomorrow_night_blue', 'Tomorrow-Night-Blue.tmTheme'),
  new ThemeInfo('material_palenight', 'Material-Theme-Palenight.json')
]

let LANGUAGES = [
  'javascript',
  'typescript',
  'html',
  'xml',
  'json',
  'css',
  'scss',
  'java',
  'python',
  'markdown',
  'shellscript',
  'dockerfile',
  'bat',
  'ini',
  'vue',
  'vue-html',
  'yaml'
]

let _grammars: IGrammarRegistration[] = JSON.parse(
  fs.readFileSync(path.resolve(DATA_PATH, 'grammars.json')).toString('utf8')
)
for (let grammar of _grammars) {
  grammar.path = path.join(DATA_PATH, grammar.path)
}

let _languages: ILanguageRegistration[] = JSON.parse(
  fs.readFileSync(path.join(DATA_PATH, 'languages.json')).toString('utf8')
)

let OnigasmResolver = new Resolver(_grammars, _languages, getOnigasm(), 'onigasm')
let _themeDatas = THEMES.map(theme => theme.create(OnigasmResolver))

export async function getCodeTokenizer(themeName: string): Promise<(code: string, lang: string) => IThemedToken[][]> {
  const themeData = _themeDatas.find(td => td.themeName === themeName)

  const tokenizerMap: { [lang: string]: { tokenizer: ThemeTokenizer; grammar: IGrammar } } = {}

  for (let lang of LANGUAGES) {
    const grammar = _grammars.find(g => g.language === lang)
    const langDefinition = _languages.find(l => l.id === lang)
    const embeddedLanguages: IEmbeddedLanguagesMap = Object.create(null)
    if (grammar.embeddedLanguages) {
      for (let scopeName in grammar.embeddedLanguages) {
        embeddedLanguages[scopeName] = OnigasmResolver.language2id[grammar.embeddedLanguages[scopeName]]
      }
    }

    if (!tokenizerMap[lang]) {
      tokenizerMap[lang] = {
        tokenizer: new ThemeTokenizer(
          themeData,
          grammar.scopeName,
          OnigasmResolver.language2id[lang],
          embeddedLanguages
        ),
        grammar: null
      }

      if (langDefinition.aliases) {
        langDefinition.aliases.forEach(a => {
          tokenizerMap[a] = tokenizerMap[lang]
        })
      }
    }
  }

  const grammarLoadingPromises = Object.keys(tokenizerMap).map(async lang => {
    tokenizerMap[lang].grammar = await tokenizerMap[lang].tokenizer.loadGrammarAsync()
  })

  await Promise.all(grammarLoadingPromises)

  return (code: string, lang: string) => {
    return tokenizerMap[lang].tokenizer.tokenizeWithTheme(code, tokenizerMap[lang].grammar)
  }
}

export function buildHTML(lines: IThemedToken[][], langId?: string) {
  let html = ''

  html += `<pre class="shiki">`
  if (langId) {
    html += `<div class="language-id">${langId}</div>`
  }
  html += `<code>`

  lines.forEach((l: any[]) => {
    if (l.length === 0) {
      html += `\n`
    } else {
      l.forEach(token => {
        html += `<span style="color: ${token.color}">${escapeHtml(token.content)}</span>`
      })
      html += `\n`
    }
  })
  html = html.replace(/\n*$/, '') // Get rid of final new lines
  html += `</code></pre>`

  return html
}

function escapeHtml(html: string) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
