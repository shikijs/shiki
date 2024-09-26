// Types
export * from './constructors/bundle-factory'
// Constructors
export * from './constructors/highlighter'
export { createShikiInternal, getShikiInternal } from './constructors/internal'
export { createShikiInternalSync } from './constructors/internal-sync'

// Engines
export { createJavaScriptRegexEngine, defaultJavaScriptRegexConstructor } from './engines/javascript'
export { createOnigurumaEngine, createWasmOnigEngine, loadWasm } from './engines/oniguruma'

// Low-level Highlighting
export { codeToHast, tokensToHast } from './highlight/code-to-hast'
export { codeToHtml, hastToHtml } from './highlight/code-to-html'
export { codeToTokens } from './highlight/code-to-tokens'
export { tokenizeAnsiWithTheme } from './highlight/code-to-tokens-ansi'
export { codeToTokensBase, tokenizeWithTheme } from './highlight/code-to-tokens-base'
export { codeToTokensWithThemes } from './highlight/code-to-tokens-themes'
export { normalizeTheme } from './textmate/normalize-theme'
export * from './theme-css-variables'
export { transformerDecorations } from './transformer-decorations'

// Utils and Misc
export * from './utils'
export { enableDeprecationWarnings, warnDeprecated } from './warn'

// Types
export * from '@shikijs/types'

// Deprecated
export {
  /**
   * @deprecated Use `EncodedTokenMetadata` from `@shikijs/vscode-textmate` instead.
   */
  EncodedTokenMetadata as StackElementMetadata,
  /**
   * @deprecated Import `FontStyle` from `@shikijs/vscode-textmate` instead.
   */
  FontStyle,
} from '@shikijs/vscode-textmate'
