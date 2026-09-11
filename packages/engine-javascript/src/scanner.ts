import type {
  PatternScanner,
  RegexEngineString,
} from '@shikijs/types'
import type { IOnigMatch } from '@shikijs/vscode-textmate'
import type { JavaScriptEngineString } from './string'

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

interface LastSearch {
  strId: number
  searchedFrom: number
  matchIndex: number // -1 for no match
  indices: RegExpIndicesArray | null
}

// Sticky regexps and `EmulatedRegExp`s with a search strategy (how `oniguruma-to-es` emulates `\G`)
// depend on the exact start position, so their searches can't be reused
function isSearchCacheable(regexp: RegExp): boolean {
  return !regexp.sticky && !(regexp as { rawOptions?: { strategy?: string | null } }).rawOptions?.strategy
}

function toResult(index: number, indices: RegExpIndicesArray): IOnigMatch {
  return {
    index,
    captureIndices: indices.map((indice) => {
      if (indice == null) {
        return {
          start: MAX,
          end: MAX,
          length: 0,
        }
      }
      return {
        start: indice[0],
        end: indice[1],
        length: indice[1] - indice[0],
      }
    }),
  }
}

export class JavaScriptScanner implements PatternScanner {
  regexps: (RegExp | null)[]

  /**
   * Last search of each regexp on the current string, reused the way `vscode-oniguruma` does.
   * `null` for regexps whose searches can't be reused.
   */
  private lastSearches: (LastSearch | null)[]

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

    this.lastSearches = this.regexps.map(regexp => regexp && isSearchCacheable(regexp)
      ? { strId: 0, searchedFrom: 0, matchIndex: -1, indices: null }
      : null,
    )
  }

  findNextMatchSync(string: string | RegexEngineString, startPosition: number, _options: number): IOnigMatch | null {
    const str = typeof string === 'string'
      ? string
      : string.content
    // No id (plain string or a string from another engine): never reuse
    const strId = typeof string === 'string'
      ? 0
      : (string as Partial<JavaScriptEngineString>).id || 0

    let bestIndex = -1
    let bestMatchIndex = 0
    let bestIndices: RegExpIndicesArray | null = null

    for (let i = 0; i < this.regexps.length; i++) {
      const regexp = this.regexps[i]
      if (!regexp)
        continue
      try {
        const last = strId ? this.lastSearches[i] : null
        let matchIndex: number
        let indices: RegExpIndicesArray | null

        // Still valid if it found nothing, or a match at or after the start position
        if (last && last.strId === strId && last.searchedFrom <= startPosition && (last.matchIndex === -1 || last.matchIndex >= startPosition)) {
          matchIndex = last.matchIndex
          indices = last.indices
        }
        else {
          regexp.lastIndex = startPosition
          const match = regexp.exec(str)
          matchIndex = match ? match.index : -1
          indices = match ? match.indices! : null
          if (last) {
            last.strId = strId
            last.searchedFrom = startPosition
            last.matchIndex = matchIndex
            last.indices = indices
          }
        }

        if (matchIndex === -1)
          continue

        // If the match is at the start position, return it immediately
        if (matchIndex === startPosition) {
          return toResult(i, indices!)
        }
        // Otherwise, keep the closest one
        if (bestIndex === -1 || matchIndex < bestMatchIndex) {
          bestIndex = i
          bestMatchIndex = matchIndex
          bestIndices = indices
        }
      }
      catch (e) {
        if (this.options.forgiving)
          continue
        throw e
      }
    }

    return bestIndex === -1
      ? null
      : toResult(bestIndex, bestIndices!)
  }
}
