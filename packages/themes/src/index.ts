import * as fs from 'fs'
import * as path from 'path'
import { loadTheme } from './loadTheme'

function mapF (subdir: string) {
  return (n) => {
    const p = fs.existsSync(path.resolve(__dirname, `../data/${subdir}/${n}.json`))
      ? path.resolve(__dirname, `../data/${subdir}/${n}.json`) 
      : path.resolve(__dirname, `../data/${subdir}/${n}.tmTheme`) 

    return loadTheme(n)
  }
}

export const vscode = [
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
].map(mapF('vscode'))

export const material = [
  'Darker-High-Contrast',
  'Darker',
  'Default-High-Contrast',
  'Default',
  'Icons-Darker',
  'Icons-Light',
  'Icons-Ocean',
  'Icons-Palenight',
  'Icons',
  'Lighter-High-Contrast',
  'Lighter',
  'Ocean-High-Contrast',
  'Ocean',
  'Palenight-High-Contrast',
  'Palenight'
].map(mapF('material'))

export const nice = [
  'nord',
  'min-light',
  'min-dark',
  'white',
  'white-night',
  'zeit'
].map(mapF('nice'))

export { loadTheme } from './loadTheme'
