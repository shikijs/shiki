/* @jsxImportSource solid-js */

import type { ThemedToken } from '@shikijs/core'
import type { JSX } from 'solid-js'
import type { RecallToken } from '..'
import { getTokenStyleObject } from '@shikijs/core'
import { createEffect, createSignal, For, on, onCleanup } from 'solid-js'

export function ShikiStreamRenderer(props: {
  stream: ReadableStream<ThemedToken | RecallToken> | null
  onStreamStart?: () => void
  onStreamEnd?: () => void
  class?: string
}): JSX.Element {
  const [tokens, setTokens] = createSignal<ThemedToken[]>([])

  createEffect(on(
    () => props.stream,
    (stream) => {
      if (!stream) {
        setTokens(() => [])
        return
      }

      let started = false
      const abortController = new AbortController()
      const { signal } = abortController

      setTokens(() => [])

      const controller = stream.pipeTo(
        new WritableStream({
          write(token) {
            if (signal.aborted)
              return

            if (!started) {
              started = true
              props.onStreamStart?.()
            }
            if ('recall' in token)
              setTokens(ts => ts.slice(0, -token.recall))
            else
              setTokens(ts => [...ts, token])
          },
          close: () => {
            if (!signal.aborted)
              props.onStreamEnd?.()
          },
          abort: () => {
            if (!signal.aborted)
              props.onStreamEnd?.()
          },
        }),
        { signal },
      )
      onCleanup(() => {
        abortController.abort()
        controller.catch(() => {})
      })
    },
  ))

  return (
    <pre class={`shiki shiki-stream${props.class ? ` ${props.class}` : ''}`}>
      <code>
        <For each={tokens()}>
          {token => (
            <span style={token.htmlStyle ?? getTokenStyleObject(token)}>
              {token.content}
            </span>
          )}
        </For>
      </code>
    </pre>
  )
}
