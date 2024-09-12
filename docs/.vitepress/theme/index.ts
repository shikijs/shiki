// https://vitepress.dev/guide/custom-theme
import type { EnhanceAppContext } from 'vitepress'
import { createPinia } from 'pinia'
import Theme from 'vitepress/theme'
import { h } from 'vue'
import TwoslashFloatingVue from '../../../packages/vitepress-twoslash/src/client'

import 'floating-vue/dist/style.css'
import '../../../packages/twoslash/style-rich.css'
import '../../../packages/vitepress-twoslash/src/style.css'
import 'uno.css'
import './style.css'
import './transformers.css'

// @unocss-include

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(createPinia())
    app.use(TwoslashFloatingVue)
  },
  Layout() {
    return h(Theme.Layout, null, {
      'home-hero-actions-after': () => h('div', { class: 'mt-10 mb--4 vp-doc' }, [
        h('a', { href: 'https://nuxt.com/blog/shiki-v1', target: '_blank', class: 'no-underline! flex-inline gap-1 items-center' }, [
          h('div', { class: 'i-ph-books-duotone text-2xl' }),
          'The Evolution of Shiki v1.0',
          h('div', { class: 'i-ph-arrow-up-right mt--3 ml--1' }),
        ]),
      ]),
    })
  },
}
