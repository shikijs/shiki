import fs from 'fs-extra'
import { grammars, injections } from 'tm-grammars'
import fg from 'fast-glob'
import type { LanguageRegistration } from 'shikiji-core'
import { COMMENT_HEAD } from './constants'

/**
 * Languages that includes a lot of embedded langs,
 * We only load on-demand for these langs.
 */
const LANGS_LAZY_EMBEDDED = [
  'markdown',
  'mdx',
]

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

    const json: LanguageRegistration = {
      ...content,
      name: content.name || lang.name,
      scopeName: content.scopeName || lang.scopeName,
      displayName: lang.displayName,
      embeddedLangs: lang.embedded,
      aliases: lang.aliases,
    }

    // We don't load all the embedded langs for markdown
    if (LANGS_LAZY_EMBEDDED.includes(lang.name)) {
      json.embeddedLangsLazy = json.embeddedLangs
      json.embeddedLangs = []
    }

    const deps: string[] = json.embeddedLangs || []

    await fs.writeFile(
      `./src/assets/langs/${lang.name}.js`,
      `${COMMENT_HEAD}
${deps.map(i => `import ${i.replace(/[^\w]/g, '_')} from './${i}'`).join('\n')}

const lang = Object.freeze(${JSON.stringify(json)})

export default [
${[
  ...deps.map(i => `  ...${i.replace(/[^\w]/g, '_')}`),
  '  lang',
].join(',\n') || ''}
]
`.replace(/\n\n+/g, '\n\n'),
      'utf-8',
    )

    await fs.writeFile(
      `./src/assets/langs/${lang.name}.d.ts`,
      `${COMMENT_HEAD}
import type { LanguageRegistration } from 'shikiji-core'

const langs: LanguageRegistration []
export default langs
`,
      'utf-8',
    )
  }

  async function writeLanguageBundleIndex(
    fileName: string,
    ids: string[],
  ) {
    // We flatten all the embedded langs
    const bundledIds = new Set<string>(ids)
    let changed = true
    while (changed) {
      changed = false
      for (const id of bundledIds) {
        if (LANGS_LAZY_EMBEDDED.includes(id))
          continue
        const lang = grammars.find(i => i.name === id)
        if (!lang)
          continue
        for (const e of lang.embedded || []) {
          if (!bundledIds.has(e)) {
            bundledIds.add(e)
            changed = true
          }
        }
      }
    }

    const bundled = Array.from(bundledIds).map(id => grammars.find(i => i.name === id)!).filter(Boolean)

    const info = bundled.map(i => ({
      id: i.name,
      name: i.displayName || i.name,
      aliases: i.aliases,
      import: `__(() => import('./langs/${i.name}')) as DynamicImportLanguageRegistration__`,
    }) as const)
      .sort((a, b) => a.id.localeCompare(b.id))

    const type = info.flatMap(i => [...i.aliases || [], i.id]).sort().map(i => `'${i}'`).join(' | ')

    await fs.writeFile(
    `src/assets/${fileName}.ts`,
  `${COMMENT_HEAD}
import type { DynamicImportLanguageRegistration, BundledLanguageInfo } from 'shikiji-core'

export const bundledLanguagesInfo: BundledLanguageInfo[] = ${JSON.stringify(info, null, 2).replace(/"__|__"/g, '').replace(/"/g, '\'')}

export const bundledLanguagesBase = Object.fromEntries(bundledLanguagesInfo.map(i => [i.id, i.import]))

export const bundledLanguagesAlias = Object.fromEntries(bundledLanguagesInfo.flatMap(i => i.aliases?.map(a => [a, i.import]) || []))

export type BundledLanguage = ${type}

export const bundledLanguages = {
  ...bundledLanguagesBase,
  ...bundledLanguagesAlias,
} as Record<BundledLanguage, DynamicImportLanguageRegistration>
`,
  'utf-8',
    )
  }

  await writeLanguageBundleIndex(
    'langs-bundle-full',
    grammars.map(i => i.name),
  )
  await writeLanguageBundleIndex(
    'langs-bundle-web',
    [
      ...grammars.filter(i => i.categories?.includes('web')).map(i => i.name),
      'shellscript',
    ],
  )
}
