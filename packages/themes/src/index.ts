import path from 'path'

import { loadTheme, IShikiTheme } from './loadTheme'
import { Theme } from './theme'

export { Theme, themes as BUNDLED_THEMES } from './theme'

export { loadTheme, IShikiTheme } from './loadTheme'

const theme_cache = {}

export async function getTheme(name: Theme): Promise<IShikiTheme> {
  if (!theme_cache[name]) {
    theme_cache[name] = await loadTheme(path.resolve(__dirname, '../data', `${name}.json`))
  }
  if (theme_cache[name]) {
    return theme_cache[name]
  }

  throw Error(`No theme ${name} found`)
}
