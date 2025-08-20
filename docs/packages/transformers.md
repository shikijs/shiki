---
outline: deep
---

# @shikijs/transformers

<Badges name="@shikijs/transformers" />

Common transformers for Shiki, inspired by [shiki-processor](https://github.com/innocenzi/shiki-processor).

## Install

::: code-group

```sh [npm]
npm i -D @shikijs/transformers
```

```sh [yarn]
yarn add -D @shikijs/transformers
```

```sh [pnpm]
pnpm add -D @shikijs/transformers
```

```sh [bun]
bun add -D @shikijs/transformers
```

```sh [deno]
deno add npm:@shikijs/transformers
```

:::

## Usage

```ts twoslash
// [!code highlight:5]
import {
  transformerNotationDiff,
  // ...
} from '@shikijs/transformers'
import {
  codeToHtml,
} from 'shiki'

const code = `console.log('hello')`
const html = await codeToHtml(code, {
  lang: 'ts',
  theme: 'nord',
  transformers: [
    transformerNotationDiff(), // [!code highlight]
    // ...
  ],
})
```

## Unstyled

Transformers only applies classes and does not come with styles; you can provide your own CSS rules to style them properly.

## Matching Algorithm

We found that the algorithm for matching comments in v1 is sometime conterintuitive, where we are trying to fix it in a progressive way. Since v1.29.0, we introduced a new `matchAlgorithm` option to most of the transformer for you to toggle between different matching algorithms. Right now, the default is `v1` which is the old algorithm, and `v3` is the new algorithm. When Shiki v3 is landed, the default will be `v3`.

```ts
const html = await codeToHtml(code, {
  lang: 'ts',
  theme: 'nord',
  transformers: [
    transformerNotationDiff({
      matchAlgorithm: 'v3', // [!code hl]
    }),
  ],
})
```

### `matchAlgorithm: 'v1'`

The matching algorithm mostly affects the single-line comment matching, in `v1`, it will count the comment line as the first line, while in `v3`, it will count start from the comment line:

```ts
// [\!code highlight:3]
console.log('highlighted') // [!code hl]
console.log('highlighted') // [!code hl]
console.log('not highlighted')
```

### `matchAlgorithm: 'v3'`

In `v3`, the matching algorithm will start counting from the line below the comment:

```ts
// [\!code highlight:2]
console.log('highlighted') // [!code hl]
console.log('highlighted') // [!code hl]
console.log('not highlighted')
```

## Transformers

### `transformerNotationDiff`

Use `[!code ++]` and `[!code --]` to mark added and removed lines.

````md
```ts
console.log('hewwo') // [\!code --]
console.log('hello') // [\!code ++]
console.log('goodbye')
```
````

Renders (with custom CSS rules):

```ts
console.log('hewwo') // [!code --]
console.log('hello') // [!code ++]
console.log('goodbye')
```

- `// [!code ++]` outputs: `<span class="line diff add">`
- `// [!code --]` outputs: `<span class="line diff remove">`
- The outer `<pre>` tag is modified: `<pre class="has-diff">`

::: details HTML Output

```html
<!-- Output (stripped of `style` attributes for clarity) -->
<pre class="shiki has-diff"> <!-- Notice `has-diff` -->
  <code>
    <span class="line"></span>
    <span class="line"><span>function</span><span>()</span><span></span><span>{</span></span>
    <span class="line diff remove">  <!-- Notice `diff` and `remove` -->
      <span></span><span>console</span><span>.</span><span>log</span><span>(</span><span>&#39;</span><span>hewwo</span><span>&#39;</span><span>) </span>
    </span>
    <span class="line diff add">  <!-- Notice `diff` and `add` -->
      <span></span><span>console</span><span>.</span><span>log</span><span>(</span><span>&#39;</span><span>hello</span><span>&#39;</span><span>) </span>
    </span>
    <span class="line"><span></span><span>}</span></span>
    <span class="line"><span></span></span>
  </code>
</pre>
```

:::

---

### `transformerNotationHighlight`

Use `[!code highlight]` to highlight a line.

````md
```ts
console.log('Not highlighted')
console.log('Highlighted') // [\!code highlight]
console.log('Not highlighted')
```
````

Renders (with custom CSS rules):

```ts
console.log('Not highlighted')
console.log('Highlighted') // [!code highlight]
console.log('Not highlighted')
```

- `// [!code highlight]` outputs: `<span class="line highlighted">`
- The outer `<pre>` tag is modified: `<pre class="has-highlighted">`

You can also highlight multiple lines with a single comment:

````md
```ts
// [\!code highlight:3]
console.log('Highlighted')
console.log('Highlighted')
console.log('Not highlighted')
```

```ts
console.log('Not highlighted')
// [\!code highlight:1]
console.log('Highlighted')
console.log('Not highlighted')
```
````

Renders:

```ts
// [!code highlight:3]
console.log('Highlighted')
console.log('Highlighted')
console.log('Not highlighted')
```

```ts
console.log('Not highlighted')
// [!code highlight:1]
console.log('Highlighted')
console.log('Not highlighted')
```

---

### `transformerNotationWordHighlight`

Use `[!code word:Hello]` to highlight the word `Hello` in any subsequent code.

````md
```ts
// [\!code word:Hello]
const message = 'Hello World'
console.log(message) // prints Hello World
```
````

Renders (with custom CSS rules):

```ts
// [!code word:Hello]
const message = 'Hello World'
console.log(message) // prints Hello World
```

Outputs: `<span class="highlighted-word">Hello</span>` for matched words.

You can also specify the number of lines to highlight words on, e.g. `[!code word:Hello:1]` will only highlight occurrences of `Hello` on the next line.

````md
```ts
// [\!code word:Hello:1]
const message = 'Hello World'
console.log(message) // prints Hello World
```
````

Renders:

```ts
// [!code word:Hello:1]
const message = 'Hello World'
console.log(message) // prints Hello World
```

---

### `transformerNotationFocus`

Use `[!code focus]` to focus a line.

````md
```ts
console.log('Not focused');
console.log('Focused') // [\!code focus]
console.log('Not focused');
```
````

Renders (with custom CSS rules):

```ts
console.log('Not focused')
console.log('Focused') // [!code focus]
console.log('Not focused')
```

- Outputs: `<span class="line focused">`
- The outer `<pre>` tag is modified: `<pre class="has-focused">`

You can also focus multiple lines with a single comment:

````md
```ts
// [\!code focus:3]
console.log('Focused')
console.log('Focused')
console.log('Not focused')
```
````

Renders:

```ts
// [!code focus:3]
console.log('Focused')
console.log('Focused')
console.log('Not focused')
```

---

### `transformerNotationErrorLevel`

Use `[!code error]` and `[!code warning]` to mark a line with an error and warning levels.

````md
```ts
console.log('No errors or warnings')
console.error('Error') // [\!code error]
console.warn('Warning') // [\!code warning]
```
````

- Outputs: `<span class="line highlighted error">` for errors
- Outputs: `<span class="line highlighted warning">` for warnings
- The outer `<pre>` tag is modified: `<pre class="has-highlighted">`

With some additional CSS rules, you can make it look like this:

```ts
console.log('No errors or warnings')
console.error('Error') // [!code error]
console.warn('Warning') // [!code warning]
```

---

### `transformerRenderWhitespace`

Render whitespaces (tabs and spaces) as individual spans, with classes `tab` and `space`.

With some additional CSS rules, you can make it look like this:

<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre v-pre class="shiki shiki-themes vitesse-light vitesse-dark" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">function</span><span class="space"> </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">block</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">{</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">space</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span></span>
<span class="line"><span class="tab">&#9;</span><span class="tab">&#9;</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">tab</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> </span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre></div>

::: details Example CSS

```css
pre.shiki .tab,
pre.shiki .space {
  position: relative;
}

pre.shiki .tab::before {
  content: '⇥';
  position: absolute;
  opacity: 0.3;
}

pre.shiki .space::before {
  content: '·';
  position: absolute;
  opacity: 0.3;
}
```

:::

---

### `transformerMetaHighlight`

Highlight lines based on the [meta string](/guide/transformers#meta) provided on the code snippet.

````md
```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```
````

Renders (with custom CSS rules):

```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```

- Outputs: `<span class="line highlighted">` for included lines.

### `transformerMetaWordHighlight`

Highlight words based on the meta string provided on the code snippet.

````md
```js /Hello/
const msg = 'Hello World'
console.log(msg)
console.log(msg) // prints Hello World
```
````

Renders (with custom CSS rules):

```js /Hello/
const msg = 'Hello World'
console.log(msg) // prints Hello World
```

Outputs: `<span class="highlighted-word">Hello</span>` for matched words.

---

### `transformerCompactLineOptions`

Support for `shiki`'s `lineOptions` that is removed in `shiki`.

---

### `transformerRemoveLineBreak`

Remove line breaks between `<span class="line">`. Useful when you set `display: block` to `.line` in CSS.

---

### `transformerRemoveNotationEscape`

Transform `// [\!code ...]` to `// [!code ...]`.
Avoid rendering the escaped notation syntax as it is.

---

### `transformerStyleToClass`

Convert Shiki's inline styles to unique classes.

Class names are generated based on the hash value of the style object with the prefix/suffix you provide. You can put this transformer in multiple highlights passes and then get the CSS at the end to reuse the exact same styles. As Shiki doesn't handle CSS, it's on your integration to decide how to extract and apply/bundle the CSS.

For example:

```ts
import { transformerStyleToClass } from '@shikijs/transformers'
import { codeToHtml } from 'shiki'

const toClass = transformerStyleToClass({ // [!code highlight:3]
  classPrefix: '__shiki_',
})

const code = `console.log('hello')`
const html = await codeToHtml(code, {
  lang: 'ts',
  themes: {
    dark: 'vitesse-dark',
    light: 'vitesse-light',
  },
  defaultColor: false,
  transformers: [toClass], // [!code highlight]
})

// The transformer instance exposes some methods to get the CSS
const css = toClass.getCSS() // [!code highlight]

// use `html` and `css` in your app
```

HTML output:

```html
<pre class="shiki shiki-themes vitesse-dark vitesse-light __shiki_9knfln" tabindex="0"><code><span class="line">
  <span class="__shiki_14cn0u">console</span>
  <span class="__shiki_ps5uht">.</span>
  <span class="__shiki_1zrdwt">log</span>
  <span class="__shiki_ps5uht">(</span>
  <span class="__shiki_236mh3">'</span>
  <span class="__shiki_1g4r39">hello</span>
  <span class="__shiki_236mh3">'</span>
  <span class="__shiki_ps5uht">)</span>
</span></code></pre>
```

CSS output:

```css
.__shiki_14cn0u {
  --shiki-dark: #bd976a;
  --shiki-light: #b07d48;
}
.__shiki_ps5uht {
  --shiki-dark: #666666;
  --shiki-light: #999999;
}
.__shiki_1zrdwt {
  --shiki-dark: #80a665;
  --shiki-light: #59873a;
}
.__shiki_236mh3 {
  --shiki-dark: #c98a7d77;
  --shiki-light: #b5695977;
}
.__shiki_1g4r39 {
  --shiki-dark: #c98a7d;
  --shiki-light: #b56959;
}
.__shiki_9knfln {
  --shiki-dark: #dbd7caee;
  --shiki-light: #393a34;
  --shiki-dark-bg: #121212;
  --shiki-light-bg: #ffffff;
}
```
