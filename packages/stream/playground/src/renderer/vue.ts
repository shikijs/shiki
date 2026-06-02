import type { App } from 'vue'
import type { RendererFactory, RendererFactoryResult } from './types'
import { createApp, h, reactive } from 'vue'
import { ShikiStreamRenderer } from '../../../src/vue'

export const createRendererVue: RendererFactory = (options): RendererFactoryResult => {
  let app: App | undefined

  const props = reactive({
    onStreamStart: options.onStart,
    onStreamEnd: options.onEnd,
  })

  return {
    mount: (element, payload) => {
      Object.assign(props, payload)
      if (app)
        return
      app = createApp({
        render: () => h(ShikiStreamRenderer, props as any),
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
