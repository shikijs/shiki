import { describe, expect, it } from 'vitest'
import { JavaScriptScanner } from '../src/scanner'

describe('scanner error handling', () => {
  it('should throw error when regex lacks "d" flag', () => {
    const scanner = new JavaScriptScanner(
      ['test'],
      {
        regexConstructor: pattern => new RegExp(pattern), // Missing 'd' flag
      },
    )

    expect(() => scanner.findNextMatchSync('test string', 0, 0))
      .toThrow(/must be created with the "d" flag/)
  })
})
