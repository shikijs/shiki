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
      createCommentNotationTransformer: function
      findAllSubstringIndexes: function
      parseMetaHighlightString: function
      parseMetaHighlightWords: function
      transformerCompactLineOptions: function
      transformerMetaHighlight: function
      transformerMetaWordHighlight: function
      transformerNotationDiff: function
      transformerNotationErrorLevel: function
      transformerNotationFocus: function
      transformerNotationHighlight: function
      transformerNotationMap: function
      transformerNotationWordHighlight: function
      transformerRemoveLineBreak: function
      transformerRemoveNotationEscape: function
      transformerRenderWhitespace: function
      transformerStyleToClass: function
    "
  `)
})
