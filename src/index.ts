import { createOnigScanner, createOnigString, loadWASM } from 'vscode-oniguruma'
import type { IOnigLib } from 'vscode-textmate'
import type { BuiltinLanguages, BuiltinThemes, LanguageInput, ThemeInput } from './types'
import { themes } from './vendor/themes'
import { languages } from './vendor/langs'
import { getHighlighter as getCoreHighlighter } from './core'

export interface HighlighterOptions {
  themes?: (ThemeInput | BuiltinThemes)[]
  langs?: (LanguageInput | BuiltinLanguages)[]
}

let _onigurumaPromise: Promise<IOnigLib> | null = null
export async function getOniguruma(): Promise<IOnigLib> {
  if (!_onigurumaPromise) {
    // @ts-expect-error anyway
    _onigurumaPromise = import('vscode-oniguruma/release/onig.wasm')
      .then(r => loadWASM({ data: r.default as ArrayBuffer }))
      .then(() => {
        return {
          createOnigScanner(patterns) {
            return createOnigScanner(patterns)
          },
          createOnigString(s) {
            return createOnigString(s)
          },
        }
      })
  }
  return _onigurumaPromise
}

export async function getHighlighter(options: HighlighterOptions = {}) {
  const _themes = (options.themes ?? ['nord']).map((i) => {
    if (typeof i === 'string')
      return themes[i]
    return i
  }) as ThemeInput[]

  const langs = (options.langs ?? Object.keys(languages) as BuiltinLanguages[])
    .map((i) => {
      if (typeof i === 'string')
        return languages[i]
      return i
    })

  return getCoreHighlighter({
    ...options,
    themes: _themes,
    langs,
    getOniguruma,
  })
}
