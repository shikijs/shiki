import * as fs from 'fs'
import * as path from 'path'
import { loadTheme, IShikiTheme } from './loadTheme'
import { TTheme } from './types'
export * from './types'

const vscThemes = [
  'abyss',
  'dark_plus',
  'dark_vs',
  'hc_black',
  'kimbie_dark',
  'light_plus',
  'light_vs',
  'monokai',
  'monokai_dimmed',
  'quietlight',
  'red',
  'solarized_dark',
  'solarized_light'
]

export const materialThemes = [
  'Material-Theme-Darker-High-Contrast',
  'Material-Theme-Darker',
  'Material-Theme-Default-High-Contrast',
  'Material-Theme-Default',
  'Material-Theme-Lighter-High-Contrast',
  'Material-Theme-Lighter',
  'Material-Theme-Ocean-High-Contrast',
  'Material-Theme-Ocean',
  'Material-Theme-Palenight-High-Contrast',
  'Material-Theme-Palenight'
]

export const niceThemes = ['nord', 'min-light', 'min-dark', 'white', 'white-night', 'zeit']

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
