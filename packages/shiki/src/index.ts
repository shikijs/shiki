export * from './bundle-full'
export type { BuiltinLanguage, BuiltinTheme } from './types'

export { createJavaScriptRegexEngine, defaultJavaScriptRegexConstructor } from '@shikijs/engine-javascript'
export { createOnigurumaEngine, loadWasm } from '@shikijs/engine-oniguruma'
