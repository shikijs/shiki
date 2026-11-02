import type { WebAssemblyInstantiator } from '@shikijs/types'
// this will be compiled to ArrayBuffer
import binary from 'vscode-oniguruma/release/onig.wasm'

export const wasmBinaryPromise = new Response(
  new Blob([binary as Uint8Array<ArrayBuffer>]).stream().pipeThrough(new DecompressionStream('gzip')),
).bytes()

export const getWasmInstance: WebAssemblyInstantiator = async (info) => {
  return WebAssembly.instantiate(await wasmBinaryPromise, info).then(wasm => wasm.instance.exports)
}

export default getWasmInstance
