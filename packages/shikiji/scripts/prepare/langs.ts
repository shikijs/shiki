import fs from 'fs-extra'
import { BUNDLED_LANGUAGES } from 'shiki'
import fg from 'fast-glob'
import type { LanguageRegistration } from 'shikiji-core'
import { COMMENT_HEAD } from './constants'
import { prepareInjections } from './injections'

export async function prepareLangs() {
  const allLangFiles = await fg('*.json', {
    cwd: './node_modules/shiki/languages',
    absolute: true,
    onlyFiles: true,
  })

  allLangFiles.sort()

  const injections = await prepareInjections()

  for (const file of allLangFiles) {
    const content = await fs.readJSON(file)
    const lang = BUNDLED_LANGUAGES.find(i => i.id === content.name)
    if (!lang) {
      console.warn(`unknown ${content.name}`)
      continue
    }

    const json: LanguageRegistration = {
      ...content,
      name: content.name || lang.id,
      scopeName: content.scopeName || lang.scopeName,
      displayName: lang.displayName,
      aliases: lang.aliases,
      embeddedLangs: lang.embeddedLangs,
      balancedBracketSelectors: lang.balancedBracketSelectors,
      unbalancedBracketSelectors: lang.unbalancedBracketSelectors,
    }

    // F# and Markdown has circular dependency
    if (lang.id === 'fsharp' && json.embeddedLangs)
      json.embeddedLangs = json.embeddedLangs.filter((i: string) => i !== 'markdown')

    const deps: string[] = [
      ...(json.embeddedLangs || []),
      ...injections.filter(i => i.toLang === lang.id).map(i => i.name),
    ]

    await fs.writeFile(`./src/assets/langs/${lang.id}.ts`, `${COMMENT_HEAD}
import type { LanguageRegistration } from 'shikiji-core'

${deps.map(i => `import ${i.replace(/[^\w]/g, '_')} from './${i}'`).join('\n')}

const lang = Object.freeze(${JSON.stringify(json)}) as unknown as LanguageRegistration

export default [
${[
  ...deps.map(i => `  ...${i.replace(/[^\w]/g, '_')}`),
  '  lang',
].join(',\n') || ''}
]
`, 'utf-8')
  }

  async function writeLanguageBundleIndex(fileName: string, ids: string[]) {
    const bundled = ids.map(id => BUNDLED_LANGUAGES.find(i => i.id === id)!)

    const info = bundled.map(i => ({
      id: i.id,
      name: i.displayName,
      aliases: i.aliases,
      import: `__(() => import('./langs/${i.id}')) as DynamicLangReg__`,
    }) as const)
      .sort((a, b) => a.id.localeCompare(b.id))

    const type = info.flatMap(i => [...i.aliases || [], i.id]).sort().map(i => `'${i}'`).join(' | ')

    await fs.writeFile(
    `src/assets/${fileName}.ts`,
  `${COMMENT_HEAD}
import type { LanguageRegistration } from 'shikiji-core'

type DynamicLangReg = () => Promise<{ default: LanguageRegistration[] }>

export interface BundledLanguageInfo {
  id: string
  name: string
  import: DynamicLangReg
  aliases?: string[]
}

export const bundledLanguagesInfo: BundledLanguageInfo[] = ${JSON.stringify(info, null, 2).replace(/"__|__"/g, '').replace(/"/g, '\'')}

export const bundledLanguagesBase = Object.fromEntries(bundledLanguagesInfo.map(i => [i.id, i.import]))

export const bundledLanguagesAlias = Object.fromEntries(bundledLanguagesInfo.flatMap(i => i.aliases?.map(a => [a, i.import]) || []))

export type BuiltinLanguage = ${type}

export const bundledLanguages = {
  ...bundledLanguagesBase,
  ...bundledLanguagesAlias,
} as Record<BuiltinLanguage, DynamicLangReg>
`,
  'utf-8',
    )

    await fs.writeJSON(
    `src/assets/${fileName}.json`,
    BUNDLED_LANGUAGES.map(i => ({
      id: i.id,
      name: i.displayName,
      aliases: i.aliases,
    })),
    { spaces: 2 },
    )
  }

  await writeLanguageBundleIndex('langs', BUNDLED_LANGUAGES.map(i => i.id))
}
