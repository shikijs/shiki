import * as path from 'path'

import { loadTheme, IShikiTheme } from './loadTheme'
import { Theme, themes } from './theme'

export { Theme, themes as BUNDLED_THEMES } from './theme'

const allThemes = {}

for (let theme of themes) {
  allThemes[theme] = loadTheme(path.resolve(__dirname, '../data', `${theme}.json`))
}

export function getTheme(t: Theme): IShikiTheme {
  if (t in allThemes) {
    return allThemes[t]
  }

  throw Error(`No theme ${t} found`)
}

export { loadTheme, IShikiTheme } from './loadTheme'
