import { twoslasher } from '@typescript/twoslash'
import { createTransformerFactory } from './core'

export * from './core'

/**
 * Factory function to create a Shikiji transformer for twoslash integrations.
 */
export const transformerTwoSlash = createTransformerFactory(twoslasher)
