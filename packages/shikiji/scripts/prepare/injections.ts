// Download and prepare grammar injections

import fs from 'fs-extra'
import { fetch } from 'ofetch'
import { COMMENT_HEAD } from './constants'
import { cleanupLanguageReg } from './utils'

interface Injection {
  name: string
  contents: any[]
  /**
   * Bundle into a language
   */
  toLang?: string
}

export async function prepareInjections() {
  const injections = (await Promise.all([
    prepareVueInjections(),
  ])).flat()

  for (const injection of injections) {
    await fs.writeFile(
      `src/assets/langs/${injection.name}.ts`,
      `${COMMENT_HEAD}
import type { LanguageRegistration } from 'shikiji-core'

export default [
  ${injection.contents.map(i => `Object.freeze(${JSON.stringify(i, null, 2)})`).join(',\n')}
] as unknown as LanguageRegistration[]
`,
      'utf-8',
    )
  }

  return injections
}

export async function prepareVueInjections(): Promise<Injection> {
  const base = 'https://github.com/vuejs/language-tools/blob/master/extensions/vscode/'
  const pkgJson = await fetchJson(`${base}package.json?raw=true`)
  const grammars = pkgJson.contributes.grammars as any[]
  const injections = await Promise.all(grammars
    .filter(i => i.injectTo)
    .map(async (i) => {
      const content = await fetchJson(`${new URL(i.path, base).href}?raw=true`)
      return cleanupLanguageReg({
        ...content,
        name: i.language,
        injectTo: i.injectTo,
      })
    }),
  )

  return {
    name: 'vue-injections',
    toLang: 'vue',
    contents: injections,
  }
}

export function fetchJson(url: string) {
  return fetch(url).then(res => res.json())
}
