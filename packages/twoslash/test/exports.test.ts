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
      createTransformerFactory: function
      defaultCompletionIcons: object
      defaultCustomTagIcons: object
      defaultHoverInfoProcessor: function
      defaultTwoslashOptions: function
      rendererClassic: function
      rendererRich: function
      ShikiTwoslashError: function
      transformerTwoslash: function
    ./core:
      createTransformerFactory: function
      defaultCompletionIcons: object
      defaultCustomTagIcons: object
      defaultHoverInfoProcessor: function
      defaultTwoslashOptions: function
      rendererClassic: function
      rendererRich: function
      ShikiTwoslashError: function
    ./style-rich.css:
      default: string
    ./style-classic.css:
      default: string
    "
  `)
})
