import type { ThemedToken } from '@shikijs/core'
import type { JSX } from 'react'
import type { RecallToken } from '..'
import { objectId } from '@antfu/utils'
import { getTokenStyleObject } from '@shikijs/core'
import { createElement as h, useEffect, useState } from 'react'
import { useEffectEvent } from './utils'

export function ShikiStreamRenderer(
  {
    stream,
    onStreamStart,
    onStreamEnd,
  }: {
    stream: ReadableStream<ThemedToken | RecallToken>
    onStreamStart?: () => void
    onStreamEnd?: () => void
  },
): JSX.Element {
  const [tokens, setTokens] = useState<ThemedToken[]>([])

  const _onStreamStart = useEffectEvent(() => onStreamStart?.())
  const _onStreamEnd = useEffectEvent(() => onStreamEnd?.())

  useEffect(() => {
    setTokens(prevTokens => prevTokens.length ? [] : prevTokens)
    let started = false
    stream.pipeTo(new WritableStream({
      write(token) {
        if (!started) {
          started = true
          _onStreamStart()
        }
        if ('recall' in token)
          setTokens(tokens => tokens.slice(0, -token.recall))
        else
          setTokens(tokens => [...tokens, token])
      },
      close: () => _onStreamEnd(),
    }))
  }, [_onStreamEnd, _onStreamStart, stream])

  return h(
    'pre',
    { className: 'shiki shiki-stream' },
    h(
      'code',
      {},
      tokens.map(token => h('span', { key: objectId(token), style: token.htmlStyle || getTokenStyleObject(token) }, token.content)),
    ),
  )
}
