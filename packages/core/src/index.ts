// Types
export * from './types'

// Constructors
export * from './constructors/highlighter'
export * from './constructors/bundle-factory'
export { createShikiInternalSync } from './constructors/internal-sync'
export { createShikiInternal, getShikiInternal, setDefaultWasmLoader } from './constructors/internal'

// Engines
export { createWasmOnigEngine, loadWasm } from './engines/wasm'
export { createJavaScriptRegexEngine } from './engines/javascript'

// TextMate Utilities
export { normalizeTheme } from './textmate/normalize-theme'

// Low-level Highlighting
export { codeToTokensBase, tokenizeWithTheme } from './highlight/code-to-tokens-base'
export { codeToTokens } from './highlight/code-to-tokens'
export { tokenizeAnsiWithTheme } from './highlight/code-to-tokens-ansi'
export { codeToHast, tokensToHast } from './highlight/code-to-hast'
export { codeToHtml, hastToHtml } from './highlight/code-to-html'
export { codeToTokensWithThemes } from './highlight/code-to-tokens-themes'

// Utils and Misc
export * from './utils'
export { transformerDecorations } from './transformer-decorations'
export { ShikiError } from './error'

// Deprecated
export {
  /**
   * @deprecated Use `EncodedTokenMetadata` from `@shikijs/vscode-textmate` instead.
   */
  EncodedTokenMetadata as StackElementMetadata,
} from '@shikijs/vscode-textmate'
