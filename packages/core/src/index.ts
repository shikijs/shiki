// Constructors
export * from './constructors/bundle-factory'
export * from './constructors/highlighter'

// Low-level Highlighting
export { codeToHast, tokensToHast } from './highlight/code-to-hast'
export { codeToHtml, hastToHtml } from './highlight/code-to-html'
export { codeToTokens } from './highlight/code-to-tokens'
export { tokenizeAnsiWithTheme } from './highlight/code-to-tokens-ansi'
export { codeToTokensBase, getLastGrammarState, tokenizeWithTheme } from './highlight/code-to-tokens-base'
export * from './theme-css-variables'
export { transformerDecorations } from './transformer-decorations'

export * from './utils'

export {
  codeToTokensWithThemes,
  createShikiInternal,
  createShikiInternalSync,
  createShikiPrimitive,
  createShikiPrimitiveAsync,
  normalizeTheme,
  ShikiError,
} from '@shikijs/primitive'

export * from '@shikijs/types'
