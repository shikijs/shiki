import type { bundledLanguages } from './assets/langs'
import type { bundledThemes } from './themes'

export type BuiltinLanguage = keyof typeof bundledLanguages
export type BuiltinTheme = keyof typeof bundledThemes

export type * from 'shikiji-core/types'
