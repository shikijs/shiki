import type { HighlighterGeneric } from '@shikijs/types'
import type {} from 'hast'
import type { BundledLanguage } from './langs-bundle-web'
import type { BundledTheme } from './themes'
import { createdBundledHighlighter, createSingletonShorthands, guessEmbeddedLanguages } from '@shikijs/core'
import { createJavaScriptRegexEngine } from './engine-javascript'
import { bundledLanguages } from './langs-bundle-web'
import { bundledThemes } from './themes'

export * from './core'
export * from './langs-bundle-web'
export * from './themes'

export type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

/**
 * Initiate a highlighter instance and load the specified languages and themes.
 * Later it can be used synchronously to highlight code.
 *
 * This bundle is optimized for React Native and Expo environments.
 * It uses the JavaScript regex engine instead of WebAssembly (WASM),
 * making it compatible with React Native's JavaScript runtime.
 *
 * Importing this function will bundle all languages and themes.
 * @see https://shiki.style/guide/bundles#shiki-bundle-react-native
 *
 * @example
 * ```ts
 * import { createHighlighter } from 'shiki/bundle/react-native'
 *
 * const highlighter = await createHighlighter({
 *   themes: ['nord'],
 *   langs: ['javascript', 'typescript'],
 * })
 *
 * const html = highlighter.codeToHtml('console.log("Hello")', {
 *   lang: 'javascript',
 *   theme: 'nord',
 * })
 * ```
 */
export const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine(),
})

export const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<
  BundledLanguage,
  BundledTheme
>(
  createHighlighter,
  { guessEmbeddedLanguages },
)
