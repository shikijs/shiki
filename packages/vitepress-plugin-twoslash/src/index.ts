import { createTransformerFactory } from 'shikiji-twoslash/core'
import { createTwoSlasher } from 'twoslash-vue'
import type { RendererRichOptions, TransformerTwoSlashOptions } from 'shikiji-twoslash'
import type { ShikijiTransformer } from 'shikiji'
import { rendererFloatingVue } from './renderer-floating-vue'

export * from './renderer-floating-vue'

export interface VitePressPluginTwoSlashOptions extends TransformerTwoSlashOptions, RendererRichOptions {
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
export function transformerTwoslash(options: VitePressPluginTwoSlashOptions = {}): ShikijiTransformer {
  const twoslash = createTransformerFactory(
    createTwoSlasher(),
  )({
    langs: ['ts', 'tsx', 'js', 'jsx', 'json', 'vue'],
    explicitTrigger: true,
    renderer: rendererFloatingVue(),
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
    postprocess(html, options) {
      if (this.meta.twoslash && options.lang === 'vue')
        return html.replace(/{/g, '&#123;')
    },
  }
}
