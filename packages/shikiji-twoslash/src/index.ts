import { createTwoSlasher } from 'twoslash'
import { createTransformerFactory, rendererClassic } from './core'

export * from './core'

/**
 * Factory function to create a Shikiji transformer for twoslash integrations.
 */
export const transformerTwoSlash = /* @__PURE__ */ createTransformerFactory(
  /* @__PURE__ */ createTwoSlasher(),
  /* @__PURE__ */ rendererClassic(),
)
