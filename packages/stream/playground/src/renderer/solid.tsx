/* eslint-disable no-console */

/* @jsxImportSource solid-js */
import type { ThemedToken } from '@shikijs/core'
import type { JSX } from 'solid-js'
import type { RecallToken } from '../../../src'
import type { RendererFactoryOptions, RendererFactoryResult } from './types'
import { createEffect, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { render } from 'solid-js/web'
import { ShikiStreamRenderer } from '../../../src/solid'

let lastRendererCleanup: (() => void) | undefined

export function createRendererSolid(options: RendererFactoryOptions): RendererFactoryResult {
  const [props, setProps] = createStore({
    onStreamStart: options.onStart,
    onStreamEnd: options.onEnd,
    class: '',
  })

  let dispose: ReturnType<typeof render> | undefined
  const cleanup = (): void => {
    dispose?.()
    dispose = undefined
    if (lastRendererCleanup === cleanup)
      lastRendererCleanup = undefined
  }

  function App({ stream }: { stream: ReadableStream<ThemedToken | RecallToken> }): JSX.Element {
    const [count, setCount] = createSignal(0)

    createEffect(() => {
      const timerId = setInterval(() => setCount(count => count + 1), 1_000)
      return () => clearInterval(timerId)
    })

    return (
      <ShikiStreamRenderer
        stream={stream}
        onStreamStart={() => {
          console.log('onStreamStart', count())
          props.onStreamStart?.()
        }}
        onStreamEnd={() => {
          console.log('onStreamEnd', count())
          props.onStreamEnd?.()
        }}
        class={props.class}
      />
    )
  }

  return {
    mount: (element, payload) => {
      lastRendererCleanup?.()
      dispose = render(() => <App stream={payload.stream} />, element)
      lastRendererCleanup = cleanup
      console.log('Solid renderer mounted')
    },
    update: (payload) => {
      setProps(payload as any)
    },
    dispose: () => {
      cleanup()
    },
  }
}
