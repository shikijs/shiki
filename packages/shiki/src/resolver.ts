/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict'

import { IRawGrammar, IOnigLib, parseRawGrammar, RegistryOptions } from 'vscode-textmate'
import { ILanguageRegistration } from 'shiki-languages'
import path from 'path'

import { promises as fs } from 'fs'
import { getTheme } from './loader'
import { IShikiTheme, IThemeRegistration } from './types'
import { Theme } from './themes'

export class Resolver implements RegistryOptions {
  private readonly langMap: { [langIdOrAlias: string]: ILanguageRegistration } = {}
  private readonly scopeToLangMap: { [scope: string]: ILanguageRegistration } = {}

  private readonly _languages: ILanguageRegistration[]
  private readonly _onigLibPromise: Promise<IOnigLib>
  private readonly _onigLibName: string

  constructor(
    languages: ILanguageRegistration[],
    onigLibPromise: Promise<IOnigLib>,
    onigLibName: string
  ) {
    this._languages = languages
    this._onigLibPromise = onigLibPromise
    this._onigLibName = onigLibName

    this._languages.forEach(l => {
      this.langMap[l.id] = l
      if (l.aliases) {
        l.aliases.forEach(a => {
          this.langMap[a] = l
        })
      }
      this.scopeToLangMap[l.scopeName] = l
    })
  }

  public get onigLib(): Promise<IOnigLib> {
    return this._onigLibPromise
  }

  public getOnigLibName(): string {
    return this._onigLibName
  }

  public getLangRegistration(langIdOrAlias: string): ILanguageRegistration {
    return this.langMap[langIdOrAlias]
  }

  public async loadGrammar(scopeName: string): Promise<IRawGrammar> {
    const lang = this.scopeToLangMap[scopeName]

    if (!lang) {
      return null
    }

    if (lang.grammar) {
      return lang.grammar
    }

    const g = await this.readGrammarFromPath(path.resolve(__dirname, '../languages', lang.path))
    lang.grammar = g
    return g
  }

  private async readGrammarFromPath(path: string): Promise<IRawGrammar> {
    const content = await fs.readFile(path, 'utf-8')
    return parseRawGrammar(content.toString(), path)
  }

  async resolveTheme(theme: Theme | IShikiTheme) {
    if (typeof theme === 'string') {
      return await getTheme(theme)
    } else if (theme.name) {
      return theme
    } else {
      throw new Error(`Failed to resolve theme ${theme}`)
    }
  }

  async resolveThemes(themes: IThemeRegistration[]) {
    const resolved: Record<string, IShikiTheme> = {}
    await Promise.all(
      themes.map(async name => {
        const theme = await this.resolveTheme(name)
        if (theme.name) themes[theme.name] = theme
      })
    )

    return resolved
  }
}
