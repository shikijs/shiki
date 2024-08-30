import type { RegexEngine } from '../textmate'
import type { LoadWasmOptions } from '../types'
import { OnigScanner, OnigString, loadWasm } from './oniguruma'

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
