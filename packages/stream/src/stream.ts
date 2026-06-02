import type { ThemedToken } from '@shikijs/core'
import type { CodeToTokenTransformStreamOptions, RecallToken } from './types'
import { ShikiStreamTokenizer } from './tokenizer'

/**
 * Create a transform stream that takes code chunks and emits themed tokens.
 */
export class CodeToTokenTransformStream extends TransformStream<string, ThemedToken | RecallToken> {
  readonly tokenizer: ShikiStreamTokenizer
  readonly options: CodeToTokenTransformStreamOptions

  constructor(
    options: CodeToTokenTransformStreamOptions,
  ) {
    const tokenizer = new ShikiStreamTokenizer(options)
    const {
      allowRecalls = false,
    } = options

    super({
      async transform(chunk, controller) {
        const { stable, unstable: buffer, recall } = await tokenizer.enqueue(chunk)
        if (allowRecalls && recall > 0) {
          controller.enqueue({ recall } as any)
        }
        for (const token of stable) {
          controller.enqueue(token)
        }
        if (allowRecalls) {
          for (const token of buffer) {
            controller.enqueue(token)
          }
        }
      },
      async flush(controller) {
        const { stable } = tokenizer.close()
        // if allow recalls, the tokens should already be sent
        if (!allowRecalls) {
          for (const token of stable) {
            controller.enqueue(token)
          }
        }
      },
    })

    this.tokenizer = tokenizer
    this.options = options
  }
}
