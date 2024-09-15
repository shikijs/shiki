import type {
  PatternScanner,
  RegexEngine,
  RegexEngineString,
} from '@shikijs/types'
import type { IOnigMatch } from '@shikijs/vscode-textmate'
import { onigurumaToRegexp } from 'oniguruma-to-js'
import { replacements } from './replacements'

export interface JavaScriptRegexEngineOptions {
  /**
   * Whether to allow invalid regex patterns.
   *
   * @default false
   */
  forgiving?: boolean

  /**
   * Use JavaScript to simulate some unsupported regex features.
   *
   * @default true
   */
  simulation?: boolean

  /**
   * Cache for regex patterns.
   */
  cache?: Map<string, RegExp | Error> | null

  /**
   * Custom pattern to RegExp constructor.
   *
   * By default `oniguruma-to-js` is used.
   */
  regexConstructor?: (pattern: string) => RegExp
}

const MAX = 4294967295

/**
 * The default RegExp constructor for JavaScript regex engine.
 */
export function defaultJavaScriptRegexConstructor(pattern: string): RegExp {
  return onigurumaToRegexp(
    pattern,
    {
      flags: 'dgm',
      ignoreContiguousAnchors: true,
    },
  )
}

export class JavaScriptScanner implements PatternScanner {
  regexps: (RegExp | null)[]
  contiguousAnchorSimulation: boolean[]

  constructor(
    public patterns: string[],
    public options: JavaScriptRegexEngineOptions = {},
  ) {
    const {
      forgiving = false,
      cache,
      simulation = true,
      regexConstructor = defaultJavaScriptRegexConstructor,
    } = options

    this.contiguousAnchorSimulation = Array.from({ length: patterns.length }, () => false)
    this.regexps = patterns.map((p, idx) => {
      /**
       * vscode-textmate replace anchors to \uFFFF, where we still not sure how to handle it correctly
       *
       * @see https://github.com/shikijs/vscode-textmate/blob/8d2e84a3aad21afd6b08fd53c7acd421c7f5aa44/src/rule.ts#L687-L702
       *
       * This is a temporary workaround for markdown grammar
       */
      if (simulation)
        p = p.replaceAll('(^|\\\uFFFF)', '(^|\\G)')

      // Detect contiguous anchors for simulation
      if (simulation && (p.startsWith('(^|\\G)') || p.startsWith('(\\G|^)')))
        this.contiguousAnchorSimulation[idx] = true

      // Cache
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
        let pattern = p
        if (simulation) {
          for (const [from, to] of replacements) {
            pattern = pattern.replaceAll(from, to)
          }
        }
        const regex = regexConstructor(pattern)
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

  findNextMatchSync(string: string | RegexEngineString, startPosition: number): IOnigMatch | null {
    const str = typeof string === 'string'
      ? string
      : string.content
    const pending: [index: number, match: RegExpExecArray, offset: number][] = []

    function toResult(index: number, match: RegExpExecArray, offset = 0): IOnigMatch {
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
            start: indice[0] + offset,
            length: indice[1] - indice[0],
            end: indice[1] + offset,
          }
        }),
      }
    }

    for (let i = 0; i < this.regexps.length; i++) {
      const regexp = this.regexps[i]
      if (!regexp)
        continue
      try {
        let offset = 0
        regexp.lastIndex = startPosition
        let match = regexp.exec(str)

        // If a regex starts with `(^|\\G)` or `(\\G|^)`, we simulate the behavior by cutting the string
        if (!match && this.contiguousAnchorSimulation[i]) {
          offset = startPosition
          regexp.lastIndex = 0
          match = regexp.exec(str.slice(startPosition))
        }
        if (!match)
          continue

        // If the match is at the start position, return it immediately
        if (match.index === startPosition) {
          return toResult(i, match, offset)
        }
        // Otherwise, store it for later
        pending.push([i, match, offset])
      }
      catch (e) {
        if (this.options.forgiving)
          continue
        throw e
      }
    }

    // Find the closest match to the start position
    if (pending.length) {
      const minIndex = Math.min(...pending.map(m => m[1].index))
      for (const [i, match, offset] of pending) {
        if (match.index === minIndex) {
          return toResult(i, match, offset)
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
  const _options = {
    cache: new Map(),
    ...options,
  }

  return {
    createScanner(patterns: string[]) {
      return new JavaScriptScanner(patterns, _options)
    },
    createString(s: string) {
      return {
        content: s,
      }
    },
  }
}
