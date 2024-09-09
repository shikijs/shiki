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

// Low-level Highlighting
export { codeToHast, tokensToHast } from './highlight/code-to-hast'
export { codeToHtml, hastToHtml } from './highlight/code-to-html'
export { codeToTokens } from './highlight/code-to-tokens'
export { tokenizeAnsiWithTheme } from './highlight/code-to-tokens-ansi'
export { codeToTokensBase, tokenizeWithTheme } from './highlight/code-to-tokens-base'
export { codeToTokensWithThemes } from './highlight/code-to-tokens-themes'

export { normalizeTheme } from './textmate/normalize-theme'
export { transformerDecorations } from './transformer-decorations'

// Utils and Misc
export * from './utils'

// Types
export * from '@shikijs/types'

// Deprecated
export {
  /**
   * @deprecated Use `EncodedTokenMetadata` from `@shikijs/vscode-textmate` instead.
   */
  EncodedTokenMetadata as StackElementMetadata,
} from '@shikijs/vscode-textmate'
