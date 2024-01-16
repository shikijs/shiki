import { expect, it } from 'vitest'
import { codeToHtml } from 'shikiji'
import { rendererClassic, transformerTwoslash } from '../src'

const styleTag = `
<link rel="stylesheet" href="../../../style-classic.css" />
<style>
html, body { margin: 0; }
.shiki { padding: 2em; }
</style>
`

const transformer = transformerTwoslash({
  renderer: rendererClassic(),
})

it('simple', async () => {
  const code = `
// Hello world
const a = "123"
const b = "345"
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'dark-plus',
    transformers: [
      transformer,
    ],
  })

  expect(styleTag + html).toMatchFileSnapshot('./out/classic/simple.html')
})

it('compiler_errors', async () => {
  const code = `
// @target: ES2015
// @errors: 7006

function fn(s) {
  console.log(s.subtr(3))
}

fn(42)
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-light',
    transformers: [
      transformer,
    ],
  })

  expect(styleTag + html).toMatchFileSnapshot('./out/classic/compiler_errors.html')
})

it('completions', async () => {
  const code = `
const a = Number.isNaN(123)
//                ^|
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-light',
    transformers: [
      transformer,
    ],
  })

  expect(styleTag + html).toMatchFileSnapshot('./out/classic/completions.html')
})

it('cuts_out_unnecessary_code', async () => {
  const code = `
interface IdLabel {
  id: number /* some fields */
}
interface NameLabel {
  name: string /* other fields */
}
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented"
}

let a = createLabel("typescript")
//  ^?

let b = createLabel(2.8)
    //  ^?

let c = createLabel(Math.random() ? "hello" : 42)
//                        ^|
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformer,
    ],
  })

  expect(styleTag + html).toMatchFileSnapshot('./out/classic/cuts_out_unnecessary_code.html')
})

it('console_log', async () => {
  const code = `
// Hello
console.error("This is an error")
// @error: This is an error
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformer,
    ],
  })

  expect(styleTag + html).toMatchFileSnapshot('./out/classic/console_log.html')
})
