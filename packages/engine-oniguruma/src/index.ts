import type { LoadWasmOptions, RegexEngine } from '@shikijs/types'

import { loadWasm, OnigScanner, OnigString } from './oniguruma'

export { loadWasm }

let _defaultWasmLoader: LoadWasmOptions | undefined

/**
 * Set the default wasm loader for `loadWasm`.
 * @internal
 */
export function setDefaultWasmLoader(_loader: LoadWasmOptions): void {
  _defaultWasmLoader = _loader
}

/**
 * @internal
 */
export function getDefaultWasmLoader(): LoadWasmOptions | undefined {
  return _defaultWasmLoader
}

export async function createWasmOnigEngine(options?: LoadWasmOptions | null): Promise<RegexEngine> {
  if (options)
    await loadWasm(options)

  return {
    createScanner(patterns) {
      return new OnigScanner(patterns)
    },
    createString(s) {
      return new OnigString(s)
    },
  }
}
