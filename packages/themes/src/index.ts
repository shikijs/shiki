import * as fs from 'fs'
import * as path from 'path'
import * as JSON5 from 'json5'
import { loadTheme, IShikiTheme } from './loadTheme'
import { TTheme } from './types'
export * from './types'

interface ThemeByName {
  name: string
  path: string
}

/**
 * Name read from theme file
 */
type ThemePath = string

type Theme = ThemeByName | ThemePath

const vscThemes: Theme[] = [
  { name: 'dark_plus', path: './vscode/dark_plus.json' },
  { name: 'light_plus', path: './vscode/light_plus.json' },
  { name: 'monokai', path: './vscode/monokai-color-theme.json' },
  { name: 'solarized_dark', path: './vscode/solarized-dark-color-theme.json' },
  { name: 'solarized_light', path: './vscode/solarized-light-color-theme.json' }
]

export const materialThemes: Theme[] = [
  './material/Material-Theme-Darker.json',
  './material/Material-Theme-Default.json',
  './material/Material-Theme-Lighter.json',
  './material/Material-Theme-Ocean.json',
  './material/Material-Theme-Palenight.json'
]

export const githubThemes: Theme[] = [
  './github-vscode-theme/dark.json',
  './github-vscode-theme/light.json'
]

export const themesOnGitHub: Theme[] = [
  {
    name: 'nord',
    path: 'github/nord-color-theme.json'
  },
  'github/min-light.json',
  'github/min-dark.json'
]

const allThemes = {}
for (let theme of [...vscThemes, ...materialThemes, ...githubThemes, ...themesOnGitHub]) {
  if (typeof theme === 'string') {
    const themePath = path.resolve(__dirname, '../data', theme)
    const themeContent = JSON5.parse(fs.readFileSync(themePath, 'utf-8'))
    allThemes[themeContent.name] = loadTheme(themePath)
  } else {
    allThemes[theme.name] = loadTheme(path.resolve(__dirname, '../data', theme.path))
  }
}

// console.log(Object.keys(allThemes))

export function getTheme(t: TTheme): IShikiTheme {
  if (t in allThemes) {
    return allThemes[t]
  }

  throw Error(`No theme ${t} found`)
}

export { loadTheme, IShikiTheme } from './loadTheme'
