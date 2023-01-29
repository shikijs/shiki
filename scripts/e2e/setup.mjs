import fsExtra from 'fs-extra'
import {
  SOURCE_HTML_FIXTURES,
  SOURCE_ASSETS_JS_WASM,
  SOURCE_ASSETS_LANGUAGES,
  SOURCE_ASSETS_THEMES,
  TARGET_WEBSERVER,
  TARGET_ASSETS_JS_WASM,
  TARGET_ASSETS_LANGUAGES,
  TARGET_ASSETS_THEMES
} from './shared.mjs'

function globalSetup() {
  if (!fsExtra.existsSync(TARGET_WEBSERVER)) {
    fsExtra.mkdirSync(TARGET_WEBSERVER, { recursive: true })
  }
  if (!fsExtra.existsSync(TARGET_ASSETS_JS_WASM)) {
    fsExtra.mkdirSync(TARGET_ASSETS_JS_WASM)
  }
  if (!fsExtra.existsSync(TARGET_ASSETS_LANGUAGES)) {
    fsExtra.mkdirSync(TARGET_ASSETS_LANGUAGES)
  }
  if (!fsExtra.existsSync(SOURCE_ASSETS_THEMES)) {
    fsExtra.mkdirSync(SOURCE_ASSETS_THEMES)
  }

  fsExtra.copySync(SOURCE_HTML_FIXTURES, TARGET_WEBSERVER)
  fsExtra.copySync(SOURCE_ASSETS_JS_WASM, TARGET_ASSETS_JS_WASM)
  fsExtra.copySync(SOURCE_ASSETS_LANGUAGES, TARGET_ASSETS_LANGUAGES)
  fsExtra.copySync(SOURCE_ASSETS_THEMES, TARGET_ASSETS_THEMES)
}

export default globalSetup

// globalSetup()
