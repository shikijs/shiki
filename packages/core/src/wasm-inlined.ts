// @ts-expect-error this will be compiled to ArrayBuffer
import binary from 'vscode-oniguruma/release/onig.wasm'
import type { WebAssemblyInstantiator } from './types'

export const wasmBinary = binary as ArrayBuffer

export const getWasmInstance: WebAssemblyInstantiator = async (info) => {
  return WebAssembly.instantiate(wasmBinary, info).then(wasm => wasm.instance.exports)
}

export default getWasmInstance
