import { expect, it } from 'vitest'
import { parseHighlightLines } from '../line-highlight'

it('parseHighlightLines', () => {
  expect(parseHighlightLines('')).toBe(null)
  expect(parseHighlightLines('{1}')).toEqual([1])
  expect(parseHighlightLines('{1,2}')).toEqual([1, 2])
  expect(parseHighlightLines('{1,2-4,5}')).toEqual([1, 2, 3, 4, 5])
  expect(parseHighlightLines('{1-1}')).toEqual([1])
})
