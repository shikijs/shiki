import type {
  PatternScanner,
  RegexEngine,
  RegexEngineString,
} from '@shikijs/types'
import type { IOnigMatch } from '@shikijs/vscode-textmate'
import type { Options as OnigurumaToEsOptions } from 'oniguruma-to-es'
import { toRegExp } from 'oniguruma-to-es'

export interface JavaScriptRegexEngineOptions {
  /**
   * Whether to allow invalid regex patterns.
   *
   * @default false
   */
  forgiving?: boolean

  /**
   * Cleanup some grammar patterns before use.
   *
   * @default true
   */
  simulation?: boolean

  /**
   * The target ECMAScript version.
   *
   * For the best accuracy, Oniguruma-to-ES needs the `v` flag support in RegExp which is landed in ES2024.
   * Which requires Node.js 20+ or Chrome 112+.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets
   *
   * For the maximum compatibility, you can set it to `ES2018`. Which will use the `u` flag to simulate and will be less accurate.
   *
   * Set to `auto` to detect the target version automatically.
   *
   * @default 'auto'
   */
  target?: 'ES2024' | 'ES2025' | 'ES2018' | 'auto'

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

type NonNullable<T> = T extends null | undefined ? never : T

const MAX = 4294967295

let supportedRegExpTarget: OnigurumaToEsOptions['target'] | undefined

function detectRegExpTarget(): NonNullable<OnigurumaToEsOptions['target']> {
  if (supportedRegExpTarget != null)
    return supportedRegExpTarget

  supportedRegExpTarget = 'ES2018'

  try {
    // eslint-disable-next-line prefer-regex-literals, no-new
    new RegExp('a', 'v')
    supportedRegExpTarget = 'ES2024'
  }
  catch {
    supportedRegExpTarget = 'ES2018'
  }

  return supportedRegExpTarget
}

/**
 * The default RegExp constructor for JavaScript regex engine.
 */
export function defaultJavaScriptRegexConstructor(pattern: string, options?: OnigurumaToEsOptions): RegExp {
  return toRegExp(
    pattern,
    {
      accuracy: 'loose',
      global: true,
      hasIndices: true,
      tmGrammar: true,
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
      simulation = true,
      regexConstructor = (pattern: string) => defaultJavaScriptRegexConstructor(pattern, {
        target: target === 'auto'
          ? detectRegExpTarget()
          : target,
      }),
    } = options

    this.regexps = patterns.map((p) => {
      /**
       * vscode-textmate replace anchors to \uFFFF, where we still not sure how to handle it correctly
       *
       * @see https://github.com/shikijs/vscode-textmate/blob/8d2e84a3aad21afd6b08fd53c7acd421c7f5aa44/src/rule.ts#L687-L702
       *
       * This is a temporary workaround for markdown grammar
       */
      if (simulation)
        p = p.replaceAll('(^|\\\uFFFF)', '(^|\\G)')

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
