import { twoslasher } from '@typescript/twoslash'
import { createTransformerFactory } from './core'

export * from './core'

export const transformerTwoSlash = createTransformerFactory(twoslasher)
