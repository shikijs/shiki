import type { RendererFactory, RendererFactoryResult } from './types'
import { mount, unmount } from 'svelte'
import { ShikiStreamRenderer } from '../../../src/svelte'

export const createRendererSvelte: RendererFactory = (options): RendererFactoryResult => {
  let app: any
  let target: HTMLElement | undefined

  function render(payload: Parameters<RendererFactoryResult['mount']>[1]) {
    if (!target)
      return
    if (app)
      unmount(app)
    app = mount(ShikiStreamRenderer, { target, props: { ...payload, onStreamStart: options.onStart, onStreamEnd: options.onEnd, class: '' } })
  }

  return {
    mount: (element, payload) => {
      target = element
      render(payload)
    },
    update: (payload) => {
      render(payload)
    },
    dispose: () => {
      if (app)
        unmount(app)
      app = undefined
      target = undefined
    },
  }
}
