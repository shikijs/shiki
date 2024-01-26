// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { createPinia } from 'pinia'
import TwoslashFloatingVue from '../../../packages/vitepress-twoslash/src/client'

import '../../../packages/twoslash/style-rich.css'
import 'floating-vue/dist/style.css'
import '../../../packages/vitepress-twoslash/src/style.css'
import 'uno.css'
import './style.css'
import './transformers.css'

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(createPinia())
    app.use(TwoslashFloatingVue)
  },
}
