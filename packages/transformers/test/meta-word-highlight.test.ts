import { expect, it } from 'vitest'
import { findAllSubstringIndexes, parseMetaHighlightWords } from '../src/transformers/meta-highlight-word'

it('parseHighlightWords', () => {
  expect(parseMetaHighlightWords('')).toEqual([])
  expect(parseMetaHighlightWords('/hello/')).toEqual(['hello'])
  expect(parseMetaHighlightWords('/ /f /hello/')).toEqual([' ', 'hello'])
  expect(parseMetaHighlightWords('/foo bar/ /foo.bar\\/foo/')).toEqual(['foo bar', 'foo.bar/foo'])
  expect(findAllSubstringIndexes('xxx', 'xx')).toEqual([0])
  expect(findAllSubstringIndexes('xxxx', 'xx')).toEqual([0, 2])
})

it('parseHighlightWords skips quoted attribute values', () => {
  expect(parseMetaHighlightWords('title="src/utils/index.ts"')).toEqual([])
  expect(parseMetaHighlightWords('{6} /db/ title="src/routes/users/index.tsx"')).toEqual(['db'])
  expect(parseMetaHighlightWords('title=\'src/utils/index.ts\' /hello/')).toEqual(['hello'])
  expect(parseMetaHighlightWords('/class="btn"/')).toEqual(['class="btn"'])
})
