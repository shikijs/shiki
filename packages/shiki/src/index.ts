export { themes as BUNDLED_THEMES, Theme } from './themes'
export { languages as BUNDLED_LANGUAGES, Lang } from './languages'

export { FontStyle } from './stackElementMetadata'

export { getHighlighter } from './highlighter'
export { renderToHtml, HtmlRendererOptions } from './renderer'
export { IThemedToken } from './themedTokenizer'
export { setCDN, setOnigasmWASM, fetchTheme as loadTheme } from './loader'
export {
  ILanguageRegistration,
  IShikiTheme,
  IThemeRegistration,
  Highlighter,
  HighlighterOptions
} from './types'
