import type { GrammarState, ThemedToken } from '@shikijs/core'
import type { ShikiStreamTokenizerEnqueueResult, ShikiStreamTokenizerOptions } from './types'
import { splitLines } from '@shikijs/core'

export class ShikiStreamTokenizer {
  public readonly options: ShikiStreamTokenizerOptions

  public tokensStable: ThemedToken[] = []
  public tokensUnstable: ThemedToken[] = []

  public lastUnstableCodeChunk: string = ''
  /**
   * Offset of `lastUnstableCodeChunk` in the whole streamed code
   */
  public lastUnstableCodeOffset: number = 0
  public lastStableGrammarState: GrammarState | undefined

  constructor(
    options: ShikiStreamTokenizerOptions,
  ) {
    this.options = options
  }

  /**
   * Enqueue a chunk of code to the buffer.
   */
  async enqueue(chunk: string): Promise<ShikiStreamTokenizerEnqueueResult> {
    const offset = this.lastUnstableCodeOffset
    const chunkLines = splitLines(this.lastUnstableCodeChunk + chunk)

    const stable: ThemedToken[] = []
    let unstable: ThemedToken[] = []
    const recall = this.tokensUnstable.length

    chunkLines.forEach(([line, lineOffset], i) => {
      const isLastLine = i === chunkLines.length - 1

      const result = this.options.highlighter.codeToTokens(line, {
        ...this.options,
        grammarState: this.lastStableGrammarState,
      })
      const tokens = result.tokens[0] // only one line
      for (const token of tokens)
        token.offset += offset + lineOffset
      // the `\n` is the last character before the next line, after any `\r`
      if (!isLastLine)
        tokens.push({ content: '\n', offset: offset + chunkLines[i + 1][1] - 1 })

      if (!isLastLine) {
        this.lastStableGrammarState = result.grammarState
        stable.push(...tokens)
      }
      else {
        unstable = tokens
        this.lastUnstableCodeChunk = line
        this.lastUnstableCodeOffset = offset + lineOffset
      }
    })

    this.tokensStable.push(...stable)
    this.tokensUnstable = unstable

    return {
      recall,
      stable,
      unstable,
    }
  }

  close(): { stable: ThemedToken[] } {
    const stable = this.tokensUnstable
    this.tokensUnstable = []
    this.lastUnstableCodeChunk = ''
    this.lastUnstableCodeOffset = 0
    this.lastStableGrammarState = undefined
    return {
      stable,
    }
  }

  clear(): void {
    this.tokensStable = []
    this.tokensUnstable = []
    this.lastUnstableCodeChunk = ''
    this.lastUnstableCodeOffset = 0
    this.lastStableGrammarState = undefined
  }

  clone(): ShikiStreamTokenizer {
    const clone = new ShikiStreamTokenizer(
      this.options,
    )
    clone.lastUnstableCodeChunk = this.lastUnstableCodeChunk
    clone.lastUnstableCodeOffset = this.lastUnstableCodeOffset
    clone.tokensUnstable = this.tokensUnstable
    clone.tokensStable = this.tokensStable
    clone.lastStableGrammarState = this.lastStableGrammarState
    return clone
  }
}
