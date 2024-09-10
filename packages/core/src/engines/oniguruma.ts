import type { LoadWasmOptions } from '@shikijs/types'

export * from '@shikijs/engine-oniguruma'

let _defaultWasmLoader: LoadWasmOptions | undefined

/**
 * Set the default wasm loader for `loadWasm`.
 * @internal
 */
export function setDefaultWasmLoader(_loader: LoadWasmOptions) {
  _defaultWasmLoader = _loader
}

/**
 * @internal
 */
export function getDefaultWasmLoader() {
  return _defaultWasmLoader
}
