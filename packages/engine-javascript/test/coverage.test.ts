import { describe, expect, it } from 'vitest'
import { defaultJavaScriptRegexConstructor } from '../src/engine-compile'
import { JavaScriptScanner } from '../src/scanner'

describe('coverage', () => {
  it('handles nested word boundaries in splitPattern', () => {
    const inner = `(?i)${'a'.repeat(200)}|${'b'.repeat(200)}`
    const pattern = `\\b${inner}\\b`
    const scanner = new JavaScriptScanner([pattern], { regexConstructor: defaultJavaScriptRegexConstructor })
    expect(scanner.regexps[0].length).toBeGreaterThan(1)
  })

  it('handles (?i) prefix splitting', () => {
    const inner = `${'a'.repeat(200)}|${'b'.repeat(200)}`
    const pattern = `(?i)${inner}`
    const scanner = new JavaScriptScanner([pattern], { regexConstructor: defaultJavaScriptRegexConstructor })
    expect(scanner.regexps[0].length).toBeGreaterThan(1)
  })

  it('handles (?i:...) group splitting', () => {
    const inner = `${'a'.repeat(200)}|${'b'.repeat(200)}`
    const pattern = `(?i:${inner})`
    const scanner = new JavaScriptScanner([pattern], { regexConstructor: defaultJavaScriptRegexConstructor })
    expect(scanner.regexps[0].length).toBeGreaterThan(1)
  })

  it('handles (?:...) non-capturing group splitting', () => {
    // Must include (?i) to trigger split
    const inner = `(?i)${'a'.repeat(200)}|${'b'.repeat(200)}`
    const pattern = `(?:${inner})`
    const scanner = new JavaScriptScanner([pattern], { regexConstructor: defaultJavaScriptRegexConstructor })
    expect(scanner.regexps[0].length).toBeGreaterThan(1)
  })

  it('handles (...) capturing group splitting', () => {
    const inner = `(?i)${'a'.repeat(200)}|${'b'.repeat(200)}`
    const pattern = `(${inner})`
    const scanner = new JavaScriptScanner([pattern], { regexConstructor: defaultJavaScriptRegexConstructor })
    expect(scanner.regexps[0].length).toBeGreaterThan(1)
  })

  it('isSingleGroup returns false for unbalanced or multi-part', () => {
    const part1 = `(${'a'.repeat(180)})`
    const part2 = `(${'b'.repeat(180)})`
    const pattern = part1 + part2
    const scanner = new JavaScriptScanner([pattern], { regexConstructor: defaultJavaScriptRegexConstructor })
    expect(scanner.regexps[0].length).toBe(1)
  })

  it('handles forgiving mode errors', () => {
    const scanner = new JavaScriptScanner(['('], {
      regexConstructor: defaultJavaScriptRegexConstructor,
      forgiving: true,
    })
    expect(scanner.regexps[0][0]).toBeNull()
  })

  it('handles non-string patterns', () => {
    // @ts-expect-error testing invalid input
    const scanner = new JavaScriptScanner([123], { regexConstructor: defaultJavaScriptRegexConstructor })
    expect(scanner.regexps[0][0]).toBe(123)
    expect(scanner.patternGroupCounts[0]).toBe(0)
  })

  it('handles regex constructor errors', () => {
    expect(() => {
      const _ = new JavaScriptScanner(['('], { regexConstructor: defaultJavaScriptRegexConstructor })
    }).toThrow()

    const scanner = new JavaScriptScanner(['('], {
      regexConstructor: defaultJavaScriptRegexConstructor,
      forgiving: true,
    })
    expect(scanner.regexps[0][0]).toBeNull()
  })

  it('handles cached errors', () => {
    const cache = new Map<string, RegExp | Error>()
    const pattern = '('
    cache.set(pattern, new Error('Cached error'))

    expect(() => {
      const _ = new JavaScriptScanner([pattern], {
        regexConstructor: defaultJavaScriptRegexConstructor,
        cache,
      })
    }).toThrow('Cached error')

    const scanner = new JavaScriptScanner([pattern], {
      regexConstructor: defaultJavaScriptRegexConstructor,
      cache,
      forgiving: true,
    })
    expect(scanner.regexps[0][0]).toBeNull()
  })

  it('handles cached regex', () => {
    const cache = new Map<string, RegExp | Error>()
    const pattern = 'abc'
    const regex = /abc/
    cache.set(pattern, regex)

    const scanner = new JavaScriptScanner([pattern], {
      regexConstructor: defaultJavaScriptRegexConstructor,
      cache,
    })
    expect(scanner.regexps[0][0]).toBeInstanceOf(RegExp)
    expect((scanner.regexps[0][0] as RegExp).source).toBe('abc')
  })
})
