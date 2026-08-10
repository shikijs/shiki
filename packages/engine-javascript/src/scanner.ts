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
  regexps: (RegExp | null)[][]
  patternGroupCounts: number[] = []

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
        this.patternGroupCounts.push(0)
        return [p]
      }

      const groups = countCapturingGroups(p)
      this.patternGroupCounts.push(groups)

      const chunks = splitPattern(p)
      return chunks.map((chunk) => {
        // Cache
        const cached = cache?.get(chunk)
        if (cached) {
          if (cached instanceof RegExp) {
            return cached
          }
          if (forgiving)
            return null
          throw cached
        }
        try {
          const regex = regexConstructor(chunk)
          cache?.set(chunk, regex)
          return regex
        }
        catch (e) {
          cache?.set(chunk, e as Error)
          if (forgiving)
            return null
          throw e
        }
      })
    })
  }

  findNextMatchSync(string: string | RegexEngineString, startPosition: number, _options: number): IOnigMatch | null {
    const str = typeof string === 'string'
      ? string
      : string.content
    const pending: [index: number, match: RegExpExecArray, offset: number][] = []

    function toResult(index: number, match: RegExpExecArray, expectedGroupCount: number, offset = 0): IOnigMatch {
      const indices = match.indices! as ([number, number] | null)[]
      // Pad indices to match expected group count
      while (indices.length < expectedGroupCount + 1) {
        indices.push(null)
      }

      const captureIndices = indices.map((indice) => {
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
      })

      return {
        index,
        captureIndices,
      }
    }

    for (let i = 0; i < this.regexps.length; i++) {
      const regexpList = this.regexps[i]
      for (let j = 0; j < regexpList.length; j++) {
        const regexp = regexpList[j]
        if (!regexp || !(regexp instanceof RegExp))
          continue
        try {
          regexp.lastIndex = startPosition
          const match = regexp.exec(str)

          if (!match)
            continue

          // If the match is at the start position, return it immediately
          if (match.index === startPosition) {
            return toResult(i, match, this.patternGroupCounts[i], 0)
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
    }

    // Find the closest match to the start position
    if (pending.length) {
      const minIndex = Math.min(...pending.map(m => m[1].index))
      for (const [i, match, offset] of pending) {
        if (match.index === minIndex) {
          return toResult(i, match, this.patternGroupCounts[i], offset)
        }
      }
    }

    return null
  }
}

function splitPattern(pattern: string, checkOptimization = true): string[] {
  // A conservative limit for the regex pattern length.
  if (pattern.length < 350)
    return [pattern]

  // Optimization: Only target patterns that are likely to hit the specific issue.
  // The issue observed is related to case-insensitivity (?i) and word boundaries \b.
  // Also, splitting breaks capture group indexing if nested groups exist.
  // So we should be VERY conservative.
  if (checkOptimization && !pattern.includes('(?i'))
    return [pattern]

  let parenBalance = 0
  let bracketBalance = 0
  let splitIndex = -1
  const target = pattern.length / 2
  let bestDist = Infinity

  // Scan for top-level pipe |
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i]
    if (char === '\\') {
      i++
      continue
    }
    if (char === '[') {
      bracketBalance++
    }
    else if (char === ']') {
      bracketBalance--
    }
    else if (char === '(' && bracketBalance === 0) {
      parenBalance++
    }
    else if (char === ')' && bracketBalance === 0) {
      parenBalance--
    }
    else if (char === '|' && parenBalance === 0 && bracketBalance === 0) {
      const dist = Math.abs(i - target)
      if (dist < bestDist) {
        bestDist = dist
        splitIndex = i
      }
    }
  }

  if (splitIndex !== -1) {
    const left = pattern.slice(0, splitIndex)
    const right = pattern.slice(splitIndex + 1)
    // Pass checkOptimization=false because we are inside a pattern that already passed the check
    return [...splitPattern(left, false), ...splitPattern(right, false)]
  }

  // Wrappers check

  // (?i) prefix
  if (pattern.startsWith('(?i)')) {
    const inner = pattern.slice(4)
    const chunks = splitPattern(inner, false)
    return chunks.map(c => `(?i)${c}`)
  }

  // \b ... \b
  if (pattern.startsWith('\\b') && pattern.endsWith('\\b')) {
    const inner = pattern.slice(2, -2)
    if (isBalanced(inner)) {
      const chunks = splitPattern(inner, false)
      if (chunks.length > 1) {
        return chunks.map(c => `\\b${c}\\b`)
      }
    }
  }

  // (?i: ... )
  if (pattern.startsWith('(?i:') && pattern.endsWith(')')) {
    if (isSingleGroup(pattern)) {
      const inner = pattern.slice(4, -1)
      const chunks = splitPattern(inner, false)
      if (chunks.length > 1) {
        return chunks.map(c => `(?i:${c})`)
      }
    }
  }

  // (?: ... )
  if (pattern.startsWith('(?:') && pattern.endsWith(')')) {
    if (isSingleGroup(pattern)) {
      const inner = pattern.slice(3, -1)
      const chunks = splitPattern(inner, false)
      if (chunks.length > 1) {
        return chunks.map(c => `(?:${c})`)
      }
    }
  }

  // ( ... )
  if (pattern.startsWith('(') && pattern.endsWith(')')) {
    if (isSingleGroup(pattern)) {
      const inner = pattern.slice(1, -1)
      const chunks = splitPattern(inner, false)
      if (chunks.length > 1) {
        return chunks.map(c => `(${c})`)
      }
    }
  }

  return [pattern]
}

function countCapturingGroups(pattern: string): number {
  let groups = 0
  let bracketBalance = 0
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '\\') {
      i++
      continue
    }
    if (pattern[i] === '[') {
      bracketBalance++
    }
    else if (pattern[i] === ']') {
      bracketBalance--
    }
    else if (pattern[i] === '(' && bracketBalance === 0) {
      if (pattern[i + 1] !== '?') {
        groups++
      }
      else if (pattern[i + 2] === '<' && pattern[i + 3] !== '=' && pattern[i + 3] !== '!') {
        groups++
      }
    }
  }
  return groups
}

function isBalanced(s: string): boolean {
  let parenBalance = 0
  let bracketBalance = 0
  for (let i = 0; i < s.length; i++) {
    const char = s[i]
    if (char === '\\') {
      i++
      continue
    }
    if (char === '[')
      bracketBalance++
    else if (char === ']')
      bracketBalance--
    else if (char === '(' && bracketBalance === 0)
      parenBalance++
    else if (char === ')' && bracketBalance === 0)
      parenBalance--
  }
  return parenBalance === 0 && bracketBalance === 0
}

function isSingleGroup(s: string): boolean {
  if (!s.startsWith('(')) {
    return false
  }
  if (!s.endsWith(')')) {
    return false
  }

  let parenBalance = 0
  let bracketBalance = 0
  // We expect the first ( to be closed ONLY at the very end.
  for (let i = 0; i < s.length; i++) {
    const char = s[i]
    if (char === '\\') {
      i++
      continue
    }
    if (char === '[') {
      bracketBalance++
    }
    else if (char === ']') {
      bracketBalance--
    }
    else if (char === '(' && bracketBalance === 0) {
      parenBalance++
    }
    else if (char === ')' && bracketBalance === 0) {
      parenBalance--
      if (parenBalance === 0 && i < s.length - 1) {
        return false // Closed before end
      }
    }
  }
  return parenBalance === 0 && bracketBalance === 0
}
