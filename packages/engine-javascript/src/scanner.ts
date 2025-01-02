import type {
  PatternScanner,
  RegexEngineString,
} from '@shikijs/types'
import type { IOnigMatch } from '@shikijs/vscode-textmate'

const MAX = 4294967295

export interface JavaScriptRegexScannerOptions {
  /**
   * Whether to allow invalid regex patterns.
   *
   * @default false
   */
  forgiving?: boolean

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

export class JavaScriptScanner implements PatternScanner {
  regexps: (RegExp | null)[]

  constructor(
    public patterns: (string | RegExp)[],
    public options: JavaScriptRegexScannerOptions = {},
  ) {
    const {
      forgiving = false,
      cache,
      regexConstructor,
    } = options

    if (!regexConstructor) {
      throw new Error('Option `regexConstructor` is not provided')
    }

    this.regexps = patterns.map((p) => {
      if (typeof p !== 'string') {
        return p
      }
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

  findNextMatchSync(string: string | RegexEngineString, startPosition: number, _options: number): IOnigMatch | null {
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
              start: MAX,
              end: MAX,
              length: 0,
            }
          }
          return {
            start: indice[0] + offset,
            end: indice[1] + offset,
            length: indice[1] - indice[0],
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
