import { server } from 'superstatic'
import {
  DIR_CUSTOM_LANGUAGES,
  DIR_CUSTOM_THEMES,
  DIR_CUSTOM_WASM,
  DIR_DEFAULT_LANGUAGES,
  DIR_DEFAULT_THEMES,
  DIR_DEFAULT_WASM,
  DIR_ROOT_CDN,
  TARGET_WEBSERVER
} from './shared.mjs'

const PORT = process.env.PORT || 3000

const app = server({
  cwd: TARGET_WEBSERVER,
  port: PORT,
  compression: true,
  config: {
    redirects: [
      createRedirectObject(DIR_CUSTOM_LANGUAGES, DIR_DEFAULT_LANGUAGES),
      createRedirectObject(DIR_CUSTOM_THEMES, DIR_DEFAULT_THEMES),
      createRedirectObject(DIR_CUSTOM_WASM, DIR_DEFAULT_WASM),
      createRedirectObject(DIR_ROOT_CDN + DIR_DEFAULT_LANGUAGES, DIR_DEFAULT_LANGUAGES),
      createRedirectObject(DIR_ROOT_CDN + DIR_DEFAULT_THEMES, DIR_DEFAULT_THEMES),
      createRedirectObject(DIR_ROOT_CDN + DIR_DEFAULT_WASM, DIR_DEFAULT_WASM)
    ]
  }
})

app.listen(() => {
  console.log(`Local E2E server started on port ${PORT}.`)
})

function createRedirectObject(source, target) {
  return { source: `${source}/:file`, destination: `${target}/:file`, type: 307 }
}
