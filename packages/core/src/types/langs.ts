import type { RawGrammar } from './textmate'
import type { MaybeArray, MaybeGetter } from './utils'

export type PlainTextLanguage = 'text' | 'plaintext' | 'txt'
export type AnsiLanguage = 'ansi'
export type SpecialLanguage = PlainTextLanguage | AnsiLanguage

export type LanguageInput = MaybeGetter<MaybeArray<LanguageRegistration>>

export type ResolveBundleKey<T extends string> = [T] extends [never] ? string : T

export interface LanguageRegistration extends RawGrammar {
  name: string
  scopeName: string
  displayName?: string
  aliases?: string[]
  /**
   * A list of languages the current language embeds.
   * If manually specifying languages to load, make sure to load the embedded
   * languages for each parent language.
   */
  embeddedLangs?: string[]
  /**
   * A list of languages that embed the current language.
   * Unlike `embeddedLangs`, the embedded languages will not be loaded automatically.
   */
  embeddedLangsLazy?: string[]
  balancedBracketSelectors?: string[]
  unbalancedBracketSelectors?: string[]

  foldingStopMarker?: string
  foldingStartMarker?: string

  /**
   * Inject this language to other scopes.
   * Same as `injectTo` in VSCode's `contributes.grammars`.
   *
   * @see https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide#injection-grammars
   */
  injectTo?: string[]
}

export interface BundledLanguageInfo {
  id: string
  name: string
  import: DynamicImportLanguageRegistration
  aliases?: string[]
}

export type DynamicImportLanguageRegistration = () => Promise<{ default: LanguageRegistration[] }>
