import type { RegexEngine } from '../textmate'
import type { LoadWasmOptions } from '../types'
import { createOnigScanner, createOnigString, loadWasm } from './oniguruma'

export { loadWasm }

export async function createWasmOnigEngine(options?: LoadWasmOptions | null): Promise<RegexEngine> {
  if (options)
    await loadWasm(options)

  return {
    createScanner(patterns) {
      return createOnigScanner(patterns)
    },
    createString(s) {
      return createOnigString(s)
    },
  }
}
