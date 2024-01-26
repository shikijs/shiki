import type { TransformerTwoslashOptions } from 'shikiji-twoslash/core'
import { createTransformerFactory } from 'shikiji-twoslash/core'
import { createTwoslasher } from 'twoslash-vue'
import type { ShikijiTransformer } from 'shikiji'
import type { TwoslashFloatingVueRendererOptions } from './renderer-floating-vue'
import { rendererFloatingVue } from './renderer-floating-vue'

export * from './renderer-floating-vue'

export interface VitePressPluginTwoslashOptions extends TransformerTwoslashOptions, TwoslashFloatingVueRendererOptions {
  /**
   * Requires adding `twoslash` to the code block explicitly to run twoslash
   * @default true
   */
  explicitTrigger?: boolean
}

/**
 * Create a Shikiji transformer for VitePress to enable twoslash integration
 *
 * Add this to `markdown.codeTransformers` in `.vitepress/config.ts`
 */
export function transformerTwoslash(options: VitePressPluginTwoslashOptions = {}): ShikijiTransformer {
  const twoslash = createTransformerFactory(
    createTwoslasher(),
  )({
    langs: ['ts', 'tsx', 'js', 'jsx', 'json', 'vue'],
    explicitTrigger: true,
    renderer: rendererFloatingVue(options),
    ...options,
  })

  return {
    ...twoslash,
    name: 'vitepress-plugin-twoslash',
    preprocess(code, options) {
      const cleanup = options.transformers?.find(i => i.name === 'vitepress:clean-up')
      if (cleanup)
        options.transformers?.splice(options.transformers.indexOf(cleanup), 1)

      // Disable v-pre for twoslash, because we need render it with FloatingVue
      if (options.meta?.__raw?.includes('twoslash')) {
        const vPre = options.transformers?.find(i => i.name === 'vitepress:v-pre')
        if (vPre)
          options.transformers?.splice(options.transformers.indexOf(vPre), 1)
      }

      return twoslash.preprocess!.call(this, code, options)
    },
    postprocess(html) {
      if (this.meta.twoslash)
        return html.replace(/{/g, '&#123;')
    },
  }
}
