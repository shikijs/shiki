import fs from 'node:fs/promises'

export const wasmPlugin = {
  name: 'wasm',
  async load(id) {
    if (!id.endsWith('.wasm'))
      return
    const binary = await fs.readFile(id)
    const base64 = binary.toString('base64')
    return `export default Uint8Array.from(atob(${JSON.stringify(base64)}), c => c.charCodeAt(0))`
  },
}
