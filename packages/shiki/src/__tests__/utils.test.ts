import { trimEndSlash, join, dirname } from '../utils'

test('trimEndSlash', async () => {
  expect(trimEndSlash('/abc')).toBe('/abc')
  expect(trimEndSlash('/abc/')).toBe('/abc')
  expect(trimEndSlash('/abc//')).toBe('/abc/')

  expect(trimEndSlash('\\abc\\')).toBe('\\abc')
  expect(trimEndSlash('\\abc\\\\')).toBe('\\abc\\')
})

test('join', async () => {
  expect(join('abc', 'a', 'b')).toBe('abc/a/b')
  expect(join()).toBe('')
  expect(join('a/', 'b/')).toBe('a/b')
  expect(join('a', './b')).toBe('a/b')
})

test('dirname', async () => {
  expect(dirname('a/b/c')).toBe('b')
  expect(dirname('a/b/c/')).toBe('c')
  expect(dirname('a')).toBe(undefined)
  expect(dirname('')).toBe(undefined)
})
