import type { HighlighterCore, HighlighterCoreOptions } from '@shikijs/types'

import { codeToTokensWithThemes, createShikiPrimitive, createShikiPrimitiveAsync } from '@shikijs/primitive'
import { codeToHast } from '../highlight/code-to-hast'
import { codeToHtml } from '../highlight/code-to-html'
import { codeToTokens } from '../highlight/code-to-tokens'
import { codeToTokensBase, getLastGrammarState } from '../highlight/code-to-tokens-base'

/**
 * Create a Shiki core highlighter instance, with no languages or themes bundled.
 * Wasm and each language and theme must be loaded manually.
 *
 * @see http://shiki.style/guide/bundles#fine-grained-bundle
 */
export async function createHighlighterCore(options: HighlighterCoreOptions<false>): Promise<HighlighterCore> {
  const primitive = await createShikiPrimitiveAsync(options)

  return {
    getLastGrammarState: (...args: any[]) => getLastGrammarState(primitive, ...args as [any])!,
    codeToTokensBase: (code, options) => codeToTokensBase(primitive, code, options),
    codeToTokensWithThemes: (code, options) => codeToTokensWithThemes(primitive, code, options),
    codeToTokens: (code, options) => codeToTokens(primitive, code, options),
    codeToHast: (code, options) => codeToHast(primitive, code, options),
    codeToHtml: (code, options) => codeToHtml(primitive, code, options),
    getBundledLanguages: () => ({}),
    getBundledThemes: () => ({}),
    ...primitive,
    getInternalContext: () => primitive,
  }
}

/**
 * Create a Shiki core highlighter instance, with no languages or themes bundled.
 * Wasm and each language and theme must be loaded manually.
 *
 * Synchronous version of `createHighlighterCore`, which requires to provide the engine and all themes and languages upfront.
 *
 * @see http://shiki.style/guide/bundles#fine-grained-bundle
 */
export function createHighlighterCoreSync(options: HighlighterCoreOptions<true>): HighlighterCore {
  const internal = createShikiPrimitive(options)

  return {
    getLastGrammarState: (...args: any[]) => getLastGrammarState(internal, ...args as [any, any]),
    codeToTokensBase: (code, options) => codeToTokensBase(internal, code, options),
    codeToTokensWithThemes: (code, options) => codeToTokensWithThemes(internal, code, options),
    codeToTokens: (code, options) => codeToTokens(internal, code, options),
    codeToHast: (code, options) => codeToHast(internal, code, options),
    codeToHtml: (code, options) => codeToHtml(internal, code, options),
    getBundledLanguages: () => ({}),
    getBundledThemes: () => ({}),
    ...internal,
    getInternalContext: () => internal,
  }
}

export function makeSingletonHighlighterCore(
  createHighlighter: typeof createHighlighterCore,
): (options: HighlighterCoreOptions) => Promise<HighlighterCore> {
  let _shiki: ReturnType<typeof createHighlighterCore>

  async function getSingletonHighlighterCore(
    options: HighlighterCoreOptions,
  ): Promise<HighlighterCore> {
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
