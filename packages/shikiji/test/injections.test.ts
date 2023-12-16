import { codeToHtml } from 'shikiji'
import { expect, it } from 'vitest'

// Basically we need to make sure that the syntax inside `v-if` and `{{}}` is highlighted correctly.
// This is done by a `vue-injections` patch that injects extra grammar into HTML.
it('vue-injections', async () => {
  const code = `
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div>
    <h1 v-if="count == 1 ? true : 'str'.toUpperCase()">{{ count * 2 }}</h1>
  </div>
</template>
`

  expect(`${await codeToHtml(code, { lang: 'vue', theme: 'vitesse-dark' })}<style>html{color-scheme:dark}</style>`)
    .toMatchFileSnapshot('./out/vue-injections.html')
})
