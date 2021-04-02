const fs = require('fs')
const path = require('path')

const langDir = path.resolve(__dirname, '../packages/shiki/languages')
const sampleDir = path.resolve(__dirname, '../packages/shiki/samples')
const langPath = path.resolve(__dirname, '../packages/shiki/src/languages.ts')
const readmePath = path.resolve(__dirname, '../docs/languages.md')

const files = fs.readdirSync(langDir)
const langIds = files.map(f => f.replace('.tmLanguage.json', ''))

const aliases = {
  bat: ['batch'],
  clojure: ['clj'],
  csharp: ['c#'],
  fsharp: ['f#'],
  handlebars: ['hbs'],
  javascript: ['js'],
  latex: ['tex'],
  markdown: ['md'],
  'objective-c': ['objc'],
  powershell: ['ps', 'ps1'],
  pug: ['jade'],
  python: ['py'],
  ruby: ['rb'],
  'html-ruby-erb': ['erb'],
  shaderlab: ['shader'],
  shellscript: ['shell', 'bash', 'sh', 'zsh'],
  stylus: ['styl'],
  typescript: ['ts'],
  vb: ['cmd'],
  文言: ['wenyan']
}

const excludeLanguages = [
  // `vue` or `html` instead
  'vue-html',
  // `jinja-html` instead
  'jinja',
  // `php` instead
  'php-html',
  // embedded by `cpp`
  'cpp.embedded.macro'
]

const langRegistrationContent = langIds
  .filter(id => !excludeLanguages.includes(id))
  .map(id => {
    const grammarPath = path.resolve(langDir, `${id}.tmLanguage.json`)
    const grammar = JSON.parse(fs.readFileSync(grammarPath, 'utf-8'))

    let regContent = `  {
    id: '${id}',
    scopeName: '${grammar.scopeName}',
    path: '${id}.tmLanguage.json'`

    if (fs.existsSync(path.resolve(sampleDir, `${id}.sample`))) {
      regContent += `,
    samplePath: '${id}.sample'`
    }

    if (aliases[id]) {
      const aliasStr = aliases[id].map(a => `'` + a + `'`).join(', ')
      regContent += `,
    aliases: [${aliasStr}]`
    }

    regContent += `
  }`

    return regContent
  })
  .join(',\n')

const langContent = `import { ILanguageRegistration } from './types'

export type Lang =
${langIds
  .filter(id => !excludeLanguages.includes(id))
  .map(id => `  | '${id}'`)
  .join('\n')}

export const languages: ILanguageRegistration[] = [
${langRegistrationContent}
]
`

fs.writeFileSync(langPath, langContent)

const readmeReplaceContent = `export type Lang =
${langIds
  .filter(id => !excludeLanguages.includes(id))
  .map(id => `  | '${id}'`)
  .join('\n')}
`

const readmeSrc = fs.readFileSync(readmePath, 'utf-8')
const newReadmeSrc = readmeSrc.replace(/## All Languages\n\n```ts([^`]+)```/, (_match, langs) => {
  return '## All Languages\n\n```ts\n' + readmeReplaceContent + '```'
})

fs.writeFileSync(readmePath, newReadmeSrc)
