import type { CreateTwoslashOptions } from 'twoslash'
import { createTwoslasher } from 'twoslash'
import type { RendererRichOptions, TransformerTwoslashOptions } from './core'
import { createTransformerFactory, rendererRich } from './core'

export * from './core'

export interface TransformerTwoslashIndexOptions extends TransformerTwoslashOptions, Pick<CreateTwoslashOptions, 'cache'> {
  /**
   * Options for the default rich renderer.
   *
   * Available when no custom renderer is provided.
   */
  rendererRich?: RendererRichOptions
}

/**
 * Factory function to create a Shikiji transformer for twoslash integrations.
 */
export function transformerTwoslash(options: TransformerTwoslashIndexOptions = {}) {
  return createTransformerFactory(
    createTwoslasher({ cache: options?.cache }),
    rendererRich(options.rendererRich),
  )(options)
}
