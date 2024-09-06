// Types
export * from './constructors/bundle-factory'

// Constructors
export * from './constructors/highlighter'
export { createShikiInternal, getShikiInternal, setDefaultWasmLoader } from './constructors/internal'
export { createShikiInternalSync } from './constructors/internal-sync'
export { createJavaScriptRegexEngine, defaultJavaScriptRegexConstructor } from './engines/javascript'

// Engines
export { createWasmOnigEngine, loadWasm } from './engines/wasm'
export { ShikiError } from './error'

export { codeToHast, tokensToHast } from './highlight/code-to-hast'

export { codeToHtml, hastToHtml } from './highlight/code-to-html'
export { codeToTokens } from './highlight/code-to-tokens'
export { tokenizeAnsiWithTheme } from './highlight/code-to-tokens-ansi'
// Low-level Highlighting
export { codeToTokensBase, tokenizeWithTheme } from './highlight/code-to-tokens-base'
export { codeToTokensWithThemes } from './highlight/code-to-tokens-themes'
// TextMate Utilities
export { normalizeTheme } from './textmate/normalize-theme'

export { transformerDecorations } from './transformer-decorations'
export * from './types'
// Utils and Misc
export * from './utils'

// Deprecated
export {
  /**
   * @deprecated Use `EncodedTokenMetadata` from `@shikijs/vscode-textmate` instead.
   */
  EncodedTokenMetadata as StackElementMetadata,
} from '@shikijs/vscode-textmate'
