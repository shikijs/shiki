import { IRawTheme } from 'vscode-textmate'

import * as fs from 'fs'
import * as path from 'path'
import { parse as plistParse } from './plist'

function loadJSONTheme(themePath: string): IRawTheme {
  const fileContents = fs.readFileSync(themePath, 'utf-8')

  return JSON.parse(fileContents)
}
function loadPListTheme(themePath: string): IRawTheme {
  const fileContents = fs.readFileSync(themePath, 'utf-8')

  return plistParse(fileContents)
}

function toShikiTheme(rawTheme: IRawTheme): IShikiTheme {
  const bg = getThemeBg(rawTheme)
  const shikiTheme: IShikiTheme = {
    ...rawTheme,
    bg
  }
  if ((<any>rawTheme).include) {
    shikiTheme.include = (<any>rawTheme).include
  }

  return shikiTheme
}

/**
 * 
 * @param themePath Absolute path to theme.json / theme.tmTheme
 */
export function loadTheme(themePath: string): IShikiTheme {
  let theme: IRawTheme

  if (/\.json$/.test(themePath)) {
    theme = loadJSONTheme(themePath)
  } else {
    theme = loadPListTheme(themePath)
  }

  const shikiTheme = toShikiTheme(theme)

  if (shikiTheme.include) {
    const includedThemePath = path.resolve(themePath, shikiTheme.include)
    const includedTheme = loadTheme(includedThemePath)
    ;(<any>shikiTheme).settings = theme.settings.concat(includedTheme.settings)
  }

  return shikiTheme
}

export interface IShikiTheme extends IRawTheme {
  /**
   * @description text background color
   */
  bg: string;

  /**
   * @description relative path of included theme
   */
  include?: string
}

function getThemeBg(theme: IRawTheme): string {
  const globalSetting = theme.settings.find(s => {
    return !s.name && !s.scope
  })

  return globalSetting ? globalSetting.settings.background : null
}
