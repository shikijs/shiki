import { codeToHast } from './code-to-hast'
import { codeToHtml } from './code-to-html'
import { codeToTokens } from './code-to-tokens'
import { codeToTokensBase, getLastGrammarState } from './code-to-tokens-base'
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
    getLastGrammarState: (code, options) => getLastGrammarState(internal, code, options),
    codeToTokensBase: (code, options) => codeToTokensBase(internal, code, options),
    codeToTokensWithThemes: (code, options) => codeToTokensWithThemes(internal, code, options),
    codeToTokens: (code, options) => codeToTokens(internal, code, options),
    codeToHast: (code, options) => codeToHast(internal, code, options),
    codeToHtml: (code, options) => codeToHtml(internal, code, options),
    ...internal,
    getInternalContext: () => internal,
  }
}

export function makeSingletonHighlighterCore(createHighlighter: typeof createHighlighterCore) {
  let _shiki: ReturnType<typeof createHighlighterCore>

  async function getSingletonHighlighterCore(
    options: Partial<HighlighterCoreOptions> = {},
  ) {
    if (!_shiki) {
      _shiki = createHighlighter({
        ...options,
        themes: options.themes || [],
        langs: options.langs || [],
      })
      return _shiki
    }
    else {
      const s = await _shiki
      await Promise.all([
        s.loadTheme(...(options.themes || [])),
        s.loadLanguage(...(options.langs || [])),
      ])
      return s
    }
  }

  return getSingletonHighlighterCore
}

export const getSingletonHighlighterCore = /* @__PURE__ */ makeSingletonHighlighterCore(createHighlighterCore)

/**
 * @deprecated Use `createHighlighterCore` or `getSingletonHighlighterCore` instead.
 */
/* v8 ignore next 5 */
export function getHighlighterCore(options: HighlighterCoreOptions = {}): Promise<HighlighterCore> {
  // TODO: next:  console.warn('`getHighlighterCore` is deprecated. Use `createHighlighterCore` or `getSingletonHighlighterCore` instead.')
  return createHighlighterCore(options)
}
