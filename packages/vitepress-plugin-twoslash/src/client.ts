import 'shikiji-twoslash/style-rich.css'
import 'floating-vue/dist/style.css'
import 'vitepress-plugin-twoslash/style.css'

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
          $extend: 'menu',
          delay: { show: 0, hide: 0 },
        },
        ...options.theme,
      },
    })
  },
}

export default TwoSlashFloatingVue
