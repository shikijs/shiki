import * as fs from 'fs'
import * as path from 'path'
import { loadTheme, IShikiTheme } from './loadTheme'
import { TTheme } from './types'
export * from './types'

const vscThemes = [
  'dark_plus',
  'hc_black',
  'light_plus',
  'monokai',
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

export const themesOnGitHub = ['nord', 'min-light', 'min-dark']

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

  if (themesOnGitHub.includes(t)) {
    return mapF('nice')(t)
  }

  throw Error(`No theme ${t} found`)
}

export { loadTheme, IShikiTheme } from './loadTheme'
