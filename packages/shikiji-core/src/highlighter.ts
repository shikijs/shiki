import { codeToHast } from './code-to-hast'
import { codeToHtml } from './code-to-html'
import { codeToThemedTokens } from './code-to-tokens'
import { codeToTokensWithThemes } from './code-to-tokens-themes'
import { getShikiInternal } from './internal'
import type { HighlighterCoreOptions, HighlighterGeneric } from './types'

export type HighlighterCore = HighlighterGeneric<never, never>

/**
 * Create a Shikiji core highlighter instance, with no languages or themes bundled.
 * Wasm and each language and theme must be loaded manually.
 *
 * @see http://shikiji.netlify.app/guide/install#fine-grained-bundle
 */
export async function getHighlighterCore(options: HighlighterCoreOptions = {}): Promise<HighlighterCore> {
  const internal = await getShikiInternal(options)

  return {
    codeToThemedTokens: (code, options) => codeToThemedTokens(internal, code, options),
    codeToTokensWithThemes: (code, options) => codeToTokensWithThemes(internal, code, options),
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
  }
}
