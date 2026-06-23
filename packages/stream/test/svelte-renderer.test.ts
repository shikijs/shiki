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
  }
}

async function flushRenderer() {
  await Promise.resolve()
  await Promise.resolve()
  await tick()
  await Promise.resolve()
}

describe('svelte stream renderer', () => {
  it('keeps already-rendered token DOM stable while appending and recalling unstable tokens', async () => {
    const first = createToken('const ', '#111')
    const unstable = createToken('answer', '#222')
    const replacement = createToken('count', '#333')
    const suffix = createToken(' = 1', '#444')
    const started = vi.fn()
    const ended = vi.fn()
    const target = document.createElement('div')
    const controlled = createControlledTokenStream()
    const app = mount(ShikiStreamRenderer, { target, props: { stream: controlled.stream, onStreamStart: started, onStreamEnd: ended, class: 'extra' } })

    await flushRenderer()
    expect(target.querySelector('pre')?.className).toBe('shiki shiki-stream extra')

    await controlled.enqueue(first)
    const firstSpan = target.querySelector('span')!
    const firstHtml = firstSpan.outerHTML
    expect(firstSpan.textContent).toBe('const ')

    await controlled.enqueue(unstable)
    const [firstAfterAppend, unstableSpan] = [...target.querySelectorAll('span')]
    expect(firstAfterAppend).toBe(firstSpan)
    expect(firstAfterAppend.outerHTML).toBe(firstHtml)
    expect(unstableSpan.textContent).toBe('answer')

    await controlled.enqueue({ recall: 1 })
    const [firstAfterRecall] = [...target.querySelectorAll('span')]
    expect(firstAfterRecall).toBe(firstSpan)
    expect(firstAfterRecall.outerHTML).toBe(firstHtml)
    expect(target.querySelectorAll('span')).toHaveLength(1)

    await controlled.enqueue(replacement)
    const [firstAfterReplacement, replacementSpan] = [...target.querySelectorAll('span')]
    const replacementHtml = replacementSpan.outerHTML
    expect(firstAfterReplacement).toBe(firstSpan)
    expect(firstAfterReplacement.outerHTML).toBe(firstHtml)
    expect(replacementSpan).not.toBe(unstableSpan)
    expect(replacementSpan.textContent).toBe('count')

    await controlled.enqueue(suffix)
    const [firstAfterSuffix, replacementAfterSuffix, suffixSpan] = [...target.querySelectorAll('span')]
    expect(firstAfterSuffix).toBe(firstSpan)
    expect(firstAfterSuffix.outerHTML).toBe(firstHtml)
    expect(replacementAfterSuffix).toBe(replacementSpan)
    expect(replacementAfterSuffix.outerHTML).toBe(replacementHtml)
    expect(suffixSpan.textContent).toBe(' = 1')

    await controlled.close()
    expect(started).toHaveBeenCalledTimes(1)
    expect(ended).toHaveBeenCalledTimes(1)
    unmount(app)
  })
})
