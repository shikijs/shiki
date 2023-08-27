const _warned = new Set<string>()
function warnOnce(message: string) {
  if (!_warned.has(message)) {
    console.warn(`[shikiji-compat]: ${message}`)
    _warned.add(message)
  }
}
function stubFunction(name: string) {
  return () => {
    warnOnce(`\`${name}\` is a stub function in \`shikiji-compat\` and does nothing.`)
  }
}

export const setCDN = stubFunction('setCDN')
export const setOnigasmWASM = stubFunction('setOnigasmWASM')
export const setWasm = stubFunction('setWasm')
export const setColorReplacements = stubFunction('setColorReplacements')
