import { onigurumaToRegexp } from 'oniguruma-to-js'
import { rewrite } from 'regex'
import type {
  JavaScriptRegexEngineOptions,
  PatternScanner,
  RegexEngine,
  RegexEngineString,
} from '@shikijs/types'

const MAX = 4294967295

/**
 * The default RegExp constructor for JavaScript regex engine.
 */
export function defaultJavaScriptRegexConstructor(pattern: string): RegExp {
  pattern = pattern
    // YAML specific handling; TODO: move to tm-grammars
    .replaceAll('[^\\s[-?:,\\[\\]{}#&*!|>\'"%@`]]', '[^\\s\\-?:,\\[\\]{}#&*!|>\'"%@`]')

  const rewritten = rewrite(pattern, {
    flags: 'dgm',
    unicodeSetsPlugin: null,
    disable: {
      n: true,
      v: true,
      x: true,
    },
  })

  return onigurumaToRegexp(
    rewritten.expression,
    {
      flags: 'dgm',
      ignoreContiguousAnchors: true,
    },
  )
}

export class JavaScriptScanner implements PatternScanner {
  regexps: (RegExp | null)[]

  constructor(
    public patterns: string[],
    public cache: Map<string, RegExp | Error>,
    public forgiving: boolean,
    public regexConstructor: (pattern: string) => RegExp = defaultJavaScriptRegexConstructor,
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
        const regex = regexConstructor(p)
        cache?.set(p, regex)
        return regex
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
      return new JavaScriptScanner(patterns, cache, forgiving, options.regexConstructor)
    },
    createString(s: string) {
      return {
        content: s,
      }
    },
  }
}
