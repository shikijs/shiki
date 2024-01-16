import type { Plugin } from 'vue'
import FloatingVue from 'floating-vue'

const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export type FloatingVueConfig = Parameters<(typeof FloatingVue)['install']>[1]

/**
 * Vue plugin to install FloatingVue with styles.
 *
 * Import this function in `.vitepress/theme/index.ts` and use `app.use(TwoslashFloatingVue)` inside the `enhanceApp` hook.
 */
const TwoslashFloatingVue: Plugin<[FloatingVueConfig?]> = {
  install: (app, options: FloatingVueConfig = {}) => {
    app.use(FloatingVue, {
      ...options,
      themes: {
        twoslash: {
          $extend: 'dropdown',
          triggers: isMobile ? ['touch'] : ['hover', 'touch'],
          popperTriggers: isMobile ? ['touch'] : ['hover', 'touch'],
          overflowPadding: 10,
          delay: 0,
          handleResize: false,
          autoHide: true,
          instantMove: true,
          flip: false,
        },
        ...options.theme,
      },
    })
  },
}

export default TwoslashFloatingVue
