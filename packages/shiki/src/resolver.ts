/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict'

import { IRawGrammar, IOnigLib, RegistryOptions } from 'vscode-textmate'
import { languages } from './languages'

import { fetchGrammar } from './loader'
import { ILanguageRegistration } from './types'

export class Resolver implements RegistryOptions {
  public languagesPath: string = 'languages/'

  private readonly languageMap: { [langIdOrAlias: string]: ILanguageRegistration } = {}
  private readonly scopeToLangMap: { [scope: string]: ILanguageRegistration } = {}

  private readonly _onigLibPromise: Promise<IOnigLib>
  private readonly _onigLibName: string

  constructor(onigLibPromise: Promise<IOnigLib>, onigLibName: string) {
    this._onigLibPromise = onigLibPromise
    this._onigLibName = onigLibName
  }

  public get onigLib(): Promise<IOnigLib> {
    return this._onigLibPromise
  }

  public getOnigLibName(): string {
    return this._onigLibName
  }

  public getLangRegistration(langIdOrAlias: string): ILanguageRegistration {
    return this.languageMap[langIdOrAlias]
  }

  public async loadGrammar(scopeName: string): Promise<IRawGrammar> {
    const lang = this.scopeToLangMap[scopeName]

    if (!lang) {
      return null
    }

    if (lang.grammar) {
      return lang.grammar
    }

    const g = await fetchGrammar(
      languages.includes(lang) ? `${this.languagesPath}${lang.path}` : lang.path
    )
    lang.grammar = g
    return g
  }

  public addLanguage(l: ILanguageRegistration) {
    this.languageMap[l.id] = l
    if (l.aliases) {
      l.aliases.forEach(a => {
        this.languageMap[a] = l
      })
    }
    this.scopeToLangMap[l.scopeName] = l
  }
}
