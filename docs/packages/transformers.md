---
outline: deep
---

# @shikijs/transformers

<Badges name="@shikijs/transformers" />

Collective of common transformers for Shiki, inspired by [shiki-processor](https://github.com/innocenzi/shiki-processor).

## Install

```bash
npm i -D @shikijs/transformers
```

```ts twoslash
import {
  codeToHtml,
} from 'shiki'
import {
  transformerNotationDiff,
  // ...
} from '@shikijs/transformers'

const code = `console.log('hello')`
const html = await codeToHtml(code, {
  lang: 'ts',
  theme: 'nord',
  transformers: [
    transformerNotationDiff(),
    // ...
  ],
})
```

## Transformers

Transformers add specific CSS classes to relevant tags but do not come with any styles, the users is responsible for writing the CSS rules for the classes themselves.

### `transformerNotationDiff`

Use `[!code ++]` and `[!code --]` to mark added and removed lines.

For example, the following code

````md
```ts
export function foo() {
  console.log('hewwo') // [\!code --]
  console.log('hello') // [\!code ++]
}
```
````

Render the tag `pre` with the class `has-diff`, and `span` tags for the marked lines with the classes `diff` and either `add` for `// [\!code ++]` or `remove` for `// [\!code --]`.

With some CSS, you can make it look like this:

```ts
export function foo() {
  console.log('hewwo') // [!code --]
  console.log('hello') // [!code ++]
}
```

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

For example, the following code:

````md
```ts
export function foo() {
  console.log('Highlighted') // [\!code highlight]
}
```
````

Render the tag `pre` and and the `span` tag for the line marked with `// [\!code highlight]` with the class `highlighted`.

With some CSS, you can make it look like this:

```ts
export function foo() {
  console.log('Highlighted') // [!code highlight]
}
```

Alternatively, you can use the [`transformerMetaHighlight`](#transformermetahighlight) to highlight lines based on the meta string.

---

### `transformerNotationWordHighlight`

Use `[!code word:xxx]` to highlight a word.

For example, the following code:

````md
```ts
export function foo() { // [\!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```
````

Render the `span` for the the word "Hello" with the class `highlighted-word`.

With some CSS, you can make it look like this:

```ts
export function foo() { // [!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```

You can also specify the number of occurrences to highlight, e.g. `[!code word:options:2]` will highlight the next 2 occurrences of `options`.

````md
```ts
// [\!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // this one will not be highlighted
```
````

```ts
// [!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // this one will not be highlighted
```

---

### `transformerNotationFocus`

Use `[!code focus]` to focus a line.

For example, the following code:

````md
```ts
export function foo() {
  console.log('Focused') // [\!code focus]
}
```
````

Render the tag `pre` with the class `has-focused-lines`, and `span` lines marked with `// [\!code focus]` the class `has-focus`.

With some CSS, you can make it look like this:

```ts
export function foo() {
  console.log('Focused') // [!code focus]
}
```

---

### `transformerNotationErrorLevel`

Use `[!code error]`, `[!code warning]`, to mark a line with an error level.

For example, the following code:

````md
```ts
export function foo() {
  console.error('Error') // [\!code error]
  console.warn('Warning') // [\!code warning]
}
```
````

Render the tag `pre` with the class `has-highlighted`, and the `span` tags for the marked lines with the classes `highlighted` and either `error` for `// [\!code error]` or `warning` for `// [\!code warning]`.

With some CSS, you can make it look like this:

```ts
export function foo() {
  console.error('Error') // [!code error]
  console.warn('Warning') // [!code warning]
}
```

---

### `transformerRenderWhitespace`

Render whitespaces (tabs and spaces) as individual spans, with classes `tab` and `space`.

With some CSS, you can make it look like this:

<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre v-pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">function</span><span class="space"> </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">block</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">{</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">space</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span></span>
<span class="line"><span class="tab">&#9;</span><span class="tab">&#9;</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">table</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span class="space"> </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> </span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre></div>

::: details Example CSS

```css
.vp-code .tab,
.vp-code .space {
  position: relative;
}

.vp-code .tab::before {
  content: '⇥';
  position: absolute;
  opacity: 0.3;
}

.vp-code .space::before {
  content: '·';
  position: absolute;
  opacity: 0.3;
}
```

:::

---

### `transformerMetaHighlight`

Highlight lines based on the meta string provided on the code snippet. Requires integrations supports.

For example, the following code:

````md
```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```
````

Render the informed `span` lines with the class `highlighted`.

With some CSS, you can make it look like this:

```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```

### `transformerMetaWordHighlight`

Highlight words based on the meta string provided on the code snippet. Requires integrations supports.

For example, the following code:

````md
```js /Hello/
const msg = 'Hello World'
console.log(msg)
console.log(msg) // prints Hello World
```
````

Render the `span` tags for the informed word class `highlighted-word`.

With some CSS, you can make it look like this:

```js /Hello/
const msg = 'Hello World'
console.log(msg) // prints Hello World
```

---

### `transformerCompactLineOptions`

Support for `shiki`'s `lineOptions` that is removed in `shiki`.

---

### `transformerRemoveLineBreak`

Remove line breaks between `<span class="line">`. Useful when you set `display: block` to `.line` in CSS.
