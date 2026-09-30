/* eslint-disable ts/ban-ts-comment */
/* eslint-disable antfu/no-import-dist */

import { it } from 'vitest'
// @ts-ignore - ignore type error
import { highlight as highlightA } from './dist/index-lite.min.mjs'
// @ts-ignore - ignore type error
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

it('bundle', async ({ bench }) => {
  // eslint-disable-next-line test/consistent-test-it -- compare lives on the bench fixture in Vitest 5
  await bench.compare(
    bench('js-precompiled', async () => {
      await highlightA(code)
    }),
    bench('wasm', async () => {
      await highlightB(code)
    }),
  )
})
