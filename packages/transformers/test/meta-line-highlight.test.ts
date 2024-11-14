import { expect, it } from 'vitest'
import { parseMetaHighlightString } from '../src/transformers/meta-highlight'

it('parseHighlightLines', () => {
  expect(parseMetaHighlightString('')).toBe(null)
  expect(parseMetaHighlightString('{1}')).toEqual([1])
  expect(parseMetaHighlightString('{1,2}')).toEqual([1, 2])
  expect(parseMetaHighlightString('{1,2-4,5}')).toEqual([1, 2, 3, 4, 5])
  expect(parseMetaHighlightString('{1-1}')).toEqual([1])
})
