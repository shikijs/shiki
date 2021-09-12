import fs from 'fs'
import path from 'path'
import { parseJson } from '../util/parse'

const THEME_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/themes')

function readJsonC(f: string) {
  const p = path.resolve(THEME_FOLDER_PATH, f)
  if (!fs.existsSync(p)) {
    return undefined
  }

  return parseJson(fs.readFileSync(p, 'utf-8'))
}

/**
 * Handle dark/light plus
 *
 * - Merge dark_vs into dark_plus
 * - Merge light_vs into light_plus
 * - Unshift `editor.foreground` and `editor.background` to beginning of `tokenColors`.
 * - Remove dark_vs and light_vs
 */
const darkVSContent = readJsonC('dark_vs.json')
const darkPlusContent = readJsonC('dark_plus.json')

if (darkVSContent && darkPlusContent) {
  delete darkPlusContent['include']
  const darkDefaultFgBgTokenColor = {
    settings: {
      foreground: darkVSContent['colors']['editor.foreground']
    }
  }
  darkPlusContent.name = 'dark-plus'
  darkPlusContent.colors = { ...darkVSContent.colors }
  darkPlusContent.tokenColors = [
    darkDefaultFgBgTokenColor,
    ...darkVSContent.tokenColors,
    ...darkPlusContent.tokenColors
  ]
  darkPlusContent.semanticTokenColors = {
    ...darkVSContent.semanticTokenColors,
    ...darkPlusContent.semanticTokenColors
  }

  fs.writeFileSync(
    path.resolve(THEME_FOLDER_PATH, 'dark_plus.json'),
    JSON.stringify(darkPlusContent, null, 2)
  )
}

const lightVSContent = readJsonC('light_vs.json')
const lightPlusContent = readJsonC('light_plus.json')

if (lightVSContent && lightPlusContent) {
  delete lightPlusContent['include']
  const lightDefaultFgBgTokenColor = {
    settings: {
      foreground: lightVSContent['colors']['editor.foreground']
    }
  }
  lightPlusContent.name = 'light-plus'
  lightPlusContent.colors = { ...lightVSContent.colors }
  lightPlusContent.tokenColors = [
    lightDefaultFgBgTokenColor,
    ...lightVSContent.tokenColors,
    ...lightPlusContent.tokenColors
  ]
  lightPlusContent.semanticTokenColors = {
    ...lightVSContent.semanticTokenColors,
    ...lightPlusContent.semanticTokenColors
  }

  fs.writeFileSync(
    path.resolve(THEME_FOLDER_PATH, 'light_plus.json'),
    JSON.stringify(lightPlusContent, null, 2)
  )
}
