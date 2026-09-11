import type { ThemedToken } from '@shikijs/core'
import type { JSX } from 'react'
import type { RecallToken } from '..'
import { objectId } from '@antfu/utils'
import { getTokenStyleObject } from '@shikijs/core'
import { Fragment, createElement as h, memo, useEffect, useState } from 'react'
import { useEffectEvent } from './utils'

interface Grouped {
  /** Lines that already ended with a newline token; each array keeps its identity so `Line` can bail out. */
  lines: ThemedToken[][]
  /** Tokens of the line still being appended to. */
  tail: ThemedToken[]
}

const EMPTY: Grouped = { lines: [], tail: [] }

/**
 * One finished line. Its `tokens` array is replaced only when that line changes,
 * so every line above the one currently streaming bails out of reconciliation.
 */
const Line = memo(
  ({ tokens }: { tokens: ThemedToken[] }): JSX.Element => h(Fragment, {}, tokens.map(token => h('span', { key: objectId(token), style: token.htmlStyle || getTokenStyleObject(token) }, token.content))),
)

function append(state: Grouped, token: ThemedToken): Grouped {
  const tail = [...state.tail, token]
  // Tokens carrying a newline close the current line; the tokenizer emits `\n` as its own token.
  return token.content.includes('\n')
    ? { lines: [...state.lines, tail], tail: [] }
    : { lines: state.lines, tail }
}

function recall(state: Grouped, count: number): Grouped {
  // A recall only ever revokes the unstable tokens of the line being streamed.
  return { lines: state.lines, tail: state.tail.slice(0, state.tail.length - count) }
}

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
  const [state, setState] = useState<Grouped>(EMPTY)

  const _onStreamStart = useEffectEvent(() => onStreamStart?.())
  const _onStreamEnd = useEffectEvent(() => onStreamEnd?.())

  useEffect(() => {
    setState(prev => (prev.lines.length || prev.tail.length) ? EMPTY : prev)
    let started = false
    stream.pipeTo(new WritableStream({
      write(token) {
        if (!started) {
          started = true
          _onStreamStart()
        }
        if ('recall' in token)
          setState(prev => recall(prev, token.recall))
        else
          setState(prev => append(prev, token))
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
      state.lines.map((tokens, i) => h(Line, { key: i, tokens })),
      h(Line, { key: 'tail', tokens: state.tail }),
    ),
  )
}
