import { trimEndSlash, join, dirname, dirpathparts } from '../utils'

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

test('dirpathparts', async () => {
  expect(dirpathparts('a/b/c')).toStrictEqual(['a', 'b'])
  expect(dirpathparts('a/b/c/')).toStrictEqual(['a', 'b', 'c'])
  expect(dirpathparts('a/b/c/def.g')).toStrictEqual(['a', 'b', 'c'])
  expect(dirpathparts('./a/b/c/')).toStrictEqual(['.', 'a', 'b', 'c'])
  expect(dirpathparts('./a/b/c/def.g')).toStrictEqual(['.', 'a', 'b', 'c'])
  expect(dirpathparts('/a/b/c/')).toStrictEqual(['', 'a', 'b', 'c'])
  expect(dirpathparts('/a/b/c/def.g')).toStrictEqual(['', 'a', 'b', 'c'])
  expect(dirpathparts('a\\b\\c')).toStrictEqual(['a', 'b'])
  expect(dirpathparts('a\\b\\c\\')).toStrictEqual(['a', 'b', 'c'])
  expect(dirpathparts('a\\b\\c\\def.g')).toStrictEqual(['a', 'b', 'c'])
  expect(dirpathparts('.\\a\\b\\c\\')).toStrictEqual(['.', 'a', 'b', 'c'])
  expect(dirpathparts('\\a\\b\\c\\')).toStrictEqual(['', 'a', 'b', 'c'])
  expect(dirpathparts('a')).toStrictEqual([])
  expect(dirpathparts('')).toStrictEqual([])
})

test('dir_join_with_new_file', async () => {
  expect(join(...dirpathparts('a/b/c'), 'hij.k')).toBe('a/b/hij.k')
  expect(join(...dirpathparts('a/b/c/'), 'hij.k')).toBe('a/b/c/hij.k')
  expect(join(...dirpathparts('a/b/c/def.g'), 'hij.k')).toBe('a/b/c/hij.k')
  expect(join(...dirpathparts('./a/b/c'), 'hij.k')).toBe('./a/b/hij.k')
  expect(join(...dirpathparts('./a/b/c/'), 'hij.k')).toBe('./a/b/c/hij.k')
  expect(join(...dirpathparts('./a/b/c/def.g'), 'hij.k')).toBe('./a/b/c/hij.k')
  expect(join(...dirpathparts('/a/b/c'), 'hij.k')).toBe('/a/b/hij.k')
  expect(join(...dirpathparts('/a/b/c/'), 'hij.k')).toBe('/a/b/c/hij.k')
  expect(join(...dirpathparts('/a/b/c/def.g'), 'hij.k')).toBe('/a/b/c/hij.k')
  expect(join(...dirpathparts('a\\b\\c'), 'hij.k')).toBe('a/b/hij.k')
  expect(join(...dirpathparts('a\\b\\c\\'), 'hij.k')).toBe('a/b/c/hij.k')
  expect(join(...dirpathparts('a\\b\\c\\def.g'), 'hij.k')).toBe('a/b/c/hij.k')
  expect(join(...dirpathparts('.\\a\\b\\c'), 'hij.k')).toBe('./a/b/hij.k')
  expect(join(...dirpathparts('.\\a\\b\\c\\'), 'hij.k')).toBe('./a/b/c/hij.k')
  expect(join(...dirpathparts('.\\a\\b\\c\\def.g'), 'hij.k')).toBe('./a/b/c/hij.k')
  expect(join(...dirpathparts('\\a\\b\\c'), 'hij.k')).toBe('/a/b/hij.k')
  expect(join(...dirpathparts('\\a\\b\\c\\'), 'hij.k')).toBe('/a/b/c/hij.k')
  expect(join(...dirpathparts('\\a\\b\\c\\def.g'), 'hij.k')).toBe('/a/b/c/hij.k')
})
