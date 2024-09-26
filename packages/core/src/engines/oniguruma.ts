import type { LoadWasmOptions, RegexEngine } from '@shikijs/types'
import {
  createOnigurumaEngine as _createOnigurumaEngine,
  loadWasm as _loadWasm,
} from '@shikijs/engine-oniguruma'
import { warnDeprecated } from '../warn'

/**
 * @deprecated Import `createOnigurumaEngine` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead.
 */
export function createOnigurumaEngine(options?: LoadWasmOptions | null): Promise<RegexEngine> {
  warnDeprecated('import `createOnigurumaEngine` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead')
  return _createOnigurumaEngine(options)
}

/**
 * @deprecated Import `createOnigurumaEngine` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead.
 */
export function createWasmOnigEngine(options?: LoadWasmOptions | null): Promise<RegexEngine> {
  warnDeprecated('import `createOnigurumaEngine` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead')
  return _createOnigurumaEngine(options)
}

/**
 * @deprecated Import `loadWasm` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead.
 */
export function loadWasm(options: LoadWasmOptions): Promise<void> {
  warnDeprecated('import `loadWasm` from `@shikijs/engine-oniguruma` or `shiki/engine/oniguruma` instead')
  return _loadWasm(options)
}
