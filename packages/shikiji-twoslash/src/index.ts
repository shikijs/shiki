import { createTwoslasher } from 'twoslash'
import { createTransformerFactory, rendererRich } from './core'

export * from './core'

/**
 * Factory function to create a Shikiji transformer for twoslash integrations.
 */
export const transformerTwoslash = /* @__PURE__ */ createTransformerFactory(
  /* @__PURE__ */ createTwoslasher(),
  /* @__PURE__ */ rendererRich(),
)
