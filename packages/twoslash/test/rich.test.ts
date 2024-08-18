import { expect, it } from 'vitest'
import { codeToHtml } from 'shiki'
import { rendererRich, transformerTwoslash } from '../src'

const styleTag = `
<link rel="stylesheet" href="../../../style-rich.css" />
<style>
html, body { margin: 0; }
.shiki { padding: 2em; }

.dark .shiki,
.dark .shiki span {
  color: var(--shiki-dark, inherit);
  --twoslash-popup-bg: var(--shiki-dark-bg, inherit);
}

.dark .shiki {
  background-color: var(--shiki-dark-bg, inherit);
}

html:not(.dark) .shiki,
html:not(.dark) .shiki span {
  color: var(--shiki-light, inherit);
  --twoslash-popup-bg: var(--shiki-light-bg, inherit);
}

html:not(.dark) .shiki {
  background-color: var(--shiki-light-bg, inherit);
}
</style>
`

const colorToggle = `
<script>
function toggleColor() {
  const html = document.querySelector('html')
  html.classList.toggle('dark')
}
</script>
<div style="margin: 5em 2em">
<button onclick="toggleColor()">Toggle color</button>
</div>
`

it('rich', async () => {
  const code = `
// @errors: 2540
interface Todo {
  /** The title of the todo item */
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users".toUpperCase(),
//  ^?
};

todo.title = "Hello";

Number.parseInt(todo.title, 10);
//      ^|
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
    defaultColor: false,
    meta: {
      title: 'test',
    },
    transformers: [
      transformerTwoslash({
        renderer: rendererRich(),
      }),
    ],
  })

  expect(styleTag + html + colorToggle).toMatchFileSnapshot('./out/rich/rich.html')

  const htmlNoTheme = await codeToHtml(code, {
    lang: 'ts',
    theme: 'none',
    transformers: [
      transformerTwoslash({
        renderer: rendererRich(),
      }),
    ],
  })

  expect(styleTag + htmlNoTheme).toMatchFileSnapshot('./out/rich/rich-none-theme.html')
})

it('error rendering hover', async () => {
  const code = `
// @errors: 2540
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users".toUpperCase(),
};

todo.title = "Hello";
`.trim()

  const htmlErrorsHover = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-light',
    transformers: [
      transformerTwoslash({
        renderer: rendererRich({
          errorRendering: 'hover',
        }),
      }),
    ],
  })

  expect(styleTag + htmlErrorsHover).toMatchFileSnapshot('./out/rich/rich-error-hover.html')
})

it('no-icons', async () => {
  const code = `
const obj = {
  boo: 1,
  bar: () => 2,
  baz: 'string'
}
obj.boo
//   ^|
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'nord',
    defaultColor: false,
    transformers: [
      transformerTwoslash({
        renderer: rendererRich({
          completionIcons: false,
        }),
      }),
    ],
  })

  expect(
    /* eslint-disable prefer-template */
    styleTag
    + html
    + '<style>:root {--twoslash-popup-bg: #2e3440;}</style>'
    + colorToggle,
  ).toMatchFileSnapshot('./out/rich/no-icons.html')
})

it('custom-tags', async () => {
  const code = `
import { createHighlighterCore } from 'shiki/core'

const shiki = await createHighlighterCore({})
// @log: Custom log message
const a = 1
// @error: Custom error message
const b = 1
// @warn: Custom warning message
const c = 1
// @annotate: Custom annotation message
`.trim()

  const html = await codeToHtml(code, {
    lang: 'ts',
    themes: {
      light: 'min-light',
      dark: 'min-dark',
    },
    defaultColor: false,
    transformers: [
      transformerTwoslash({
        renderer: rendererRich(),
      }),
    ],
  })

  expect(
    styleTag
    + html
    + colorToggle,
  ).toMatchFileSnapshot('./out/rich/custom-tags.html')
})

it('line-query', async () => {
  const code = `
// @errors: 2540
interface Todo {
  /** The title of the todo item */
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users".toUpperCase(),
//  ^?
};

todo.title = "Hello";

Number.parseInt(todo.title, 10);
//      ^|
`.trim()

  const htmlWithSeparateLine = await codeToHtml(code, {
    lang: 'ts',
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
    defaultColor: false,
    transformers: [
      transformerTwoslash({
        renderer: rendererRich({
          queryRendering: 'line',
        }),
      }),
    ],
  })

  expect(styleTag + htmlWithSeparateLine + colorToggle).toMatchFileSnapshot('./out/rich/line-query.html')
})
