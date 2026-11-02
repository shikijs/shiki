import type { ThemedToken } from 'shiki'
import type { ShikiStreamTokenizerOptions } from '../src'
import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'
import { ShikiStreamTokenizer } from '../src'
import { tokensToHtml } from './utils'

const fixture = `
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>

<style>
button {
  color: red;
}
</style>
`

it('exported', async () => {
  const highlighter = await createHighlighter({
    langs: ['vue'],
    themes: ['vitesse-dark', 'vitesse-light'],
  })
  const options: ShikiStreamTokenizerOptions = {
    highlighter,
    lang: 'vue',
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
  }
  const streamer = new ShikiStreamTokenizer(
    options,
  )

  const cuts = [14, 30, 58, undefined]
  const slices = cuts.map((cut, i) => fixture.slice(cuts[i - 1] || 0, cut))

  let index = 0
  for (const slice of slices) {
    const { stable, unstable } = await streamer.enqueue(slice)
    await expect.soft(tokensToHtml([...stable, ...unstable]))
      .toMatchFileSnapshot(`output/slice-${index++}.html`)
  }
  streamer.close()

  const onepassTokens = highlighter.codeToTokens(fixture, options as any)
    .tokens
    .flatMap((i, idx) => idx === 0 ? i : [{ content: '\n', offset: 0 }, ...i])
  const onepass = tokensToHtml(onepassTokens)

  const merged = tokensToHtml(streamer.tokensStable)
  await expect.soft(merged)
    .toMatchFileSnapshot(`output/merged.html`)

  await expect.soft(onepass)
    .toMatchFileSnapshot(`output/onepass.html`)

  expect.soft(merged).toBe(onepass)
})

const tokensOptions = {
  lang: 'vue',
  themes: {
    dark: 'vitesse-dark',
    light: 'vitesse-light',
  },
} as const

async function tokenizeInChunks(options: ShikiStreamTokenizerOptions, code: string, size: number): Promise<ThemedToken[]> {
  const streamer = new ShikiStreamTokenizer(options)
  for (let i = 0; i < code.length; i += size)
    await streamer.enqueue(code.slice(i, i + size))
  return [...streamer.tokensStable, ...streamer.close().stable]
}

// The streamed tokens, apart from the inserted `\n` ones, match the one-pass tokens,
// every token's offset points at its content in the code, and each inserted `\n` sits at its own LF
function expectSameTokens(options: ShikiStreamTokenizerOptions, code: string, tokens: ThemedToken[]): void {
  expect(tokens.filter(token => token.content !== '\n')).toEqual(options.highlighter.codeToTokens(code, options).tokens.flat())
  for (const token of tokens)
    expect(code.slice(token.offset, token.offset + token.content.length)).toBe(token.content)
  expect(tokens.filter(token => token.content === '\n').map(token => token.offset))
    .toEqual([...code.matchAll(/\n/g)].map(match => match.index))
}

it('handles CRLF line endings like codeToTokens', async () => {
  const highlighter = await createHighlighter({
    langs: ['vue'],
    themes: ['vitesse-dark', 'vitesse-light'],
  })
  const code = fixture.trimEnd().replaceAll('\n', '\r\n')
  const onepass = tokensToHtml(
    highlighter.codeToTokens(code, tokensOptions)
      .tokens
      .flatMap((i, idx) => idx === 0 ? i : [{ content: '\n', offset: 0 }, ...i]),
  )

  // A chunk size of 1 splits every `\r\n` across two chunks
  for (const size of [1, 5, code.length]) {
    const tokens = await tokenizeInChunks({ highlighter, ...tokensOptions }, code, size)
    expect(tokens.filter(token => token.content.includes('\r'))).toEqual([])
    expect(tokensToHtml(tokens)).toBe(onepass)
  }
})

it('reports token offsets relative to the whole code', async () => {
  const highlighter = await createHighlighter({
    langs: ['vue'],
    themes: ['vitesse-dark', 'vitesse-light'],
  })

  const options: ShikiStreamTokenizerOptions = { highlighter, ...tokensOptions }

  for (const code of [fixture.trimEnd(), fixture.trimEnd().replaceAll('\n', '\r\n')]) {
    for (const size of [1, 5, code.length])
      expectSameTokens(options, code, await tokenizeInChunks(options, code, size))
  }
})

it('reports whole-code offsets after every chunk', async () => {
  const highlighter = await createHighlighter({
    langs: ['ts'],
    themes: ['vitesse-light'],
  })
  const options: ShikiStreamTokenizerOptions = { highlighter, lang: 'ts', theme: 'vitesse-light' }
  const streamer = new ShikiStreamTokenizer(options)

  // `\r`, an empty chunk, `\n` and the two halves of the emoji arrive separately
  const chunks = ['const a = 1', '\r', '', '\n', 'const b = \'\uD83D', '\uDE00\'\r\n', 'b']
  let code = ''
  const received: ThemedToken[] = []
  for (const chunk of chunks) {
    code += chunk
    const { stable, unstable } = await streamer.enqueue(chunk)
    received.push(...stable)
    expectSameTokens(options, code, [...received, ...unstable])
  }
  expectSameTokens(options, code, [...received, ...streamer.close().stable])
})

it('continues offsets in a clone', async () => {
  const highlighter = await createHighlighter({
    langs: ['ts'],
    themes: ['vitesse-light'],
  })
  const options: ShikiStreamTokenizerOptions = { highlighter, lang: 'ts', theme: 'vitesse-light' }
  const streamer = new ShikiStreamTokenizer(options)
  await streamer.enqueue('const a = 1\r\nconst b')

  const clone = streamer.clone()
  await clone.enqueue(' = 2\nc')
  expectSameTokens(options, 'const a = 1\r\nconst b = 2\nc', [...clone.tokensStable, ...clone.close().stable])
})

it('restarts offsets after clear() and close()', async () => {
  const highlighter = await createHighlighter({
    langs: ['ts'],
    themes: ['vitesse-light'],
  })
  const options: ShikiStreamTokenizerOptions = { highlighter, lang: 'ts', theme: 'vitesse-light' }

  for (const reset of ['clear', 'close'] as const) {
    const streamer = new ShikiStreamTokenizer(options)
    await streamer.enqueue('const a = 1\nconst b')
    streamer[reset]()
    const { stable, unstable } = await streamer.enqueue('let c\nd')
    expectSameTokens(options, 'let c\nd', [...stable, ...unstable])
  }
})
