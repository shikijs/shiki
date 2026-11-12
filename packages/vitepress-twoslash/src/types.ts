import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import type { VueSpecificOptions } from 'twoslash-vue'
import type { TwoslashFloatingVueRendererOptions } from './renderer-floating-vue'

interface TransformerTwoslashVueOptions extends TransformerTwoslashOptions {
  twoslashOptions?: TransformerTwoslashOptions['twoslashOptions'] & VueSpecificOptions
}

export interface VitePressPluginTwoslashOptions extends TransformerTwoslashVueOptions, TwoslashFloatingVueRendererOptions {
  /**
   * Compile default-renderer popups as static HTML in ordinary VitePress fences.
   * Interpolated fences, custom renderers and unrecognized hook orders retain
   * their full HAST. Disable this to inspect popup descendants in later hooks
   * or apply scoped SFC styles to them.
   * @default true
   */
  optimizePopups?: boolean
  /**
   * Requires adding `twoslash` to the code block explicitly to run twoslash
   * @default true
   */
  explicitTrigger?: TransformerTwoslashOptions['explicitTrigger']
}
