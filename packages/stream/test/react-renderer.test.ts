// @vitest-environment happy-dom

import type { ThemedToken } from '@shikijs/core'
import { act, createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeAll, describe, expect, it } from 'vitest'
import { ShikiStreamRenderer } from '../src/react'

beforeAll(() => {
  // React only enables `act` support when the environment opts in.
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
})

function createToken(content: string, color: string): ThemedToken {
  return { content, offset: 0, htmlStyle: { color } }
}

/**
 * A token that records how often the renderer read its style. Reading only happens
 * while an element for that token is being created, so the counter is a direct
 * measure of how much of the list React re-rendered on the latest chunk.
 */
function createProbeToken(content: string, color: string): ThemedToken & { reads: () => number } {
  let reads = 0
  return {
    content,
    offset: 0,
    get htmlStyle() {
      reads++
      return { color }
    },
    reads: () => reads,
  }
}

function createControlledTokenStream() {
  let controller: ReadableStreamDefaultController<ThemedToken | { recall: number }> | undefined
  const stream = new ReadableStream<ThemedToken | { recall: number }>({
    start(nextController) {
      controller = nextController
    },
  })
  return {
    stream,
    enqueue: async (token: ThemedToken | { recall: number }) => {
      await act(async () => {
        controller!.enqueue(token)
        // The renderer consumes the stream through `pipeTo`, so the token only lands
        // after the `write` microtask has run.
        await Promise.resolve()
        await Promise.resolve()
      })
    },
  }
}

async function mountRenderer(props: Parameters<typeof ShikiStreamRenderer>[0]) {
  const container = document.createElement('div')
  const root = createRoot(container)
  await act(async () => {
    root.render(h(ShikiStreamRenderer, props))
  })
  return { container, unmount: () => act(() => root.unmount()) }
}

describe('react stream renderer', () => {
  it('renders tokens as a flat list of spans', async () => {
    const controlled = createControlledTokenStream()
    const { container, unmount } = await mountRenderer({ stream: controlled.stream })

    expect(container.querySelector('pre')?.className).toBe('shiki shiki-stream')

    await controlled.enqueue(createToken('const ', '#111'))
    await controlled.enqueue(createToken('answer', '#222'))
    await controlled.enqueue(createToken('\n', '#333'))
    await controlled.enqueue(createToken('  = 42', '#444'))

    // Lines are grouped internally, but the rendered DOM stays one flat span list
    // directly under <code> — no per-line wrapper element.
    const code = container.querySelector('code')!
    expect([...code.children].every(el => el.tagName === 'SPAN')).toBe(true)
    expect(code.textContent).toBe('const answer\n  = 42')
    expect(code.querySelectorAll('span')).toHaveLength(4)

    await unmount()
  })

  it('does not re-render completed lines when later chunks arrive', async () => {
    const controlled = createControlledTokenStream()
    const { unmount } = await mountRenderer({ stream: controlled.stream })

    const first = createProbeToken('const ', '#111')
    await controlled.enqueue(first)
    await controlled.enqueue(createToken('\n', '#111'))

    // That line is finished; nothing after this point may touch it again.
    const readsWhenLineClosed = first.reads()

    for (let i = 0; i < 20; i++)
      await controlled.enqueue(createToken(`t${i}`, '#222'))

    expect(first.reads()).toBe(readsWhenLineClosed)

    await unmount()
  })

  it('drops recalled tokens and keeps completed lines intact', async () => {
    const controlled = createControlledTokenStream()
    const { container, unmount } = await mountRenderer({ stream: controlled.stream })

    const stable = createProbeToken('const ', '#111')
    await controlled.enqueue(stable)
    await controlled.enqueue(createToken('\n', '#111'))
    const readsWhenLineClosed = stable.reads()

    await controlled.enqueue(createToken('answr', '#222'))
    expect(container.querySelector('code')?.textContent).toBe('const \nanswr')

    await controlled.enqueue({ recall: 1 })
    expect(container.querySelector('code')?.textContent).toBe('const \n')

    await controlled.enqueue(createToken('answer', '#333'))
    expect(container.querySelector('code')?.textContent).toBe('const \nanswer')

    // A recall only affects the line being streamed.
    expect(stable.reads()).toBe(readsWhenLineClosed)

    await unmount()
  })
})
