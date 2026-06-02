import type { RendererFactory, RendererFactoryResult } from './types'
import { mount, unmount } from 'svelte'
import { ShikiMagicMove } from '../../../src/svelte'

export const createRendererSvelte: RendererFactory = (options): RendererFactoryResult => {
  let app: any

  const props = $state({
    onStart: options.onStart,
    onEnd: options.onEnd,
  })

  return {
    mount: (element, payload) => {
      Object.assign(props, payload)
      if (app)
        return
      app = mount(ShikiMagicMove, { target: element, props })
      // eslint-disable-next-line no-console
      console.log('Svelte renderer mounted')
    },

    update: (payload) => {
      Object.assign(props, payload)
    },

    dispose: () => {
      if (app)
        unmount(app)
      app = undefined
    },
  }
}
