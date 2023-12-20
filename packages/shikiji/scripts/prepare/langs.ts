import fs from 'fs-extra'
import { grammars, injections } from 'tm-grammars'
import fg from 'fast-glob'
import type { LanguageRegistration } from 'shikiji-core'
import { COMMENT_HEAD } from './constants'
import { cleanupLanguageReg } from './utils'

export async function prepareLangs() {
  const allLangFiles = await fg('*.json', {
    cwd: './node_modules/tm-grammars/grammars',
    absolute: true,
    onlyFiles: true,
  })

  allLangFiles.sort()

  for (const file of allLangFiles) {
    const content = await fs.readJSON(file)
    const lang = grammars.find(i => i.name === content.name) || injections.find(i => i.name === content.name)
    if (!lang) {
      console.warn(`unknown ${content.name}`)
      continue
    }

    const json: LanguageRegistration = cleanupLanguageReg({
      ...lang,
      ...content,
      name: content.name || lang.name,
      scopeName: content.scopeName || lang.scopeName,
      displayName: lang.displayName,
      embeddedLangs: lang.embedded,
    })

    // F# and Markdown has circular dependency
    if (lang.name === 'fsharp' && json.embeddedLangs)
      json.embeddedLangs = json.embeddedLangs.filter((i: string) => i !== 'markdown')

    const deps: string[] = [
      ...(json.embeddedLangs || []),
    ]

    await fs.writeFile(`./src/assets/langs/${lang.name}.ts`, `${COMMENT_HEAD}
import type { LanguageRegistration } from 'shikiji-core'

${deps.map(i => `import ${i.replace(/[^\w]/g, '_')} from './${i}'`).join('\n')}

const lang = Object.freeze(${JSON.stringify(json, null, 2)}) as unknown as LanguageRegistration

export default [
${[
  ...deps.map(i => `  ...${i.replace(/[^\w]/g, '_')}`),
  '  lang',
].join(',\n') || ''}
]
`, 'utf-8')
  }

  async function writeLanguageBundleIndex(fileName: string, ids: string[]) {
    const bundled = ids.map(id => grammars.find(i => i.name === id)!)

    const info = bundled.map(i => ({
      id: i.name,
      name: i.displayName || i.name,
      aliases: i.aliases,
      import: `__(() => import('./langs/${i.name}')) as DynamicLangReg__`,
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
  }

  await writeLanguageBundleIndex('langs', grammars.map(i => i.name))
}
