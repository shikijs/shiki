import type {
  PatternScanner,
  RegexEngine,
  RegexEngineString,
} from '@shikijs/types'
import type { IOnigMatch } from '@shikijs/vscode-textmate'
import type { OnigurumaToEsOptions } from 'oniguruma-to-es'
import { toRegExp } from 'oniguruma-to-es'

export interface JavaScriptRegexEngineOptions {
  /**
   * Whether to allow invalid regex patterns.
   *
   * @default false
   */
  forgiving?: boolean

  /**
   * The target ECMAScript version.
   *
   * Oniguruma-To-ES uses RegExp features from later versions of ECMAScript to provide improved
   * accuracy and add support for more grammars. If using target `ES2024` or later, the RegExp `v`
   * flag is used which requires Node.js 20+ or Chrome 112+.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets
   *
   * For maximum compatibility, you can set it to `ES2018` which uses the RegExp `u` flag but
   * supports a few less grammars.
   *
   * Set to `auto` to automatically detect the latest version supported by the environment.
   *
   * @default 'auto'
   */
  target?: 'auto' | 'ES2025' | 'ES2024' | 'ES2018'

  /**
   * Cache for regex patterns.
   */
  cache?: Map<string, RegExp | Error> | null

  /**
   * Custom pattern to RegExp constructor.
   *
   * By default `oniguruma-to-es` is used.
   */
  regexConstructor?: (pattern: string) => RegExp
}

const MAX = 4294967295

/**
 * The default RegExp constructor for JavaScript regex engine.
 */
export function defaultJavaScriptRegexConstructor(pattern: string, options?: OnigurumaToEsOptions): RegExp {
  return toRegExp(
    pattern,
    {
      global: true,
      hasIndices: true,
      rules: {
        allowOrphanBackrefs: true,
        allowUnhandledGAnchors: true,
        asciiWordBoundaries: true,
      },
      ...options,
    },
  )
}

export class JavaScriptScanner implements PatternScanner {
  regexps: (RegExp | null)[]

  constructor(
    public patterns: string[],
    public options: JavaScriptRegexEngineOptions = {},
  ) {
    const {
      forgiving = false,
      cache,
      target = 'auto',
      regexConstructor = (pattern: string) => defaultJavaScriptRegexConstructor(pattern, { target }),
    } = options

    this.regexps = patterns.map((p) => {
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
        regexp.lastIndex = startPosition
        const match = regexp.exec(str)

        if (!match)
          continue

        // If the match is at the start position, return it immediately
        if (match.index === startPosition) {
          return toResult(i, match, 0)
        }
        // Otherwise, store it for later
        pending.push([i, match, 0])
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
 * As Oniguruma supports some features that can't be emulated using native JavaScript regexes, some
 * patterns are not supported. Errors will be thrown when parsing TextMate grammars with
 * unsupported patterns, and when the grammar includes patterns that use invalid Oniguruma syntax.
 * Set `forgiving` to `true` to ignore these errors and skip any unsupported or invalid patterns.
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
