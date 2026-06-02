import type { ShikiMagicMove } from '../../../src/web-component/ShikiMagicMove'
import type { RendererFactory, RendererFactoryResult, RendererUpdatePayload } from './types'

import '../../../src/web-component/ShikiMagicMove'

export const createRendererWebComponent: RendererFactory = (options): RendererFactoryResult => {
  let app: ShikiMagicMove | undefined

  return {
    mount: async (element, payload) => {
      app = document.createElement('shiki-magic-move')

      app.addEventListener('onStart', options.onStart ?? (() => {}))
      app.addEventListener('onEnd', options.onEnd ?? (() => {}))

      Object.keys(payload).forEach((prop) => {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-ignore
        app[prop as keyof RendererUpdatePayload] = payload[prop as keyof RendererUpdatePayload]
      })

      element.appendChild(app)

      // eslint-disable-next-line no-console
      console.log('Web Component renderer mounted')
    },

    update: (payload) => {
      Object.keys(payload).forEach((prop) => {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-ignore
        app[prop as keyof RendererUpdatePayload] = payload[prop as keyof RendererUpdatePayload]
      })
    },

    dispose: () => {
      if (!app)
        return
      app.remove()
      app = undefined
    },
  }
}
