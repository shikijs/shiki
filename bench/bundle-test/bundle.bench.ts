/* eslint-disable antfu/no-import-dist */

import { bench, describe } from 'vitest'
import { highlight as highlightA } from './dist/index-lite.min.mjs'
import { highlight as highlightB } from './dist/index-wasm.min.mjs'

const code = `
import { ref } from 'vue'

const message = ref('Hello World!')

function reverseMessage() {
  // Access/mutate the value of a ref via
  // its .value property.
  message.value = message.value.split('').reverse().join('')
}

function notify() {
  alert('navigation was prevented.')
}
`

describe('bundle', () => {
  bench('js-precompiled', async () => {
    await highlightA(code)
  })

  bench('wasm', async () => {
    await highlightB(code)
  })
})
