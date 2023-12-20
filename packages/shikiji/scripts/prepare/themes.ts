import fs from 'fs-extra'
import { themes as allThemes } from 'tm-themes'
import { COMMENT_HEAD } from './constants'

export async function prepareTheme() {
  const themes = await Promise.all(allThemes
    .map(async (t) => {
      const theme = await fs.readJSON(`./node_modules/tm-themes/themes/${t.name}.json`)

      await fs.writeFile(
        `./src/assets/themes/${t.name}.ts`,
        `${COMMENT_HEAD}
import type { ThemeRegistration } from 'shikiji-core'

export default Object.freeze(${JSON.stringify(theme, null, 2)}) as unknown as ThemeRegistration
`,
        'utf-8',
      )

      return {
        id: t.name,
        displayName: theme.displayName,
        type: theme.type,
        import: `__(() => import('./themes/${t.name}')) as unknown as DynamicThemeReg__`,
      }
    }))
  await fs.writeFile(
    'src/assets/themes.ts',
`${COMMENT_HEAD}
import type { ThemeRegistrationRaw } from 'shikiji-core'

type DynamicThemeReg = () => Promise<{ default: ThemeRegistrationRaw }>

export interface BundledThemeInfo {
  id: string
  displayName: string
  type: 'light' | 'dark'
  import: DynamicThemeReg
}

export const bundledThemesInfo: BundledThemeInfo[] = ${JSON.stringify(themes, null, 2).replace(/"__|__"/g, '')}

export type BuiltinTheme = ${themes.map(i => `'${i.id}'`).join(' | ')}

export const bundledThemes = Object.fromEntries(bundledThemesInfo.map(i => [i.id, i.import])) as Record<BuiltinTheme, DynamicThemeReg>
`,
'utf-8',
  )
}
