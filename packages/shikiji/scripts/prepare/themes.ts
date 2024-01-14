import fs from 'fs-extra'
import { themes as allThemes } from 'tm-themes'
import { COMMENT_HEAD } from './constants'

export async function prepareTheme() {
  const themes = await Promise.all(allThemes
    .map(async (t) => {
      const theme = await fs.readJSON(`./node_modules/tm-themes/themes/${t.name}.json`)

      await fs.writeFile(
        `./src/assets/themes/${t.name}.js`,
        `${COMMENT_HEAD}
export default Object.freeze(${JSON.stringify(theme, null, 2)})
`,
        'utf-8',
      )

      await fs.writeFile(
        `./src/assets/themes/${t.name}.d.ts`,
        `${COMMENT_HEAD}
import type { ThemeRegistration } from 'shikiji-core'

const theme: ThemeRegistration
export default theme
`,
        'utf-8',
      )

      return {
        id: t.name,
        displayName: theme.displayName,
        type: theme.type,
        import: `__(() => import('./themes/${t.name}')) as unknown as DynamicImportThemeRegistration__`,
      }
    }))
  await fs.writeFile(
    'src/assets/themes.ts',
`${COMMENT_HEAD}
import type { DynamicImportThemeRegistration, BundledThemeInfo } from 'shikiji-core'

export const bundledThemesInfo: BundledThemeInfo[] = ${JSON.stringify(themes, null, 2).replace(/"__|__"/g, '')}

export type BundledTheme = ${themes.map(i => `'${i.id}'`).join(' | ')}

export const bundledThemes = Object.fromEntries(bundledThemesInfo.map(i => [i.id, i.import])) as Record<BundledTheme, DynamicImportThemeRegistration>
`,
'utf-8',
  )
}
