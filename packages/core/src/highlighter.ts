import { codeToHast } from './code-to-hast'
import { codeToHtml } from './code-to-html'
import { codeToTokens } from './code-to-tokens'
import { codeToTokensBase } from './code-to-tokens-base'
import { codeToTokensWithThemes } from './code-to-tokens-themes'
import { getShikiInternal } from './internal'
import type { HighlighterCoreOptions, HighlighterGeneric } from './types'

export type HighlighterCore = HighlighterGeneric<never, never>

/**
 * Create a Shiki core highlighter instance, with no languages or themes bundled.
 * Wasm and each language and theme must be loaded manually.
 *
 * @see http://shiki.style/guide/install#fine-grained-bundle
 */
export async function getHighlighterCore(options: HighlighterCoreOptions = {}): Promise<HighlighterCore> {
  const internal = await getShikiInternal(options)

  return {
    codeToTokensBase: (code, options) => codeToTokensBase(internal, code, options),
    codeToTokensWithThemes: (code, options) => codeToTokensWithThemes(internal, code, options),
    codeToTokens: (code, options) => codeToTokens(internal, code, options),
    codeToHast: (code, options) => codeToHast(internal, code, options),
    codeToHtml: (code, options) => codeToHtml(internal, code, options),

    loadLanguage: internal.loadLanguage,
    loadTheme: internal.loadTheme,

    getTheme: internal.getTheme,
    getLangGrammar: internal.getLangGrammar,
    setTheme: internal.setTheme,

    getLoadedThemes: internal.getLoadedThemes,
    getLoadedLanguages: internal.getLoadedLanguages,

    getInternalContext: () => internal,

    /** @deprecated */
    codeToThemedTokens: (code, options) => codeToTokensBase(internal, code, options),
  }
}
