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
    // Indirectly test via splitPattern not splitting invalid wrappers
    // (a)b -> starts with ( ends with ), but not single group.
    // If we pass a long pattern that LOOKS like a group but isn't, it should NOT split (return 1 chunk of original).
    const part1 = `(${'a'.repeat(180)})`
    const part2 = `(${'b'.repeat(180)})`
    const pattern = part1 + part2
    const scanner = new JavaScriptScanner([pattern], { regexConstructor: defaultJavaScriptRegexConstructor })
    // Should NOT split because it's not a SingleGroup outer wrapper,
    // AND it doesn't have a top-level pipe (unless we add one?)
    // Wait, splitPattern splits on top-level pipe first.
    // If no pipe, it checks wrappers.
    // (a)(b) -> starts with (, ends with ). isSingleGroup should be false.
    // So it returns [pattern].
    expect(scanner.regexps[0].length).toBe(1)
  })

  it('handles forgiving mode errors', () => {
    const scanner = new JavaScriptScanner(['('], {
      regexConstructor: defaultJavaScriptRegexConstructor,
      forgiving: true,
    })
    // Should catch error and cache null/error
    expect(scanner.regexps[0][0]).toBeNull()
  })

  it('handles non-string patterns', () => {
    // @ts-expect-error testing invalid input
    const scanner = new JavaScriptScanner([123], { regexConstructor: defaultJavaScriptRegexConstructor })
    expect(scanner.regexps[0][0]).toBe(123)
    expect(scanner.patternGroupCounts[0]).toBe(0)
  })
})
