import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import type { VueSpecificOptions } from 'twoslash-vue'
import type { TwoslashFloatingVueRendererOptions } from './renderer-floating-vue'

interface TransformerTwoslashVueOptions extends TransformerTwoslashOptions {
  twoslashOptions?: TransformerTwoslashOptions['twoslashOptions'] & VueSpecificOptions
}

export interface VitePressPluginTwoslashOptions extends TransformerTwoslashVueOptions, TwoslashFloatingVueRendererOptions {
  /**
   * Requires adding `twoslash` to the code block explicitly to run twoslash
   * @default true
   */
  explicitTrigger?: TransformerTwoslashOptions['explicitTrigger']
}
