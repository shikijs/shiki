import { IRawTheme, IRawThemeSetting } from 'vscode-textmate'

import * as fs from 'fs'
import * as path from 'path'
import { parse as plistParse } from './plist'
import * as JSON5 from 'json5'

function loadJSONTheme(themePath: string): IRawTheme {
  const fileContents = fs.readFileSync(themePath, 'utf-8')

  return JSON5.parse(fileContents)
}
function loadPListTheme(themePath: string): IRawTheme {
  const fileContents = fs.readFileSync(themePath, 'utf-8')

  return plistParse(fileContents)
}

function toShikiTheme(rawTheme: IRawTheme): IShikiTheme {
  const shikiTheme: IShikiTheme = {
    ...rawTheme,
    bg: getThemeBg(rawTheme)
  }

  if ((<any>rawTheme).include) {
    shikiTheme.include = (<any>rawTheme).include
  }
  if ((<any>rawTheme).tokenColors) {
    shikiTheme.settings = (<any>rawTheme).tokenColors
  }

  return shikiTheme
}

/**
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
    const includedThemePath = path.resolve(themePath, '..', shikiTheme.include)
    const includedTheme = loadTheme(includedThemePath)

    if (includedTheme.settings) {
      shikiTheme.settings = shikiTheme.settings.concat(includedTheme.settings)
    }

    if (includedTheme.bg && !shikiTheme.bg) {
      shikiTheme.bg = includedTheme.bg
    }
  }

  return shikiTheme
}

export interface IShikiTheme extends IRawTheme {
  /**
   * @description theme name
   */
  name?: string

  /**
   * tokenColors of the theme file
   */
  settings: IRawThemeSetting[]

  /**
   * @description text background color
   */
  bg: string

  /**
   * @description relative path of included theme
   */
  include?: string
}

function getThemeBg(theme: IRawTheme): string {
  if ((<any>theme).colors && (<any>theme).colors['editor.background']) {
    return (<any>theme).colors['editor.background']
  }
  let settings = theme.settings ? theme.settings : (<any>theme).tokenColors

  const globalSetting = settings.find(s => {
    return !s.name && !s.scope
  })

  return globalSetting ? globalSetting.settings.background : null
}
