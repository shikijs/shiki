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
