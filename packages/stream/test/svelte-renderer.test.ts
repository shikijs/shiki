// @vitest-environment happy-dom

import type { ThemedToken } from '@shikijs/core'
import { mount, tick, unmount } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { ShikiStreamRenderer } from '../src/svelte'

function createToken(content: string, color: string): ThemedToken {
  return { content, offset: 0, htmlStyle: { color } }
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
      controller!.enqueue(token)
      await flushRenderer()
    },
    close: async () => {
      controller!.close()
      await flushRenderer()
    },
    error: async (reason: unknown) => {
      controller!.error(reason)
      await flushRenderer()
    },
  }
}

// The renderer feeds the stream through `pipeTo`, so a token only reaches the DOM after the
// `write` microtask runs (Promise.resolve) and Svelte flushes its reactive update (tick).
async function flushRenderer() {
  await Promise.resolve()
  await Promise.resolve()
  await tick()
}

describe('svelte stream renderer', () => {
  it('keeps already-rendered token DOM stable while appending and recalling unstable tokens', async () => {
    const started = vi.fn()
    const ended = vi.fn()
    const target = document.createElement('div')
    const controlled = createControlledTokenStream()
    const app = mount(ShikiStreamRenderer, { target, props: { stream: controlled.stream, onStreamStart: started, onStreamEnd: ended, class: 'extra' } })

    await flushRenderer()
    expect(target.querySelector('pre')?.className).toBe('shiki shiki-stream extra')

    await controlled.enqueue(createToken('const ', '#111'))
    // The single-line template must not leak whitespace between <code> and the spans.
    expect(target.querySelector('code')?.textContent).toBe('const ')
    const firstSpan = target.querySelector('span')!
    const firstHtml = firstSpan.outerHTML

    // Appending an unstable token must not touch the already-rendered first span.
    await controlled.enqueue(createToken('answer', '#222'))
    expect(target.querySelector('code')?.textContent).toBe('const answer')
    const [firstAfterAppend, unstableSpan] = [...target.querySelectorAll('span')]
    expect(firstAfterAppend).toBe(firstSpan)
    expect(firstAfterAppend.outerHTML).toBe(firstHtml)
    expect(unstableSpan.textContent).toBe('answer')

    // A recall drops the unstable token while keeping the stable first span untouched.
    await controlled.enqueue({ recall: 1 })
    expect(target.querySelector('code')?.textContent).toBe('const ')
    expect(target.querySelectorAll('span')).toHaveLength(1)
    expect(target.querySelector('span')).toBe(firstSpan)

    // The replacement is a brand-new node, never the recalled one.
    await controlled.enqueue(createToken('count', '#333'))
    expect(target.querySelector('code')?.textContent).toBe('const count')
    const [firstAfterReplacement, replacementSpan] = [...target.querySelectorAll('span')]
    expect(firstAfterReplacement).toBe(firstSpan)
    expect(replacementSpan).not.toBe(unstableSpan)
    expect(replacementSpan.textContent).toBe('count')

    await controlled.close()
    expect(started).toHaveBeenCalledTimes(1)
    expect(ended).toHaveBeenCalledTimes(1)
    unmount(app)
  })

  it('does not report a stream end when unmounted mid-stream', async () => {
    const started = vi.fn()
    const ended = vi.fn()
    const target = document.createElement('div')
    const controlled = createControlledTokenStream()
    const app = mount(ShikiStreamRenderer, { target, props: { stream: controlled.stream, onStreamStart: started, onStreamEnd: ended, class: '' } })

    await flushRenderer()
    await controlled.enqueue(createToken('const ', '#111'))
    expect(started).toHaveBeenCalledTimes(1)

    // Unmount aborts the pipe; the abort callback must see signal.aborted and skip onStreamEnd.
    unmount(app)
    await flushRenderer()
    expect(ended).not.toHaveBeenCalled()
  })

  it('logs a source error instead of swallowing it', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ended = vi.fn()
    const target = document.createElement('div')
    const controlled = createControlledTokenStream()
    const app = mount(ShikiStreamRenderer, { target, props: { stream: controlled.stream, onStreamEnd: ended, class: '' } })

    await flushRenderer()
    await controlled.enqueue(createToken('const ', '#111'))
    await controlled.error(new Error('boom'))

    expect(errorSpy).toHaveBeenCalledWith('Stream error:', expect.objectContaining({ message: 'boom' }))
    expect(ended).toHaveBeenCalledTimes(1)
    errorSpy.mockRestore()
    unmount(app)
  })
})
