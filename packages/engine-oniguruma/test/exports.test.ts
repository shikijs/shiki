import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { expect, it } from 'vitest'
import { getPackageExportsManifest } from 'vitest-package-exports'

it('exports-snapshot', async () => {
  const manifest = await getPackageExportsManifest({
    importMode: 'src',
    cwd: fileURLToPath(import.meta.url),
  })
  expect(yaml.dump(manifest.exports)).toMatchInlineSnapshot(`
    ".:
      createOnigurumaEngine: function
      getDefaultWasmLoader: function
      loadWasm: function
      setDefaultWasmLoader: function
    ./wasm-inlined:
      default: function
      getWasmInstance: function
      wasmBinary: object
    "
  `)
})
