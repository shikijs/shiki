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
