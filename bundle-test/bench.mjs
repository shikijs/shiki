/* eslint-disable antfu/no-import-dist */
/* eslint-disable no-console */
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

async function run() {
  // Warn up
  for (let i = 0; i < 200; i++) {
    await highlightA(code)
    await highlightB(code)
  }

  let tA = 0
  let tB = 0

  const startA = performance.now()
  for (let i = 0; i < 1000; i++) {
    await highlightA(code)
  }
  tA += performance.now() - startA

  const startB = performance.now()
  for (let i = 0; i < 1000; i++) {
    await highlightB(code)
  }
  tB += performance.now() - startB

  console.log('A', tA)
  console.log('B', tB)
}

run()
