import type { LanguageRegistration, RegexEngine } from '@shikijs/types'
import type { IOnigLib, RegistryOptions } from '@shikijs/vscode-textmate'

export class Resolver implements RegistryOptions {
  private readonly _langs = new Map<string, LanguageRegistration>()
  private readonly _scopeToLang = new Map<string, LanguageRegistration>()
  private readonly _injections = new Map<string, string[]>()

  private readonly _onigLib: IOnigLib

  constructor(engine: RegexEngine, langs: LanguageRegistration[]) {
    this._onigLib = {
      createOnigScanner: patterns => engine.createScanner(patterns),
      createOnigString: s => engine.createString(s),
    }
    langs.forEach(i => this.addLanguage(i))
  }

  public get onigLib(): IOnigLib {
    return this._onigLib
  }

  public getLangRegistration(langIdOrAlias: string): LanguageRegistration {
    return this._langs.get(langIdOrAlias)!
  }

  public loadGrammar(scopeName: string): any {
    return this._scopeToLang.get(scopeName)!
  }

  public addLanguage(l: LanguageRegistration): void {
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
