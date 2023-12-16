import { twoslasher } from '@typescript/twoslash'
import { createTransformer } from './core'

export * from './core'

export const transformerTwoSlash = createTransformer(twoslasher)
