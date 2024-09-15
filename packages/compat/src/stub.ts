const _warned = new Set<string>()

function warnOnce(message: string): void {
  if (!_warned.has(message)) {
    console.warn(`[shiki-compat]: ${message}`)
    _warned.add(message)
  }
}
function stubFunction(name: string): () => void {
  return () => {
    warnOnce(`\`${name}\` is a stub function in \`shiki-compat\` and does nothing.`)
  }
}

export const setCDN = stubFunction('setCDN')
export const setOnigasmWASM = stubFunction('setOnigasmWASM')
export const setWasm = stubFunction('setWasm')
export const setColorReplacements = stubFunction('setColorReplacements')
