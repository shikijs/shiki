import type { WebAssemblyInstantiator } from './types'
import { warnDeprecated } from '@shikijs/core'

/**
 * @deprecated Use `import('shiki/wasm')` instead.
 */
export const getWasmInlined: WebAssemblyInstantiator = async (info) => {
  warnDeprecated('`getWasmInlined` is deprecated. Use `import("shiki/wasm")` instead.')
  return import('shiki/wasm').then(wasm => wasm.default(info))
}
