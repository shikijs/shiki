/**
 * In environments where WebAssembly can be treated as native ESM and https://github.com/unjs/unwasm,
 * We add the wasm file as the dependency so users don't need to call `loadWasm` manually.
 */

import { setDefaultWasmLoader } from '@shikijs/core'

setDefaultWasmLoader(() => import('shiki/wasm'))

export * from '@shikijs/core'
