import { expect, it } from 'vitest'
import { parseMetaString } from '../src/shared/parse-meta'

it('no meta', () => {
  expect(parseMetaString('', ['highlight', 'hl'])).toBe(null)
})

it('meta with no key specified', () => {
  expect(parseMetaString('{1,2}', ['highlight', 'hl'])).toEqual({ highlight: [1, 2] })
})

it('meta with matchable key', () => {
  expect(parseMetaString('highlight={1,2}', ['highlight', 'hl'])).toEqual({ highlight: [1, 2] })
})

it('all matchable', () => {
  expect(parseMetaString('highlight={1,2} hl={3,4}', ['highlight', 'hl'])).toEqual({ highlight: [1, 2], hl: [3, 4] })
})

it('same key', () => {
  expect(parseMetaString('highlight={1,2} highlight={3,4}', ['highlight', 'hl'])).toEqual({ highlight: [1, 2, 3, 4] })
})
