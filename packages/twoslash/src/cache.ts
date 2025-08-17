import type { ShikiTransformerContextMeta } from '@shikijs/types'
import type { TwoslashExecuteOptions } from 'twoslash'
import type { TwoslashShikiReturn } from '.'

export interface TwoslashTypesCache {
  init?: () => void

  preprocess?: (code: string, lang: string, options: TwoslashExecuteOptions, meta: ShikiTransformerContextMeta) => string | void

  read: (code: string, lang: string, options: TwoslashExecuteOptions, meta: ShikiTransformerContextMeta) => TwoslashShikiReturn | null

  write: (data: TwoslashShikiReturn, code: string, lang: string, options: TwoslashExecuteOptions, meta: ShikiTransformerContextMeta) => void
}
