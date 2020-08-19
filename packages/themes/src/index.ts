import * as path from 'path'

import { loadTheme, IShikiTheme } from './loadTheme'
import { TTheme } from './types'

export * from './types'

const themes = [
  'dark-plus',
  'light-plus',
  'monokai',
  'solarized-dark',
  'solarized-light',
  'material-theme-darker',
  'material-theme-default',
  'material-theme-lighter',
  'material-theme-ocean',
  'material-theme-palenight',
  'github-dark',
  'github-light',
  'nord',
  'min-light',
  'min-dark'
]

const allThemes = {}

for (let theme of themes) {
  allThemes[theme] = loadTheme(path.resolve(__dirname, '../data', `${theme}.json`))
}

export function getTheme(t: TTheme): IShikiTheme {
  if (t in allThemes) {
    return allThemes[t]
  }

  throw Error(`No theme ${t} found`)
}

export { loadTheme, IShikiTheme } from './loadTheme'
