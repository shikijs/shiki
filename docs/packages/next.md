# Next.js

Shiki does not provide an official integration for [Next.js](https://nextjs.org), but it is rather straightforward to use Shiki in Next.js applications.

::: info
Using Shiki on Edge Runtime might cause unintended problems, Shiki relies on lazy imports to load languages and themes.

Serverless Runtime is recommended.
:::

## React Server Component

Since Server Components are server-only, you can use the bundled highlighter without worrying the bundle size.

```tsx
import type { BundledLanguage } from 'shiki'
import { codeToHtml } from 'shiki'

export default function Page() {
  return (
    <main>
      <CodeBlock lang="ts">
        {[
          'console.log("Hello")',
          'console.log("World")',
        ].join('\n')}
      </CodeBlock>
    </main>
  )
}

interface Props {
  children: string
  lang: BundledLanguage
}

async function CodeBlock(props: Props) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: 'github-dark'
  })

  return <div dangerouslySetInnerHTML={{ __html: out }} />
}
```

### Custom Components

You can also call `codeToHast` to get the HTML abstract syntax tree, and render it using [`hast-util-to-jsx-runtime`](https://github.com/syntax-tree/hast-util-to-jsx-runtime). With this method, you can render your own `pre` and `code` components.

```tsx
import type { JSX } from 'react'
import type { BundledLanguage } from 'shiki'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { codeToHast } from 'shiki'

export default function Page() {
  return (
    <main>
      <CodeBlock lang="ts">
        {[
          'console.log("Hello")',
          'console.log("World")',
        ].join('\n')}
      </CodeBlock>
    </main>
  )
}

interface Props {
  children: string
  lang: BundledLanguage
}

async function CodeBlock(props: Props) {
  const out = await codeToHast(props.children, {
    lang: props.lang,
    theme: 'github-dark'
  })

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
    components: {
      // your custom `pre` element
      pre: props => <pre data-custom-codeblock {...props} />
    },
  }) as JSX.Element
}
```

## React Client Component

For client components, they are pre-rendered on server and hydrated/rendered on client.
We can start by creating a client `CodeBlock` component.

Create a `shared.ts` for highlighter:

```ts
import type { JSX } from 'react'
import type { BundledLanguage } from 'shiki/bundle/web'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { codeToHast } from 'shiki/bundle/web'

export async function highlight(code: string, lang: BundledLanguage) {
  const out = await codeToHast(code, {
    lang,
    theme: 'github-dark'
  })

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
  }) as JSX.Element
}
```

In your `codeblock.tsx`:

```tsx
'use client'
import { JSX, useLayoutEffect, useState } from 'react'
import { highlight } from './shared'

export function CodeBlock({ initial }: { initial?: JSX.Element }) {
  const [nodes, setNodes] = useState(initial)

  useLayoutEffect(() => {
    void highlight('console.log("Rendered on client")', 'ts').then(setNodes)
  }, [])

  return nodes ?? <p>Loading...</p>
}
```

The `initial` prop can be passed from a server component to pre-render the code block on server.

In your `page.tsx`:

```tsx
import { CodeBlock } from './codeblock'
import { highlight } from './shared'

export default async function Page() {
  // `initial` is optional.
  return (
    <main>
      <CodeBlock initial={await highlight('console.log("Rendered on server")', 'ts')} />
    </main>
  )
}
```

::: info
The above example uses the `shiki/bundle/web` bundle. You can change it to [Fine-grained Bundle](/guide/bundles#fine-grained-bundle) to fully control the bundled languages/themes.
:::

### Performance

Shiki lazy loads the requested languages and themes, the Next.js bundler can handle lazy imports automatically.
Importing `shiki` or its web bundle is efficient enough for most Next.js applications, Fine-grained Bundle won't significantly impact the bundle size.

In addition, you can use the `createHighlighter` API to preload specific languages and themes.
Please refer to [Highlighter Usage](/guide/install#highlighter-usage) for further details.

### Highlighter Instance

If you define a highlighter (without `await`) as a global variable, you can reference it directly from server and client components.

```ts
import { createHighlighter } from 'shiki'

const highlighter = createHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
})

// Inside an async server component, or client side `useEffect`
const html = (await highlighter).codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'nord'
})
```
