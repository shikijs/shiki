import { join } from 'path'

const SHIKI_BASE_DIR = join(process.cwd(), 'packages', 'shiki')

// Default server paths for assets
export const DIR_DEFAULT_LANGUAGES = '/languages'
export const DIR_DEFAULT_THEMES = '/themes'
export const DIR_DEFAULT_WASM = '/dist'

// Custom server paths for assets
export const DIR_CUSTOM_LANGUAGES = '/custom/langs'
export const DIR_CUSTOM_THEMES = '/custom/theme'
export const DIR_CUSTOM_WASM = '/custom/bin'

// Custom root path as "CDN"
export const DIR_ROOT_CDN = '/assets'

// Source folders with html files
export const SOURCE_HTML_FIXTURES = join(SHIKI_BASE_DIR, 'src', '__tests__', '__fixtures__')
// Source folder with JS and WASM files
export const SOURCE_ASSETS_JS_WASM = join(SHIKI_BASE_DIR, DIR_DEFAULT_WASM)
// Source folder with languages
export const SOURCE_ASSETS_LANGUAGES = join(SHIKI_BASE_DIR, DIR_DEFAULT_LANGUAGES)
// Source folder with themes
export const SOURCE_ASSETS_THEMES = join(SHIKI_BASE_DIR, DIR_DEFAULT_THEMES)

// Target folders for serving content
export const TARGET_WEBSERVER = join(process.cwd(), 'tmp', 'superstatic-e2e')
export const TARGET_ASSETS_JS_WASM = join(TARGET_WEBSERVER, DIR_DEFAULT_WASM)
export const TARGET_ASSETS_LANGUAGES = join(TARGET_WEBSERVER, DIR_DEFAULT_LANGUAGES)
export const TARGET_ASSETS_THEMES = join(TARGET_WEBSERVER, DIR_DEFAULT_THEMES)
