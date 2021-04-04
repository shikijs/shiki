import fs from 'fs'
import path from 'path'
import { embeddedLanguagesToExclude, languageAliases } from '../grammarSources'

const langDir = path.resolve(__dirname, '../../packages/shiki/languages')
const sampleDir = path.resolve(__dirname, '../../packages/shiki/samples')
const langPath = path.resolve(__dirname, '../../packages/shiki/src/languages.ts')
const readmePath = path.resolve(__dirname, '../../docs/languages.md')

const files = fs.readdirSync(langDir)
const langIds = files.map(f => f.replace('.tmLanguage.json', ''))

const langRegistrationContent = langIds
  .filter(id => !embeddedLanguagesToExclude.includes(id))
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

    if (languageAliases[id]) {
      const aliasStr = languageAliases[id].map(a => `'` + a + `'`).join(', ')
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
  .filter(id => !embeddedLanguagesToExclude.includes(id))
  .map(id => {
    if (!languageAliases[id]) {
      return `  | '${id}'`
    }

    const baseContent = `  | '${id}'`
    const aliasesContent = languageAliases[id].map(l => `'` + l + `'`).join(' | ')
    return `${baseContent} | ${aliasesContent}`
  })
  .join('\n')}

export const languages: ILanguageRegistration[] = [
${langRegistrationContent}
]
`

fs.writeFileSync(langPath, langContent)

const readmeReplaceContent = `export type Lang =
${langIds
  .filter(id => !embeddedLanguagesToExclude.includes(id))
  .map(id => {
    if (!languageAliases[id]) {
      return `  | '${id}'`
    }

    const baseContent = `  | '${id}'`
    const aliasesContent = languageAliases[id].map(l => `'` + l + `'`).join(' | ')
    return `${baseContent} | ${aliasesContent}`
  })
  .join('\n')}
`

const readmeSrc = fs.readFileSync(readmePath, 'utf-8')
const newReadmeSrc = readmeSrc.replace(/## All Languages\n\n```ts([^`]+)```/, (_match, langs) => {
  return '## All Languages\n\n```ts\n' + readmeReplaceContent + '```'
})

fs.writeFileSync(readmePath, newReadmeSrc)
