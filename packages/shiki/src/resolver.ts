/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict'

import { IRawGrammar, IOnigLib, parseRawGrammar, RegistryOptions } from 'vscode-textmate'
import { ILanguageRegistration } from 'shiki-languages'

import * as fs from 'fs'

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

    const g = await readGrammarFromPath(lang.path)
    lang.grammar = g
    return g
  }
}

function readGrammarFromPath(path: string): Promise<IRawGrammar> {
  return new Promise((c, e) => {
    fs.readFile(path, (error, content) => {
      if (error) {
        e(error)
      } else {
        c(parseRawGrammar(content.toString(), path))
      }
    })
  })
}
