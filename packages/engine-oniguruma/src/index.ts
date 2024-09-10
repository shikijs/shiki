import type { LoadWasmOptions, RegexEngine } from '@shikijs/types'

import { loadWasm, OnigScanner, OnigString } from './oniguruma'

export { loadWasm }

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
