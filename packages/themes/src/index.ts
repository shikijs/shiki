import * as fs from 'fs'
import * as path from 'path'
import { loadTheme, IShikiTheme } from './loadTheme'
import { TTheme } from './types';
export * from './types'

const vscThemes = [
  'abyss',
  'dark_vs',
  'light_vs',
  'hc_black',
  'dark_plus',
  'light_plus',
  'kimbie_dark',
  'monokai',
  'monokai_dimmed',
  'quietlight',
  'red',
  'solarized_dark',
  'solarized_light'
]

export const materialThemes = [
  'Darker-High-Contrast',
  'Darker',
  'Default-High-Contrast',
  'Default',
  'Lighter-High-Contrast',
  'Lighter',
  'Ocean-High-Contrast',
  'Ocean',
  'Palenight-High-Contrast',
  'Palenight',
]

export const niceThemes = [
  'nord',
  'min-light',
  'min-dark',
  'white',
  'white-night',
  'zeit',
]

function mapF(subdir: string) {
  return n => {
    const p = fs.existsSync(path.resolve(__dirname, `../data/${subdir}/${n}.json`))
      ? path.resolve(__dirname, `../data/${subdir}/${n}.json`)
      : path.resolve(__dirname, `../data/${subdir}/${n}.tmTheme`)

    return loadTheme(p)
  }
}

export function getTheme(t: TTheme): IShikiTheme {
  if (vscThemes.includes(t)) {
    return mapF('vscode')(t)
  }

  if (materialThemes.includes(t)) {
    return mapF('material')(t)
  }

  if (niceThemes.includes(t)) {
    return mapF('nice')(t)
  }

  throw Error(`No theme ${t} found`)
}

export { loadTheme, IShikiTheme } from './loadTheme'
