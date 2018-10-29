import * as fs from 'fs'
import * as path from 'path'

import { IRawTheme, Registry } from 'vscode-textmate'

import * as plist from './plist'
import { Resolver } from './resolver'

const THEMES_TEST_PATH = path.resolve(__dirname, '../data/themes')

export interface ThemeData {
  themeName: string
  theme: IRawTheme
  registry: Registry
}

export class ThemeInfo {
  private _themeName: string
  private _filename: string
  private _includeFilename: string

  constructor(themeName: string, filename: string, includeFilename?: string) {
    this._themeName = themeName
    this._filename = filename
    this._includeFilename = includeFilename
  }

  private static _loadThemeFile(filename: string): IRawTheme {
    let fullPath = path.join(THEMES_TEST_PATH, filename)
    let fileContents = fs.readFileSync(fullPath).toString()

    if (/\.json$/.test(filename)) {
      return JSON.parse(fileContents)
    }
    return plist.parse(fileContents)
  }

  public create(resolver: Resolver): ThemeData {
    let theme: IRawTheme = ThemeInfo._loadThemeFile(this._filename)
    if (this._includeFilename) {
      let includeTheme: IRawTheme = ThemeInfo._loadThemeFile(this._includeFilename)
      ;(<any>theme).settings = includeTheme.settings.concat(theme.settings)
    }

    // console.log(JSON.stringify(theme, null, '\t')); process.exit(0);

    let registry = new Registry(resolver)
    registry.setTheme(theme)

    return {
      themeName: this._themeName,
      theme: theme,
      registry: registry
    }
  }
}