import type { IOnigLib, RegistryOptions } from './textmate'
import type { LanguageRegistration } from './types'

export class Resolver implements RegistryOptions {
  private readonly _langs = new Map<string, LanguageRegistration>()
  private readonly _scopeToLang = new Map<string, LanguageRegistration>()
  private readonly _injections = new Map<string, string[]>()

  private readonly _onigLibPromise: Promise<IOnigLib>

  constructor(onigLibPromise: Promise<IOnigLib>, langs: LanguageRegistration[]) {
    this._onigLibPromise = onigLibPromise
    langs.forEach(i => this.addLanguage(i))
  }

  public get onigLib(): Promise<IOnigLib> {
    return this._onigLibPromise
  }

  public getLangRegistration(langIdOrAlias: string): LanguageRegistration {
    return this._langs.get(langIdOrAlias)!
  }

  public async loadGrammar(scopeName: string): Promise<any> {
    return this._scopeToLang.get(scopeName)!
  }

  public addLanguage(l: LanguageRegistration) {
    this._langs.set(l.name, l)
    if (l.aliases) {
      l.aliases.forEach((a) => {
        this._langs.set(a, l)
      })
    }
    this._scopeToLang.set(l.scopeName, l)
    if (l.injectTo) {
      l.injectTo.forEach((i) => {
        if (!this._injections.get(i))
          this._injections.set(i, [])
        this._injections.get(i)!.push(l.scopeName)
      })
    }
  }

  public getInjections(scopeName: string): string[] | undefined {
    const scopeParts = scopeName.split('.')
    let injections: string[] = []
    for (let i = 1; i <= scopeParts.length; i++) {
      const subScopeName = scopeParts.slice(0, i).join('.')
      injections = [...injections, ...(this._injections.get(subScopeName) || [])]
    }
    return injections
  }
}
