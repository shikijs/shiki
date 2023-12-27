// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import 'uno.css'
import 'shikiji-twoslash/style-rich.css'

// eslint-disable-next-line antfu/no-import-dist
import 'floating-vue/dist/style.css'
import './style.css'
import './custom.css'
import { createPinia } from 'pinia'
import FloatingVue from 'floating-vue'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {})
  },
  enhanceApp({ app }: any) {
    app.use(createPinia())

    FloatingVue.options.themes.menu.delay = { show: 0, hide: 0 }
    app.use(FloatingVue)
  },
}
