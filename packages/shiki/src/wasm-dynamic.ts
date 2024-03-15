import type { WebAssemblyInstantiator } from './types'

export const getWasmInlined: WebAssemblyInstantiator = async (info) => {
  return import('shiki/wasm').then(wasm => wasm.default(info))
}
