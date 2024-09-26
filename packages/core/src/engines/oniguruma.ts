import type { LoadWasmOptions, RegexEngine } from '@shikijs/types'
import {
  createWasmOnigEngine as _createWasmOnigEngine,
  loadWasm as _loadWasm,
} from '@shikijs/engine-oniguruma'
import { warnDeprecated } from '../warn'

export function createWasmOnigEngine(options?: LoadWasmOptions | null): Promise<RegexEngine> {
  warnDeprecated('import `createWasmOnigEngine` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead')
  return _createWasmOnigEngine(options)
}

export function loadWasm(options: LoadWasmOptions): Promise<void> {
  warnDeprecated('import `loadWasm` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead')
  return _loadWasm(options)
}
