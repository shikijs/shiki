import type { App } from 'vue'
import type { RendererFactory, RendererFactoryResult } from './types'
import { createApp, h, reactive } from 'vue'
import { ShikiMagicMove } from '../../../src/vue'

export const createRendererVue: RendererFactory = (options): RendererFactoryResult => {
  let app: App | undefined

  const props = reactive({
    onStart: options.onStart,
    onEnd: options.onEnd,
  })

  return {
    mount: (element, payload) => {
      Object.assign(props, payload)
      if (app)
        return
      app = createApp({
        render: () => h(ShikiMagicMove, props as any),
      })
      app.mount(element)
      // eslint-disable-next-line no-console
      console.log('Vue renderer mounted')
    },

    update: (payload) => {
      Object.assign(props, payload)
    },

    dispose: () => {
      app?.unmount()
      app = undefined
    },
  }
}
