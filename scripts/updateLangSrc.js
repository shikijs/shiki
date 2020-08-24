const fs = require('fs')
const path = require('path')

const langDir = path.resolve(__dirname, '../packages/languages/data')
const langPath = path.resolve(__dirname, '../packages/languages/src/lang.ts')

const files = fs.readdirSync(langDir)
const langIds = files.map(f => f.replace('.tmLanguage.json', ''))

const aliases = {
  bat: ['batch'],
  clojure: ['clj'],
  csharp: ['c#'],
  fsharp: ['f#'],
  handlebars: ['hbs'],
  javascript: ['js'],
  markdown: ['md'],
  'objective-c': ['objc'],
  powershell: ['ps', 'ps1'],
  pug: ['jade'],
  python: ['py'],
  ruby: ['rb'],
  shaderlab: ['shader'],
  shellscript: ['shell', 'bash', 'sh', 'zsh'],
  stylus: ['styl'],
  typescript: ['ts'],
  vb: ['cmd']
}

const langRegistrationContent = langIds
  .map(id => {
    const grammarPath = path.resolve(langDir, `${id}.tmLanguage.json`)
    const grammar = JSON.parse(fs.readFileSync(grammarPath, 'utf-8'))

    if (aliases[id]) {
      const aliasStr = aliases[id].map(a => `'` + a + `'`).join(', ')
      return `  {
    id: '${id}',
    scopeName: '${grammar.scopeName}',
    path: path.resolve(__dirname, '../data/${id}.tmLanguage.json'),
    aliases: [${aliasStr}]
  }`
    } else {
      return `  {
    id: '${id}',
    scopeName: '${grammar.scopeName}',
    path: path.resolve(__dirname, '../data/${id}.tmLanguage.json')
  }`
    }
  })
  .join(',\n')

const langContent = `import * as path from 'path'
import { ILanguageRegistration } from './index'

export type Lang =
${langIds.map(id => `  | '${id}'`).join('\n')}

export const languages: ILanguageRegistration[] = [
${langRegistrationContent}
]
`

fs.writeFileSync(langPath, langContent)
