import { expect, it } from 'vitest'
import { parseMetaString } from '../src/shared/parse-meta'

it('no meta', () => {
  expect(parseMetaString('', ['highlight', 'hl'])).toBe(null)
})

it('keyless meta', () => {
  expect(parseMetaString('{1,2}', ['highlight', 'hl'])).toEqual({ highlight: [1, 2] })
  expect(parseMetaString('{1,2}', ['add', 'remove'])).toEqual(null)
})

it('meta with one matchable key', () => {
  expect(parseMetaString('highlight={1,2}', ['highlight', 'hl'])).toEqual({ highlight: [1, 2] })
  expect(parseMetaString('remove={1,3-6}', ['add', 'remove'])).toEqual({ remove: [1, 3, 4, 5, 6] })
  expect(parseMetaString('error={1,2-4,5}', ['error', 'warning'])).toEqual({ error: [1, 2, 3, 4, 5] })
  expect(parseMetaString('focus={1,2-4}', ['focus'])).toEqual({ focus: [1, 2, 3, 4] })
})

it('meta with no matchable keys', () => {
  expect(parseMetaString('highlight={1,2}', ['add', 'remove'])).toEqual(null)
  expect(parseMetaString('add={1,3-5}', ['highlight', 'hl'])).toEqual(null)
  expect(parseMetaString('error={1,2-4,5}', ['focus'])).toEqual(null)
  expect(parseMetaString('focus={1,2-4}', ['error', 'warning'])).toEqual(null)
})

it('multiple meta', () => {
  expect(parseMetaString('highlight={1,2} add={3,4}', ['highlight', 'hl'])).toEqual({ highlight: [1, 2] })
  expect(parseMetaString('remove={1,3-5} error={6,7}', ['add', 'remove'])).toEqual({ remove: [1, 3, 4, 5] })
  expect(parseMetaString('error={1,2-4,5} focus={6,7}', ['error', 'warning'])).toEqual({ error: [1, 2, 3, 4, 5] })
  expect(parseMetaString('focus={1,2-4} error={5,6}', ['focus'])).toEqual({ focus: [1, 2, 3, 4] })
})

it('all matchable', () => {
  expect(parseMetaString('add={1,2} remove={3,4}', ['add', 'remove'])).toEqual({ add: [1, 2], remove: [3, 4] })
  expect(parseMetaString('error={1,3-5} warning={6,7}', ['error', 'warning'])).toEqual({ error: [1, 3, 4, 5], warning: [6, 7] })
  expect(parseMetaString('highlight={1,2} hl={3,4}', ['highlight', 'hl'])).toEqual({ highlight: [1, 2], hl: [3, 4] })
})

it('same key', () => {
  expect(parseMetaString('highlight={1,2} highlight={3,4}', ['highlight', 'hl'])).toEqual({ highlight: [1, 2, 3, 4] })
  expect(parseMetaString('remove={1,3-5} remove={6,7}', ['add', 'remove'])).toEqual({ remove: [1, 3, 4, 5, 6, 7] })
})
