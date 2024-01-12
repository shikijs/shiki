import type { Plugin } from 'vue'
import FloatingVue from 'floating-vue'

export type FloatingVueConfig = Parameters<(typeof FloatingVue)['install']>[1]

/**
 * Vue plugin to install FloatingVue with styles.
 *
 * Import this function in `.vitepress/theme/index.ts` and use `app.use(TwoSlashFloatingVue)` inside the `enhanceApp` hook.
 */
const TwoSlashFloatingVue: Plugin<[FloatingVueConfig?]> = {
  install: (app, options: FloatingVueConfig = {}) => {
    app.use(FloatingVue, {
      ...options,
      themes: {
        twoslash: {
          $extend: 'dropdown',
          triggers: ['hover', 'focus', 'touch'],
          popperTriggers: ['hover', 'focus', 'touch'],
          delay: 0,
          handleResize: false,
          autoHide: true,
          instantMove: true,
        },
        ...options.theme,
      },
    })
  },
}

export default TwoSlashFloatingVue
