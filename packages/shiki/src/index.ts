export { themes as BUNDLED_THEMES } from './themes'
export type { Theme } from './themes'
export { languages as BUNDLED_LANGUAGES } from './languages'
export type { Lang } from './languages'

export { FontStyle } from './stackElementMetadata'

export { getHighlighter } from './highlighter'
export { renderToHtml } from './renderer'
export type { IThemedToken } from './themedTokenizer'

export { setCDN, setWasm, fetchTheme as loadTheme, toShikiTheme } from './loader'

import { setWasm } from './loader'

/** @deprecated use setWasm instead, will be removed in a future version */
export function setOnigasmWASM(path: string | ArrayBuffer) {
  setWasm(path)
}
export type {
  ILanguageRegistration,
  IShikiTheme,
  IThemeRegistration,
  Highlighter,
  HighlighterOptions,
  HtmlRendererOptions
} from './types'
