import type { KeyedTokensInfo } from '../src/types'
import { createHighlighter } from 'shiki/bundle/web'
import { expect, it } from 'vitest'
import { codeToKeyedTokens, syncTokenKeys } from '../src/core'

it('diff1', async () => {
  const code1 = `const a = 1`
  const code2 = `const a = ref(1 + 1)`
  const code3 = `const b = ref(2)`

  const theme = 'vitesse-light'
  const lang = 'js'
  const highlighter = await createHighlighter({
    themes: [theme],
    langs: [lang],
  })

  let tokens1 = codeToKeyedTokens(highlighter, code1, { lang, theme })
  let tokens2 = codeToKeyedTokens(highlighter, code2, { lang, theme })
  let tokens3 = codeToKeyedTokens(highlighter, code3, { lang, theme })

  const hashes = [tokens1.hash, tokens2.hash, tokens3.hash]

  expect.soft(hashes).toMatchInlineSnapshot(`
    [
      "ZoOoAmFcnMrXB88ovZ24EUOajikSTYMhYb7O7k1dIqc",
      "bu5Lf92T8H0PtR79knPh7GRpYga2qb2tfCtzadFkYC0",
      "JPuZBn162X47pAQY0s_2qeDdn1drzfanZwMxBs0Ha-k",
    ]
  `)

  normalizeKeys(tokens1, '1')
  normalizeKeys(tokens2, '2')
  normalizeKeys(tokens3, '3')

  const originKeys1 = tokens1.tokens.map(t => t.key)
  const originKeys2 = tokens2.tokens.map(t => t.key)
  const originKeys3 = tokens3.tokens.map(t => t.key)

  ;({ from: tokens1, to: tokens2 } = syncTokenKeys(tokens1, tokens2))
  ;({ from: tokens2, to: tokens3 } = syncTokenKeys(tokens2, tokens3))

  const syncedKeys1 = tokens1.tokens.map(t => t.key)
  const syncedKeys2 = tokens2.tokens.map(t => t.key)
  const syncedKeys3 = tokens3.tokens.map(t => t.key)

  expect(syncedKeys1).toEqual(originKeys1)
  expect(syncedKeys2).not.toEqual(originKeys2)
  expect(syncedKeys3).not.toEqual(originKeys3)

  expect(printDiff(tokens2, originKeys2)).toMatchInlineSnapshot(`
    "
    1-0                  const
    1-1                   
    1-2                  a
    1-3                   
    1-4                  =
    1-5                   
            2-6          ref
            2-7          (
    1-6                  1
            2-9           
            2-10         +
            2-11          
            2-12         1
            2-13         )
            2-14         ⏎
    "
  `)

  expect(printDiff(tokens3, originKeys3)).toMatchInlineSnapshot(`
    "
    1-0                  const
    1-1                   
            3-2          b
    1-3                   
    1-4                  =
    1-5                   
    2-6                  ref
    2-7                  (
            3-8          2
    2-13                 )
            3-10         ⏎
    "
  `)
})

it('diff2', async () => {
  const code1 = `
<template>
  <p class="">{{ greeting }}</p>
</template>
`.trim()
  const code2 = `
<template>
  <p class="a">{{ greeting }}</p>
</template>
`.trim()
  const code3 = code1

  const theme = 'vitesse-light'
  const lang = 'vue'
  const highlighter = await createHighlighter({
    themes: [theme],
    langs: [lang],
  })

  let tokens1 = codeToKeyedTokens(highlighter, code1, { lang, theme })
  let tokens2 = codeToKeyedTokens(highlighter, code2, { lang, theme })
  let tokens3 = codeToKeyedTokens(highlighter, code3, { lang, theme })

  normalizeKeys(tokens1, '1')
  normalizeKeys(tokens2, '2')
  normalizeKeys(tokens3, '3')

  //   const originKeys1 = tokens1.tokens.map(t => t.key)
  const originKeys2 = tokens2.tokens.map(t => t.key)
  const originKeys3 = tokens3.tokens.map(t => t.key)

  ;({ from: tokens1, to: tokens2 } = syncTokenKeys(tokens1, tokens2))
  ;({ from: tokens3, to: tokens3 } = syncTokenKeys(tokens2, tokens3))

  //   const syncedKeys1 = tokens1.tokens.map(t => t.key)
  const syncedKeys2 = tokens2.tokens.map(t => t.key)
  const syncedKeys3 = tokens3.tokens.map(t => t.key)

  //   expect(syncedKeys1).toEqual(originKeys1)
  expect(syncedKeys2).not.toEqual(originKeys2)
  expect(syncedKeys3).not.toEqual(originKeys3)

  expect(printDiff(tokens2, originKeys2)).toMatchInlineSnapshot(`
    "
    1-0                  <
    1-1                  template
    1-2                  >
    1-3                  ⏎
    1-4                    
    1-5                  <
    1-6                  p
    1-7                   
    1-8                  class
    1-9                  =
            2-10         "
            2-11         a
            2-12         "
    1-11                 >
    1-12                 {{ greeting }}
    1-13                 </
    1-14                 p
    1-15                 >
    1-16                 ⏎
    1-17                 </
    1-18                 template
    1-19                 >
            2-22         ⏎
    "
  `)

  expect(printDiff(tokens3, originKeys3)).toMatchInlineSnapshot(`
    "
    1-0                  <
    1-1                  template
    1-2                  >
    1-3                  ⏎
    1-4                    
    1-5                  <
    1-6                  p
    1-7                   
    1-8                  class
    1-9                  =
            3-10         ""
    1-11                 >
    1-12                 {{ greeting }}
    1-13                 </
    1-14                 p
    1-15                 >
    1-16                 ⏎
    1-17                 </
    1-18                 template
    1-19                 >
            3-20         ⏎
    "
  `)
})

it('diff3 enhanceMatching', async () => {
  const code1 = `
  <script>
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    data: () => ({
      count: 1
    }),
    computed: {
      double() {
        return this.count * 2
      }
    },
  })
  </script>
  `.trim()

  const code2 = `
  <script setup>
  import { ref, computed } from 'vue'
  
  const count = ref(1)
  const double = computed(() => count.value * 2)
  </script>
  `.trim()

  const theme = 'vitesse-light'
  const lang = 'vue'
  const highlighter = await createHighlighter({
    themes: [theme],
    langs: [lang],
  })

  const tokens1 = codeToKeyedTokens(highlighter, code1, { lang, theme })
  const tokens2 = codeToKeyedTokens(highlighter, code2, { lang, theme })

  normalizeKeys(tokens1, '1')
  normalizeKeys(tokens2, '2')

  //   const originKeys1 = tokens1.tokens.map(t => t.key)
  const originKeys2 = tokens2.tokens.map(t => t.key)

  function clone<T>(tokens: T): T {
    return JSON.parse(JSON.stringify(tokens))
  }

  const tokens2WithoutEnhance = syncTokenKeys(tokens1, clone(tokens2), {
    enhanceMatching: false,
  }).to

  const tokens2WithEnhance = syncTokenKeys(tokens1, clone(tokens2), {
    enhanceMatching: true,
  }).to

  expect(printDiff(tokens2WithoutEnhance, originKeys2))
    .not
    .toEqual(printDiff(tokens2WithEnhance, originKeys2))

  expect(printDiff(tokens2WithEnhance, originKeys2)).toMatchInlineSnapshot(`
    "
    1-0                  <
    1-1                  script
            2-2           
            2-3          setup
    1-2                  >
    1-3                  ⏎
    1-4                    
    1-5                  import
    1-6                   
    1-7                  {
    1-8                   
            2-11         ref
            2-12         ,
            2-13          
            2-14         computed
    1-10                  
    1-11                 }
    1-12                  
    1-13                 from
    1-14                  
    1-15                 '
    1-16                 vue
    1-17                 '
    1-18                 ⏎
    1-19                   
    1-20                 ⏎
    1-21                   
            2-27         const
    1-25                  
    1-40                 count
            2-30          
            2-31         =
            2-32          
            2-33         ref
            2-34         (
            2-35         1
            2-36         )
    1-38                 ⏎
            2-38           
            2-39         const
    1-42                  
    1-55                 double
            2-42          
            2-43         =
            2-44          
    1-49                 computed
            2-46         (()
    1-57                  
            2-48         =>
            2-49          
    1-65                 count
    1-64                 .
            2-52         value
    1-66                  
    1-67                 *
    1-68                  
    1-69                 2
            2-57         )
    1-79                 ⏎
    1-80                   
    1-81                 </
    1-82                 script
    1-83                 >
            2-63         ⏎
    "
  `)
})

function printDiff(info: KeyedTokensInfo, keys: string[]) {
  const text = info.tokens
    .map((t, i) => {
      if (t.key === keys[i])
        return `${`        ${t.key}`.padEnd(20, ' ')} ${t.content.replace(/\n/g, '⏎')}`
      return `${`${t.key}`.padEnd(20, ' ')} ${t.content.replace(/\n/g, '⏎')}`
    })
    .join('\n')
  return `\n${text}\n`
}

function normalizeKeys(info: KeyedTokensInfo, name: string) {
  info.tokens.forEach((t) => {
    t.key = t.key.replace(info.hash, name)
  })
}
