import { expect, it } from 'vitest'
import { codeToHtml } from 'shiki'
import { addIncludes, replaceIncludesInCode } from '../src/includes'
import { rendererRich, transformerTwoslash } from '../src'

const styleTag = `
<link rel="stylesheet" href="../../../style-rich.css" />
<style>
.dark .shiki,
.dark .shiki span {
  color: var(--shiki-dark, inherit);
  background-color: var(--shiki-dark-bg, inherit);
  --twoslash-popup-bg: var(--shiki-dark-bg, inherit);
}

html:not(.dark) .shiki,
html:not(.dark) .shiki span {
  color: var(--shiki-light, inherit);
  background-color: var(--shiki-light-bg, inherit);
  --twoslash-popup-bg: var(--shiki-light-bg, inherit);
}
</style>
`

const multiExample = `
const a = 1
// - 1
const b = 2
// - 2
const c = 3
`

it('creates a set of examples', () => {
  const map = new Map()
  addIncludes(map, 'main', multiExample)
  expect(map.size === 3)

  expect(map.get('main')).toContain('const c')
  expect(map.get('main-1')).toContain('const a = 1')
  expect(map.get('main-2')).toContain('const b = 2')
})

it('replaces the code', () => {
  const map = new Map()
  addIncludes(map, 'main', multiExample)
  expect(map.size === 3)

  const sample = `// @include: main`
  const replaced = replaceIncludesInCode(map, sample)
  expect(replaced).toMatchInlineSnapshot(`
    "
    const a = 1
    const b = 2
    const c = 3
    "
  `)
})

it('throws an error if key not found', () => {
  const map = new Map()

  const sample = `// @include: main`
  expect(() => replaceIncludesInCode(map, sample)).toThrow()
})

it('does not throw an error if key not found but shouldThrow is false', () => {
  const map = new Map()

  const sample = `// @include: main`
  expect(() => replaceIncludesInCode(map, sample, false)).not.toThrow()
})

it('replaces @include directives with previously transformed code blocks', async () => {
  const main = `
export const hello = { str: "world" };
`.trim()

  /**
   * The @noErrors directive allows the code above the ^| to be invalid,
   * i.e. so it can demonstrate what a partial autocomplete looks like.
   */
  const code = `
// @include: main
// @noErrors

hello.
//    ^|
`.trim()

  /**
   * Replacing @include directives only renders nicely rendererRich?
   */
  const transformer = transformerTwoslash({
    renderer: rendererRich(),
  })

  const htmlMain = await codeToHtml(main, {
    lang: 'ts',
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
    defaultColor: false,
    transformers: [transformer],
    meta: {
      __raw: 'include main',
    },
  })

  expect(styleTag + htmlMain).toMatchFileSnapshot('./out/includes/main.html')

  const html = await codeToHtml(code, {
    lang: 'ts',
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
    transformers: [transformer],
  })

  expect(styleTag + html).toMatchFileSnapshot(
    './out/includes/replaced_directives.html',
  )
})
