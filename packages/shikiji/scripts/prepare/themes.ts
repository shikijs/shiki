import fs from 'fs-extra'
import { BUNDLED_THEMES } from 'shiki'
import { COMMENT_HEAD } from './constants'

export async function prepareTheme() {
  const themes = BUNDLED_THEMES.sort()
    .filter(i => i !== 'css-variables')
    .map((id) => {
      const theme = fs.readJSONSync(`./node_modules/shiki/themes/${id}.json`)

      return {
        id,
        name: guessThemeName(id, theme),
        type: guessThemeType(id, theme),
        import: `__(() => import('shiki/themes/${id}.json')) as unknown as DynamicThemeReg__`,
      }
    })
  await fs.writeFile(
    'src/assets/themes.ts',
`${COMMENT_HEAD}
import type { ThemeRegistrationRaw } from 'shikiji-core'

type DynamicThemeReg = () => Promise<{ default: ThemeRegistrationRaw }>

export interface BundledThemeInfo {
  id: string
  name: string
  type: 'light' | 'dark'
  import: DynamicThemeReg
}

export const bundledThemesInfo: BundledThemeInfo[] = ${JSON.stringify(themes, null, 2).replace(/"__|__"/g, '')}

export type BuiltinTheme = ${themes.map(i => `'${i.id}'`).join(' | ')}

export const bundledThemes = Object.fromEntries(bundledThemesInfo.map(i => [i.id, i.import])) as Record<BuiltinTheme, DynamicThemeReg>
`,
'utf-8',
  )
  await fs.writeJSON(
    'src/assets/themes.json',
    BUNDLED_THEMES
      .filter(i => i !== 'css-variables')
      .map(i => ({
        id: i,
      })),
    { spaces: 2 },
  )
}

function isLightColor(hex: string) {
  const [r, g, b] = hex.slice(1).match(/.{2}/g)!.map(i => Number.parseInt(i, 16))
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

function guessThemeType(id: string, theme: any) {
  let color
  if (id.includes('dark') || id.includes('dimmed') || id.includes('black'))
    color = 'dark'
  else if (id.includes('light') || id.includes('white') || id === 'slack-ochin')
    color = 'light'
  else if (theme.colors.background)
    color = isLightColor(theme.colors.background) ? 'light' : 'dark'
  else if (theme.colors['editor.background'])
    color = isLightColor(theme.colors['editor.background']) ? 'light' : 'dark'
  else if (theme.colors.foreground)
    color = isLightColor(theme.colors.foreground) ? 'dark' : 'light'

  else
    color = 'light'
  return color
}

function guessThemeName(id: string, theme: any) {
  if (theme.displayName)
    return theme.displayName
  let name: string = theme.name || id
  name = name.split(/[_-]/).map(i => i[0].toUpperCase() + i.slice(1)).join(' ')
  name = name.replace(/github/ig, 'GitHub')
  return name
}
