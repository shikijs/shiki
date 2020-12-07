import { IRawGrammar, IRawTheme, IRawThemeSetting } from 'vscode-textmate'
import { Theme } from './themes'

export interface ILanguageRegistration {
  id: string
  scopeName: string
  path: string
  aliases?: string[]
  grammar?: IRawGrammar
}

export type IThemeRegistration = Theme | IShikiTheme

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
