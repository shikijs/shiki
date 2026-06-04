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

    // Track the best non-anchored match inline rather than collecting
    // every candidate into a `pending` array and then spreading it into
    // `Math.min` afterwards. Saves N tuple allocations + one spread call
    // per scan position on grammars with many patterns.
    let bestIndex = -1
    let bestRegexIndex = -1
    let bestMatch: RegExpExecArray | null = null

    for (let i = 0; i < this.regexps.length; i++) {
      const regexp = this.regexps[i]
      if (!regexp)
        continue
      try {
        regexp.lastIndex = startPosition
        const match = regexp.exec(str)

        if (!match)
          continue

        // If the match is at the start position, return it immediately —
        // it can't be beaten by a later regex (leftmost-first semantics).
        if (match.index === startPosition) {
          return toResult(i, match, 0)
        }
        // Else keep the leftmost non-anchored hit seen so far.
        if (bestMatch === null || match.index < bestIndex) {
          bestIndex = match.index
          bestRegexIndex = i
          bestMatch = match
        }
      }
      catch (e) {
        if (this.options.forgiving)
          continue
        throw e
      }
    }

    if (bestMatch !== null)
      return toResult(bestRegexIndex, bestMatch, 0)

    return null
  }
}

function toResult(index: number, match: RegExpExecArray, offset = 0): IOnigMatch {
  // Manual loop avoids the `match.indices!.map(...)` intermediate-array
  // allocation. `match.indices` is a sparse-ish array of `[start, end]`
  // pairs or `undefined` for non-participating optional groups.
  const indices = match.indices!
  const captureIndices: { start: number, end: number, length: number }[] = Array.from({ length: indices.length })
  for (let k = 0, klen = indices.length; k < klen; k++) {
    const indice = indices[k]
    if (indice == null) {
      captureIndices[k] = { start: MAX, end: MAX, length: 0 }
    }
    else {
      captureIndices[k] = {
        start: indice[0] + offset,
        end: indice[1] + offset,
        length: indice[1] - indice[0],
      }
    }
  }
  return { index, captureIndices }
}
