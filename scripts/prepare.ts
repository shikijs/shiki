import fs from 'fs-extra'
import { BUNDLED_LANGUAGES, BUNDLED_THEMES } from 'shiki'
import fg from 'fast-glob'

const files = await fg('*.json', {
  cwd: './node_modules/shiki/languages',
  absolute: true,
  onlyFiles: true,
})

files.sort()

await fs.ensureDir('./src/vendor/languages')
await fs.emptyDir('./src/vendor/languages')

for (const file of files) {
  const content = await fs.readJSON(file)
  const lang = BUNDLED_LANGUAGES.find(i => i.id === content.name)
  if (!lang) {
    console.warn(`unknown ${content.name}`)
    continue
  }

  const json = {
    ...content,
    name: content.name || lang.id,
    scopeName: content.scopeName || lang.scopeName,
    displayName: lang.displayName,
    aliases: lang.aliases,
    embeddedLangs: lang.embeddedLangs,
    balancedBracketSelectors: lang.balancedBracketSelectors,
    unbalancedBracketSelectors: lang.unbalancedBracketSelectors,
  }

  // Do not include everything for markdown
  if (lang.id === 'markdown')
    json.embeddedLangs = []

  const embedded = (json.embeddedLangs || []) as string[]

  await fs.writeFile(`./src/vendor/languages/${lang.id}.ts`,
    `
import { LanguageRegistration } from '../../types'

${embedded.map(i => `import ${i.replace(/[^\w]/g, '_')} from './${i}'`).join('\n')}

const lang = Object.freeze(${JSON.stringify(json)}) as unknown as LanguageRegistration

export default [
${[
  ...embedded.map(i => `  ...${i.replace(/[^\w]/g, '_')}`),
  '  lang',
].join(',\n') || ''}
]
`,
    'utf-8',
  )
}

const languages = Object.fromEntries(BUNDLED_LANGUAGES.map(i => [i.id, `__(() => import('./languages/${i.id}')) as unknown as DynamicLangReg__`]))

const langAlias = Object.fromEntries(BUNDLED_LANGUAGES.flatMap(i =>
  (i.aliases || []).map(x => [x, `__bundledLanguagesBase['${i.id}']__`]),
))

const themes = Object.fromEntries(BUNDLED_THEMES.sort().map(i => [i, `__(() => import('shiki/themes/${i}.json')) as unknown as DynamicThemeReg__`]))

await fs.writeFile(
  'src/vendor/langs.ts',
  `import type { LanguageRegistration } from '../types'

type DynamicLangReg = () => Promise<{ default: LanguageRegistration[] }>

export const bundledLanguagesBase = ${JSON.stringify(languages, null, 2).replace(/"__|__"/g, '')}

export const bundledLanguagesAlias = ${JSON.stringify(langAlias, null, 2).replace(/"__|__"/g, '')}

export const bundledLanguages = {
  ...bundledLanguagesBase,
  ...bundledLanguagesAlias,
}
`,
  'utf-8',
)

await fs.writeFile(
  'src/vendor/themes.ts',
  `import type { ThemeRegisterationRaw } from '../types'

type DynamicThemeReg = () => Promise<{ default: ThemeRegisterationRaw }>

export const bundledThemes = ${JSON.stringify(themes, null, 2).replace(/"__|__"/g, '')}`,
  'utf-8',
)
