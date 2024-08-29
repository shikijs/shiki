import { expect } from 'vitest'
import type { IOnigMatch, OnigScanner, OnigString } from '../../../core/src/oniguruma/types'
import type { IOnigLib } from '../../../core/vendor/vscode-textmate/src/onigLib'

const MAX = 4294967295

export class JavaScriptOnigScanner implements OnigScanner {
  regexps: (RegExp | null)[]

  constructor(
    public patterns: string[],
    public forgiving: boolean,
  ) {
    this.regexps = patterns.map((p) => {
      try {
        return covertRegex(p)
      }
      catch (e) {
        if (forgiving)
          return null
        throw e
      }
    })
  }

  findNextMatchSync(string: string | OnigString, startPosition: number): IOnigMatch | null {
    const str = typeof string === 'string'
      ? string
      : string.content
    const pending: [index: number, match: RegExpExecArray][] = []

    function toResult(index: number, match: RegExpExecArray) {
      return {
        index,
        captureIndices: match.indices!.map((indice) => {
          if (indice == null) {
            return {
              end: MAX,
              start: MAX,
              length: 0,
            }
          }
          return {
            start: indice[0],
            length: indice[1] - indice[0],
            end: indice[1],
          }
        }),
      }
    }

    for (let i = 0; i < this.regexps.length; i++) {
      const regexp = this.regexps[i]
      if (!regexp)
        continue
      try {
        regexp.lastIndex = startPosition
        const match = regexp.exec(str)
        if (!match)
          continue
        // If the match is at the start position, return it immediately
        if (match.index === startPosition) {
          return toResult(i, match)
        }
        // Otherwise, store it for later
        pending.push([i, match])
      }
      catch (e) {
        if (this.forgiving)
          continue
        throw e
      }
    }

    // Find the closest match to the start position
    if (pending.length) {
      const minIndex = Math.min(...pending.map(m => m[1].index))
      for (const [i, match] of pending) {
        if (match.index === minIndex) {
          return toResult(i, match)
        }
      }
    }

    return null
  }
}

/**
 * Convert Oniguruma regex to JavaScript regex.
 */
function covertRegex(pattern: string) {
  const original = pattern
  // `(?x)` stands for free-spacing mode
  // https://www.regular-expressions.info/freespacing.html
  // We remove comments and whitespaces
  if (pattern.startsWith('(?x)') || pattern.includes('(?x:'))
    throw new Error('RegExp Free-spacing mode `(?x)` is not supported by JavaScript Scanner')

  if (pattern.match(/\[:\w+:\]/))
    throw new Error('POSIX character classes are not supported by JavaScript Scanner')

  try {
    return new RegExp(pattern, 'dg')
  }
  catch (e) {
    expect.soft(original).toBe(pattern)
    throw e
  }
}

export interface JavaScriptOnigLibOptions {
  /**
   * Whether to allow invalid regex patterns.
   */
  forgiving?: boolean
}

export function createJavaScriptOnigLib(options: JavaScriptOnigLibOptions = {}): IOnigLib {
  const { forgiving = false } = options

  return {
    createOnigScanner(patterns: string[]) {
      return new JavaScriptOnigScanner(patterns, forgiving)
    },
    createOnigString(s: string) {
      return {
        content: s,
      }
    },
  }
}
