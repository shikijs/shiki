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
    ...getThemeDefaultColors(rawTheme)
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
   * @description text default foreground color
   */
  fg: string

  /**
   * @description text default background color
   */
  bg: string

  /**
   * @description relative path of included theme
   */
  include?: string
}

/**
 * https://github.com/microsoft/vscode/blob/f7f05dee53fb33fe023db2e06e30a89d3094488f/src/vs/platform/theme/common/colorRegistry.ts#L258-L268
 */
const VSCODE_FALLBACK_EDITOR_FG = { light: '#333333', dark: '#bbbbbb' }
const VSCODE_FALLBACK_EDITOR_BG = { light: '#fffffe', dark: '#1e1e1e' }

function getThemeDefaultColors(theme: IRawTheme & { type?: string }): { fg: string; bg: string } {
  let fg, bg

  /**
   * First try:
   * Theme might contain a global `tokenColor` without `name` or `scope`
   * Used as default value for foreground/background
   */
  let settings = theme.settings ? theme.settings : (<any>theme).tokenColors
  const globalSetting = settings
    ? settings.find(s => {
        return !s.name && !s.scope
      })
    : undefined

  if (globalSetting?.settings?.foreground) {
    fg = globalSetting.settings.foreground
  }
  if (globalSetting?.settings?.background) {
    bg = globalSetting.settings.background
  }

  /**
   * Second try:
   * If there's no global `tokenColor` without `name` or `scope`
   * Use `editor.foreground` and `editor.background`
   */
  if (!fg && (<any>theme)?.colors['editor.foreground']) {
    fg = (<any>theme).colors['editor.foreground']
  }
  if (!bg && (<any>theme)?.colors['editor.background']) {
    bg = (<any>theme).colors['editor.background']
  }

  /**
   * Last try:
   * If there's no fg/bg color specified in theme, use default
   */
  if (!fg) {
    fg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark
  }
  if (!bg) {
    bg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark
  }

  return {
    fg,
    bg
  }
}
