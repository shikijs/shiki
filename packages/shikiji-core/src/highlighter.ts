import type { HighlighterCoreOptions, HighlighterGeneric } from './types'
import { codeToHtml } from './renderer-html'
import { codeToTokensWithThemes } from './renderer-html-themes'
import { codeToThemedTokens } from './tokenizer'
import { getShikiInternal } from './internal'
import { codeToHast } from './renderer-hast'

export type HighlighterCore = HighlighterGeneric<never, never>

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

    getLoadedThemes: internal.getLoadedThemes,
    getLoadedLanguages: internal.getLoadedLanguages,

    getInternalContext: () => internal,
  }
}
