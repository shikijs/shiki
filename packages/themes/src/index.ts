import * as path from 'path'
import { loadTheme } from './loadTheme';

function loadLocalTheme(filename: string, includeFileName?: string) {
  const THEME_PATH = path.resolve(__dirname, '../data')

  const fullPath = path.join(THEME_PATH, filename)
  const includeFileFullPath = includeFileName
    ? path.join(THEME_PATH, includeFileName)
    : null

  return loadTheme(fullPath, includeFileFullPath)
}

export const VSCODE_THEMES = {
  abyss: loadLocalTheme('vscode/Abyss.tmTheme'),
  dark_vs: loadLocalTheme('vscode/dark_vs.json'),
  light_vs: loadLocalTheme('vscode/light_vs.json'),
  hc_black: loadLocalTheme('vscode/hc_black.json'),
  dark_plus: loadLocalTheme('vscode/dark_plus.json', 'vscode/dark_vs.json'),
  light_plus: loadLocalTheme('vscode/light_plus.json', 'vscode/light_vs.json'),
  kimbie_dark: loadLocalTheme('vscode/Kimbie_dark.tmTheme'),
  monokai: loadLocalTheme('vscode/Monokai.tmTheme'),
  monokai_dimmed: loadLocalTheme('vscode/dimmed-monokai.tmTheme'),
  quietlight: loadLocalTheme('vscode/QuietLight.tmTheme'),
  red: loadLocalTheme('vscode/red.tmTheme'),
  solarized_dark: loadLocalTheme('vscode/Solarized-dark.tmTheme'),
  solarized_light: loadLocalTheme('vscode/Solarized-light.tmTheme')
}

export const NICE_THEMES = {
  tomorrow_night_blue: loadLocalTheme('nice/Tomorrow-Night-Blue.tmTheme'),
  material_palenight: loadLocalTheme('nice/Material-Theme-Palenight.json')
}

export { loadTheme } from './loadTheme'