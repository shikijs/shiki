import { regex } from 'regex'
import { Context, replaceUnescaped } from 'regex-utilities'
import type { PatternScanner, RegexEngine, RegexEngineString } from '../textmate'
import type { JavaScriptRegexEngineOptions } from '../types/engines'

const MAX = 4294967295

const TABLE_POSIX = {
  alnum: '0-9A-Za-z',
  alpha: 'A-Za-z',
  ascii: '\\0-\\x7F',
  blank: ' \\t',
  cntrl: '\\0-\\x1F\\x7F',
  digit: '0-9',
  graph: '!-~',
  lower: 'a-z',
  print: ' -~',
  punct: '!-/:-@[-`{-~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  xdigit: '0-9A-Fa-f',
  word: '\\w',
} as Record<string, string>

function extensions(str: string) {
  return str.replace(/(?<slash>\\\\)|\\(?<escapedLiteral>['"`#])|\[(?<neg1>\^?)\[:(?<neg2>\^?)(?<posix>[a-z]+):\]\]/g, (...args) => {
    const groups = args[args.length - 1]
    const { slash, escapedLiteral, neg1, neg2, posix } = groups
    if (slash) {
      return args[0]
    }
    if (escapedLiteral) {
      return escapedLiteral
    }
    if (posix) {
      const negated = neg1 !== neg2
      const resolved = TABLE_POSIX[posix]
      if (!resolved) {
        throw new Error(`Unknown POSIX class "${posix}"`)
      }
      return `[${negated ? '^' : ''}${resolved}]`
    }
  })
}

function nonCharClassExtensions(str: string) {
  return replaceUnescaped(str, String.raw`\\(?<escape>[hH])|\(\?#[^)]*\)`, ({ groups: { escape } }: any) => {
    if (escape) {
      return `[${escape === 'H' ? '^' : ''}${TABLE_POSIX.xdigit}]`
    }
    return ''
  }, Context.DEFAULT)
}

function charClassExtensions(str: string) {
  return replaceUnescaped(str, String.raw`\\(?<escape>[hH])`, ({ groups: { escape } }: any) => {
    if (escape === 'H') {
      throw new Error('TODO: Add support for \\H in character classes')
    }
    return TABLE_POSIX.xdigit
  }, Context.CHAR_CLASS)
}

export class JavaScriptScanner implements PatternScanner {
  regexps: (RegExp | null)[]

  constructor(
    public patterns: string[],
    public cache: Map<string, RegExp | Error>,
    public forgiving: boolean,
  ) {
    this.regexps = patterns.map((p) => {
      const cached = cache?.get(p)
      if (cached) {
        if (cached instanceof RegExp) {
          return cached
        }
        if (forgiving)
          return null
        throw cached
      }
      try {
        const re = regex({
          flags: 'dg',
          subclass: true,
          plugins: [extensions, nonCharClassExtensions, charClassExtensions],
          unicodeSetsPlugin: null,
          disable: {
            x: true,
            n: true,
            v: true,
          },
        })({ raw: [p] })
        cache?.set(p, re)
        return re
      }
      catch (e) {
        cache?.set(p, e as Error)
        if (forgiving)
          return null
        // console.error({ ...e })
        throw e
      }
    })
  }

  findNextMatchSync(string: string | RegexEngineString, startPosition: number) {
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
 * Use the modern JavaScript RegExp engine to implement the OnigScanner.
 *
 * As Oniguruma regex is more powerful than JavaScript regex, some patterns may not be supported.
 * Errors will be thrown when parsing TextMate grammars with unsupported patterns.
 * Set `forgiving` to `true` to ignore these errors and skip the unsupported patterns.
 *
 * @experimental
 */
export function createJavaScriptRegexEngine(options: JavaScriptRegexEngineOptions = {}): RegexEngine {
  const {
    forgiving = false,
    cache = new Map(),
  } = options

  return {
    createScanner(patterns: string[]) {
      return new JavaScriptScanner(patterns, cache, forgiving)
    },
    createString(s: string) {
      return {
        content: s,
      }
    },
  }
}
