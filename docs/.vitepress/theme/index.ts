// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import 'uno.css'
import 'shikiji-twoslash/style-rich.css'
import './style.css'
import './custom.css'
import { createPinia } from 'pinia'
import HomeDemo from '../components/HomeDemo.vue'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(HomeDemo),
    })
  },
  enhanceApp({ app }: any) {
    app.use(createPinia())
  },
}
