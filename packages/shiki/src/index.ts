export { themes as BUNDLED_THEMES, Theme } from './themes'
export { languages as BUNDLED_LANGUAGES, Lang } from './languages'

export { FontStyle } from './stackElementMetadata'

export { getHighlighter } from './highlighter'
export { renderToHtml, HtmlRendererOptions } from './renderer'
export { IThemedToken } from './themedTokenizer'
export { setCDN, setWasm, fetchTheme as loadTheme } from './loader'

import { setWasm } from './loader'

/** @deprecated use setWasm instead, will be removed in a future version */
export function setOnigasmWASM(path: string | ArrayBuffer) {
  setWasm(path)
}

export {
  ILanguageRegistration,
  IShikiTheme,
  IThemeRegistration,
  Highlighter,
  HighlighterOptions
} from './types'
