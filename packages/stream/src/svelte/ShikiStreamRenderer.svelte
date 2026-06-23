<script lang='ts'>
  import type { ThemedToken } from '@shikijs/core'
  import type { RecallToken } from '..'
  import { getTokenStyleObject, stringifyTokenStyle } from '@shikijs/core'

  interface ShikiStreamRendererProps {
    stream: ReadableStream<ThemedToken | RecallToken> | null
    onStreamStart?: () => void
    onStreamEnd?: () => void
    class?: string
  }

  const { stream, onStreamStart, onStreamEnd, class: className }: ShikiStreamRendererProps = $props()
  let tokens = $state.raw<ThemedToken[]>([])

  function getTokenStyle(token: ThemedToken) {
    return stringifyTokenStyle(token.htmlStyle || getTokenStyleObject(token))
  }

  $effect(() => {
    tokens = []
    if (!stream)
      return

    let started = false
    const abortController = new AbortController()
    const { signal } = abortController

    stream.pipeTo(new WritableStream({
      write(token) {
        if (signal.aborted)
          return

        if (!started) {
          started = true
          onStreamStart?.()
        }
        if ('recall' in token)
          tokens = tokens.slice(0, -token.recall)
        else
          tokens = [...tokens, token]
      },
      close: () => {
        if (!signal.aborted)
          onStreamEnd?.()
      },
      abort: () => {
        if (!signal.aborted)
          onStreamEnd?.()
      },
    }), { signal }).catch((error) => {
      if (error.name !== 'AbortError')
        console.error('Stream error:', error)
    })

    return () => abortController.abort()
  })
</script>

<pre class={['shiki shiki-stream', className]}><code>{#each tokens as token (token)}<span style={getTokenStyle(token)}>{token.content}</span>{/each}</code></pre>
