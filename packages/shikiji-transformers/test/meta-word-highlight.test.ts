import { expect, it } from 'vitest'
import { parseMetaHighlightWords } from '../src/transformers/transformer-meta-highlight-word'

it('parseHighlightWords', () => {
  expect(parseMetaHighlightWords('')).toEqual([])
  expect(parseMetaHighlightWords('/hello/')).toEqual(['hello'])
  expect(parseMetaHighlightWords('// /f// /hello/')).toEqual(['f', 'hello'])
})
