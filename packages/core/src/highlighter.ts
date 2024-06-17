import { codeToHast } from './code-to-hast'
import { codeToHtml } from './code-to-html'
import { codeToTokens } from './code-to-tokens'
import { codeToTokensBase } from './code-to-tokens-base'
import { codeToTokensWithThemes } from './code-to-tokens-themes'
import { createShikiInternal } from './internal'
import type { HighlighterCore, HighlighterCoreOptions } from './types'

/**
 * Create a Shiki core highlighter instance, with no languages or themes bundled.
 * Wasm and each language and theme must be loaded manually.
 *
 * @see http://shiki.style/guide/install#fine-grained-bundle
 */
export async function createHighlighterCore(options: HighlighterCoreOptions = {}): Promise<HighlighterCore> {
  const internal = await createShikiInternal(options)

  return {
    codeToTokensBase: (code, options) => codeToTokensBase(internal, code, options),
    codeToTokensWithThemes: (code, options) => codeToTokensWithThemes(internal, code, options),
    codeToTokens: (code, options) => codeToTokens(internal, code, options),
    codeToHast: (code, options) => codeToHast(internal, code, options),
    codeToHtml: (code, options) => codeToHtml(internal, code, options),
    ...internal,
    getInternalContext: () => internal,
  }
}
