import type { WebAssemblyInstantiator } from './oniguruma'

const getWasm: WebAssemblyInstantiator = async (info) => {
  // @ts-expect-error this will be compiled to ArrayBuffer
  const binray: ArrayBuffer = await import('vscode-oniguruma/release/onig.wasm').then(m => m.default)
  return WebAssembly.instantiate(binray, info).then(wasm => wasm.instance.exports)
}

export default getWasm
