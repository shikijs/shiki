import fs from 'fs-extra'
import { BUNDLED_LANGUAGES, BUNDLED_THEMES } from 'shiki'
import fg from 'fast-glob'

const files = await fg('*.json', {
  cwd: './node_modules/shiki/languages',
  absolute: true,
  onlyFiles: true,
})

await fs.ensureDir('./src/vendor/languages')
await fs.emptyDir('./src/vendor/languages')

for (const file of files) {
  const content = await fs.readJSON(file)
  const lang = BUNDLED_LANGUAGES.find(i => i.id === content.name)
  if (!lang) {
    console.warn(`unknown ${content.name}`)
    continue
  }

  await fs.writeJSON(`./src/vendor/languages/${lang.id}.json`, {
    ...content,
    name: content.name || lang.id,
    scopeName: content.scopeName || lang.scopeName,
    displayName: lang.displayName,
    aliases: lang.aliases,
    embeddedLangs: lang.embeddedLangs,
    balancedBracketSelectors: lang.balancedBracketSelectors,
    unbalancedBracketSelectors: lang.unbalancedBracketSelectors,
  }, { spaces: 2 })
}

const languages = Object.fromEntries(BUNDLED_LANGUAGES.map(i => [i.id, `__()=>import('./languages/${i.id}.json').then(r=>r.default as unknown as LanguageRegistration)__`]))

const themes = Object.fromEntries(BUNDLED_THEMES.map(i => [i, `__()=>import('shiki/themes/${i}.json').then(r=>r.default as unknown as ThemeRegisterationRaw)__`]))

await fs.writeFile(
  'src/vendor/langs.ts',
  `import type { LanguageRegistration } from '../types'

export const bundledLanguages = ${JSON.stringify(languages, null, 2).replace(/"__|__"/g, '')}`,
  'utf-8',
)

await fs.writeFile(
  'src/vendor/themes.ts',
  `import type { ThemeRegisterationRaw } from '../types'

export const bundledThemes = ${JSON.stringify(themes, null, 2).replace(/"__|__"/g, '')}`,
  'utf-8',
)
