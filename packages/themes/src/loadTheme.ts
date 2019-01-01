import { IRawTheme } from 'vscode-textmate'

import * as fs from 'fs'
import { parse as plistParse } from './plist'

function loadJSONTheme(themePath: string): IRawTheme {
  const fileContents = fs.readFileSync(themePath, 'utf-8')

  return JSON.parse(fileContents)
}
function loadPListTheme(themePath: string): IRawTheme {
  const fileContents = fs.readFileSync(themePath, 'utf-8')

  return plistParse(fileContents)
}

export function loadTheme(themePath: string, includedThemePath?: string): IRawTheme {
  let theme: IRawTheme

  if (/\.json$/.test(themePath)) {
    theme = loadJSONTheme(themePath)
  } else {
    theme = loadPListTheme(themePath)
  }

  if (includedThemePath) {
    const includedTheme = loadTheme(includedThemePath)
    ;(<any>theme).settings = theme.settings.concat(includedTheme.settings)
  }

  return theme
}