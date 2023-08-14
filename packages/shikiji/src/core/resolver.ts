import type { IOnigLib, RegistryOptions } from 'vscode-textmate'

import type { LanguageRegistration } from '../types'

export class Resolver implements RegistryOptions {
  private readonly languageMap: { [langIdOrAlias: string]: LanguageRegistration } = {}
  private readonly scopeToLangMap: { [scope: string]: LanguageRegistration } = {}

  private readonly _onigLibPromise: Promise<IOnigLib>
  private readonly _onigLibName: string

  constructor(onigLibPromise: Promise<IOnigLib>, onigLibName: string, langs: LanguageRegistration[]) {
    this._onigLibPromise = onigLibPromise
    this._onigLibName = onigLibName

    langs.forEach(i => this.addLanguage(i))
  }

  public get onigLib(): Promise<IOnigLib> {
    return this._onigLibPromise
  }

  public getOnigLibName(): string {
    return this._onigLibName
  }

  public getLangRegistration(langIdOrAlias: string): LanguageRegistration {
    return this.languageMap[langIdOrAlias]
  }

  public async loadGrammar(scopeName: string): Promise<any> {
    return this.scopeToLangMap[scopeName]
  }

  public addLanguage(l: LanguageRegistration) {
    this.languageMap[l.name] = l
    if (l.aliases) {
      l.aliases.forEach((a) => {
        this.languageMap[a] = l
      })
    }
    this.scopeToLangMap[l.scopeName] = l
  }
}
