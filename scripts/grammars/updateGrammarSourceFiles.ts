import fs from 'fs'
import path from 'path'
import {
  embeddedLanguagesToExclude,
  languageAliases,
  languageDisplayOverrides
} from '../grammarSources'
import { parseJson } from '../util/parse'

const langDir = path.resolve(__dirname, '../../packages/shiki/languages')
const sampleDir = path.resolve(__dirname, '../../packages/shiki/samples')
const langPath = path.resolve(__dirname, '../../packages/shiki/src/languages.ts')
const readmePath = path.resolve(__dirname, '../../docs/languages.md')

const DISPLAY_NAME_MAP_PATH = path.join(__dirname, '../..', 'tmp', 'displayNameMap.json')
const displayName: Record<string, string> = parseJson(
  fs.readFileSync(DISPLAY_NAME_MAP_PATH, 'utf-8')
)

// Regex to quickly see if a grammar uses `include` keys to embed other languages
const INCLUDE_REGEX = /"include": "([^#$].+)"/g

const files = fs.readdirSync(langDir)
const langIds = files.map(f => f.replace('.tmLanguage.json', ''))
const scopeToIdMap = {}
langIds
  .filter(id => !embeddedLanguagesToExclude.includes(id))
  .forEach(id => {
    const grammarPath = path.resolve(langDir, `${id}.tmLanguage.json`)
    const grammarSrc = fs.readFileSync(grammarPath, 'utf-8')
    const grammar = parseJson(grammarSrc)

    scopeToIdMap[grammar.scopeName] = id
  })

const langRegistrationContent = langIds
  .filter(id => !embeddedLanguagesToExclude.includes(id))
  .map(id => {
    const grammarPath = path.resolve(langDir, `${id}.tmLanguage.json`)
    const grammarSrc = fs.readFileSync(grammarPath, 'utf-8')
    const grammar = parseJson(grammarSrc)

    let regContent = `  {
    id: '${id}',
    scopeName: '${grammar.scopeName}',
    path: '${id}.tmLanguage.json'`

    if (
      languageDisplayOverrides[id] ||
      (displayName[grammar.scopeName] && displayName[grammar.scopeName] !== id)
    ) {
      regContent += `,
    displayName: '${languageDisplayOverrides[id] ?? displayName[grammar.scopeName]}'`
    }

    if (grammar.balancedBracketScopes) {
      regContent += `,
      balancedBracketSelectors: ${JSON.stringify(grammar.balancedBracketScopes)}`
    }

    if (grammar.unbalancedBracketScopes) {
      regContent += `,
      unbalancedBracketSelectors: ${JSON.stringify(grammar.unbalancedBracketScopes)}`
    }

    if (fs.existsSync(path.resolve(sampleDir, `${id}.sample`))) {
      regContent += `,
    samplePath: '${id}.sample'`
    }

    if (languageAliases[id]) {
      const aliasStr = languageAliases[id].map(a => `'` + a + `'`).join(', ')
      regContent += `,
    aliases: [${aliasStr}]`
    }

    const embeddedLangs = new Set()
    ;[...grammarSrc.matchAll(INCLUDE_REGEX)].forEach(([full, captured]) => {
      const scope = captured.split('#')[0]
      if (!grammar.scopeName || (grammar.scopeName && scope !== grammar.scopeName)) {
        if (scopeToIdMap[scope]) {
          embeddedLangs.add(scopeToIdMap[scope])
        }
      }
    })
    if (embeddedLangs.size > 0) {
      regContent += `,
    embeddedLangs: [${[...embeddedLangs].map(id => `'` + id + `'`).join(', ')}]`
    }

    regContent += `
  }`

    return regContent
  })
  .join(',\n')

const langContent = `
// This file is generated by "${path.relative(
  // project root
  process.cwd(),
  __filename
)}" inside your project.
// Do not edit this file directly.
import { ILanguageRegistration } from './types'

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
`.trimStart()

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
