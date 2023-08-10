import type { IOnigLib, RegistryOptions } from 'vscode-textmate'

import type { LanguageRegistration } from './types'

export class Resolver implements RegistryOptions {
  public languagesPath: string = 'languages/'

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
    const lang = this.scopeToLangMap[scopeName]

    if (!lang)
      return null

    if (lang.grammar)
      return lang.grammar

    return null
  }

  public addLanguage(l: LanguageRegistration) {
    this.languageMap[l.id] = l
    if (l.aliases) {
      l.aliases.forEach((a) => {
        this.languageMap[a] = l
      })
    }
    this.scopeToLangMap[l.scopeName] = l
  }
}
