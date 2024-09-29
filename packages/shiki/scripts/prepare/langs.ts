import type { LanguageRegistration } from '@shikijs/core'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { grammars, injections } from 'tm-grammars'
import { COMMENT_HEAD } from './constants'

/**
 * Document-like languages that have embedded langs
 */
const LANGS_LAZY_EMBEDDED_ALL = {
  markdown: [],
  mdx: [],
  wikitext: [],
  asciidoc: [],
  latex: ['tex'],
} as Record<string, string[]>

/**
 * Single-file-component-like languages that have embedded langs
 * For these langs, we exclude the standalone embedded langs from the main bundle
 */
const LANGS_LAZY_EMBEDDED_PARTIAL = [
  'vue',
  'vue-html',
  'svelte',
  'pug',
  'haml',
  'astro',
]

/**
 * Languages to be excluded from SFC langs
 */
const STANDALONG_LANGS_EMBEDDED = [
  'pug',
  'stylus',
  'sass',
  'scss',
  'coffee',
  'jsonc',
  'json5',
  'yaml',
  'toml',
  'scss',
  'graphql',
  'markdown',
  'less',
  'jsx',
  'tsx',
  'ruby',
]

export async function prepareLangs() {
  const allLangFiles = await fg('*.json', {
    cwd: './node_modules/tm-grammars/grammars',
    absolute: true,
    onlyFiles: true,
  })

  allLangFiles.sort()

  const resolvedLangs: LanguageRegistration[] = []

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
    if (LANGS_LAZY_EMBEDDED_ALL[lang.name]) {
      const includes = LANGS_LAZY_EMBEDDED_ALL[lang.name]
      json.embeddedLangsLazy = (json.embeddedLangs || []).filter(i => !includes.includes(i)) || []
      json.embeddedLangs = includes
    }
    else if (LANGS_LAZY_EMBEDDED_PARTIAL.includes(lang.name)) {
      json.embeddedLangsLazy = (json.embeddedLangs || []).filter(i => STANDALONG_LANGS_EMBEDDED.includes(i)) || []
      json.embeddedLangs = (json.embeddedLangs || []).filter(i => !STANDALONG_LANGS_EMBEDDED.includes(i)) || []
    }

    const deps: string[] = json.embeddedLangs || []
    resolvedLangs.push(json)

    if (deps.length > 10)
      console.log(json.name, json.embeddedLangs)

    await fs.writeFile(
      `./src/langs/${lang.name}.mjs`,
      `${deps.map(i => `import ${i.replace(/\W/g, '_')} from './${i}.mjs'`).join('\n')}

const lang = Object.freeze(JSON.parse(${JSON.stringify(JSON.stringify(json))}))

export default [
${[
    ...deps.map(i => `  ...${i.replace(/\W/g, '_')}`),
    '  lang',
  ].join(',\n') || ''}
]
`.replace(/\n{2,}/g, '\n\n').trimStart(),
      'utf-8',
    )

    for (const alias of json.aliases || []) {
      if (isInvalidFilename(alias))
        continue
      await fs.writeFile(
        `./src/langs/${alias}.mjs`,
        `/* Alias ${alias} for ${lang.name} */
export { default } from './${lang.name}.mjs'
`,
        'utf-8',
      )
    }

    for (const name of [...json.aliases || [], lang.name]) {
      if (isInvalidFilename(name))
        continue
      await fs.writeFile(
        `./src/langs/${name}.d.mts`,
        `import type { LanguageRegistration } from '@shikijs/core'
const langs: LanguageRegistration []
export default langs
`,
        'utf-8',
      )
    }
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
        const lang = resolvedLangs.find(i => i.name === id)
        if (!lang)
          continue
        for (const e of lang.embeddedLangs || []) {
          if (!bundledIds.has(e)) {
            bundledIds.add(e)
            changed = true
          }
        }
      }
    }

    const bundled = Array.from(bundledIds).map(id => grammars.find(i => i.name === id)!).filter(Boolean)

    const info = bundled
      .map(i => ({
        id: i.name,
        name: i.displayName || i.name,
        aliases: i.aliases,
        import: `__(() => import('./langs/${i.name}.mjs')) as DynamicImportLanguageRegistration__`,
      }) as const)
      .sort((a, b) => a.id.localeCompare(b.id))

    const type = info.flatMap(i => [...i.aliases || [], i.id]).sort().map(i => `  | '${i}'`).join('\n')

    await fs.writeFile(
      `src/${fileName}.ts`,
      `${COMMENT_HEAD}
import type { DynamicImportLanguageRegistration, BundledLanguageInfo } from '@shikijs/core'

export const bundledLanguagesInfo: BundledLanguageInfo[] = ${JSON.stringify(info, null, 2).replace(/"__|__"/g, '').replace(/"/g, '\'')}

export const bundledLanguagesBase = Object.fromEntries(bundledLanguagesInfo.map(i => [i.id, i.import]))

export const bundledLanguagesAlias = Object.fromEntries(bundledLanguagesInfo.flatMap(i => i.aliases?.map(a => [a, i.import]) || []))

export type BundledLanguage =
${type}

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

function isInvalidFilename(filename: string) {
  return !filename.match(/^[\w-]+$/)
}
