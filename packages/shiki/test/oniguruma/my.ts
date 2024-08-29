import type { IOnigMatch, OnigScanner, OnigString } from '../../../core/src/oniguruma/types'
import type { IOnigLib } from '../../../core/vendor/vscode-textmate/src/onigLib'

const MAX = 4294967295

export class NativeOnigScanner implements OnigScanner {
  regexps: RegExp[]

  constructor(public patterns: string[]) {
    this.regexps = patterns.map(p => covertRegex(p))
  }

  findNextMatchSync(string: string | OnigString, startPosition: number): IOnigMatch | null {
    const str = typeof string === 'string' ? string : string.content
    const pending: [index: number, match: RegExpExecArray][] = []

    function toResult(index: number, match: RegExpExecArray) {
      let indicesIndex = match.index
      return {
        index,
        captureIndices: match.map((g) => {
          if (g == null) {
            return {
              end: MAX,
              start: MAX,
              length: 0,
            }
          }
          const indice = {
            start: indicesIndex,
            length: g.length,
            end: indicesIndex + g.length,
          }
          indicesIndex += g.length
          return indice
        }),
      }
    }

    for (let i = 0; i < this.regexps.length; i++) {
      const regexp = this.regexps[i]
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

// Run a proper parser to normalize the regex
const fixMap = {
  '(?=(?:[^\\s[-?:,\\[\\]{}#&*!|>\'"%@`]]|[?:-]\\S)([^\\s:]|:\\S|\\s+(?![#\\s]))*\\s*:(\\s|$))': '(?=(?:[^\\s\\-?:,\\[\\]{}#&*!|>\'"%@`]|[?:-]\\S)([^\\s:]|:\\S|\\s+(?![#\\s]))*\\s*:(\\s|$))',
  '[^\\s[-?:,\\[\\]{}#&*!|>\'"%@`]]|[?:-]\\S': '[^\\s\\-?:,\\[\\]{}#&*!|>\'"%@`]|[?:-]\\S',
  '[^\\s[-?:,\\[\\]{}#&*!|>\'"%@`]]|[?:-][^\\s[\\[\\]{},]]': '[^\\s\\-?:,\\[\\]{}#&*!|>\'"%@`]|[?:-][^\\s\\[\\]{},]]',
} as Record<string, string>

/**
 * Convert Oniguruma regex to JavaScript regex.
 */
function covertRegex(pattern: string) {
  const original = pattern
  // `(?x)` stands for free-spacing mode
  // https://www.regular-expressions.info/freespacing.html
  // We remove comments and whitespaces
  if (pattern.startsWith('(?x)') || pattern.includes('(?x:')) {
    pattern = pattern
      .slice(4)
      .replace(/\s#[^\n]*\n?/g, '') // remove comments
      .replace(/\s+/g, '') // remove whitespaces
      .replace(/\(\?x:/g, '(?:')
  }

  // pattern = pattern
  // .replace(/\[-/g, '[\\-')

  pattern = pattern
    .replace(/\[:alnum:\]/g, '[0-9A-Za-z]')
    .replace(/\[:alpha:\]/g, '[A-Za-z]')
    .replace(/\[:blank:\]/g, '[ \\t]')
    .replace(/\[:cntrl:\]/g, '[\\x00-\\x1F\\x7F]')
    .replace(/\[:digit:\]/g, '\\d')
    .replace(/\[:graph:\]/g, '[!-~]')
    .replace(/\[:lower:\]/g, '[a-z]')
    .replace(/\[:print:\]/g, '[ -~]')
    .replace(/\[:punct:\]/g, '[!-/:-@\\[-`{-~]')
    .replace(/\[:space:\]/g, '\\s')
    .replace(/\[:upper:\]/g, '[A-Z]')
    .replace(/\[:word:\]/g, '[0-9A-Za-z_]')
    .replace(/\[:xdigit:\]/g, '[0-9A-Fa-f]')

  if (fixMap[pattern])
    pattern = fixMap[pattern]

  try {
    return new RegExp(pattern, 'g')
  }
  catch (e) {
    console.error('pattern:', {
      original,
      pattern,
    })
    throw e
  }
}

export const NativeOnigLib: IOnigLib = {
  createOnigScanner(patterns: string[]) {
    return new NativeOnigScanner(patterns)
  },
  createOnigString(s: string) {
    return {
      content: s,
    }
  },
}
