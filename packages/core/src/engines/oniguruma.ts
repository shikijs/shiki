import type { LoadWasmOptions, RegexEngine } from '@shikijs/types'
import {
  createOnigurumaEngine as _createOnigurumaEngine,
  loadWasm as _loadWasm,
} from '@shikijs/engine-oniguruma'
import { warnDeprecated } from '../warn'

export function createOnigurumaEngine(options?: LoadWasmOptions | null): Promise<RegexEngine> {
  warnDeprecated('import `createOnigurumaEngine` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead')
  return _createOnigurumaEngine(options)
}

export function createWasmOnigEngine(options?: LoadWasmOptions | null): Promise<RegexEngine> {
  warnDeprecated('import `createOnigurumaEngine` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead')
  return createOnigurumaEngine(options)
}

export function loadWasm(options: LoadWasmOptions): Promise<void> {
  warnDeprecated('import `loadWasm` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead')
  return _loadWasm(options)
}
