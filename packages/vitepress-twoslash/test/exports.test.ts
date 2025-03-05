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
      defaultHoverInfoProcessor: function
      rendererFloatingVue: function
      transformerTwoslash: function
    ./client:
      default: object
    ./cache-fs:
      createFileSystemTypesCache: function
    ./style.css:
      default: string
    ./style-core.css:
      default: string
    "
  `)
})
