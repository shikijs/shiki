export { createShikiInternal, createShikiPrimitiveAsync } from './constructors/async'
export { createShikiInternalSync, createShikiPrimitive } from './constructors/primitive'

// Highlight
export { codeToTokensBase, getLastGrammarState, tokenizeWithTheme } from './highlight/code-to-tokens-base'
export { alignThemesTokenization, codeToTokensWithThemes } from './highlight/code-to-tokens-themes'
// TextMate
export { resolveLangs, resolveThemes } from './textmate/getters-resolve'

export { getGrammarStack, getLastGrammarStateFromMap, GrammarState, setLastGrammarStateToMap } from './textmate/grammar-state'
export { normalizeTheme } from './textmate/normalize-theme'
export { Registry } from './textmate/registry'
export { Resolver } from './textmate/resolver'
// Utils
export * from './utils'

export { resolveLangAlias } from './utils/alias'

// Types
export * from '@shikijs/types'
