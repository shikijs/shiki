import type { GrammarState, ThemedToken } from '@shikijs/core'
import type { ShikiStreamTokenizerEnqueueResult, ShikiStreamTokenizerOptions } from './types'

export class ShikiStreamTokenizer {
  public readonly options: ShikiStreamTokenizerOptions

  public tokensStable: ThemedToken[] = []
  public tokensUnstable: ThemedToken[] = []

  public lastUnstableCodeChunk: string = ''
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
    const chunkLines = (this.lastUnstableCodeChunk + chunk).split('\n')

    const stable: ThemedToken[] = []
    let unstable: ThemedToken[] = []
    const recall = this.tokensUnstable.length

    chunkLines.forEach((line, i) => {
      const isLastLine = i === chunkLines.length - 1

      const result = this.options.highlighter.codeToTokens(line, {
        ...this.options,
        grammarState: this.lastStableGrammarState,
      })
      const tokens = result.tokens[0] // only one line
      if (!isLastLine)
        tokens.push({ content: '\n', offset: 0 })

      if (!isLastLine) {
        this.lastStableGrammarState = result.grammarState
        stable.push(...tokens)
      }
      else {
        unstable = tokens
        this.lastUnstableCodeChunk = line
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
    this.lastStableGrammarState = undefined
    return {
      stable,
    }
  }

  clear(): void {
    this.tokensStable = []
    this.tokensUnstable = []
    this.lastUnstableCodeChunk = ''
    this.lastStableGrammarState = undefined
  }

  clone(): ShikiStreamTokenizer {
    const clone = new ShikiStreamTokenizer(
      this.options,
    )
    clone.lastUnstableCodeChunk = this.lastUnstableCodeChunk
    clone.tokensUnstable = this.tokensUnstable
    clone.tokensStable = this.tokensStable
    clone.lastStableGrammarState = this.lastStableGrammarState
    return clone
  }
}
