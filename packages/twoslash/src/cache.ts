import type { CodeToHastOptions } from '@shikijs/types'
import type { TwoslashExecuteOptions } from 'twoslash'
import type { TwoslashShikiReturn } from '.'

export interface TwoslashTypesCache {
  read: (code: string, lang: string, options?: TwoslashExecuteOptions, meta?: CodeToHastOptions['meta']) => TwoslashShikiReturn | null

  write: (data: TwoslashShikiReturn, code: string, lang: string, options?: TwoslashExecuteOptions, meta?: CodeToHastOptions['meta']) => void

  init?: () => void
}
