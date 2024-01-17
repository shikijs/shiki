---
outline: deep
---

# shikiji-transformers

<Badges name="shikiji-transformers" />

Collective of common transformers for Shikiji, inspired by [shiki-processor](https://github.com/innocenzi/shiki-processor).

## Install

```bash
npm i -D shikiji-transformers
```

```ts twoslash
import {
  codeToHtml,
} from 'shikiji'
import {
  transformerNotationDiff,
  // ...
} from 'shikiji-transformers'

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

will be transformed to

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

Use `[!code highlight]` to highlight a line (adding `highlighted` class).

````md
```ts
export function foo() {
  console.log('Highlighted') // [\!code highlight]
}
```
````

Results in

```ts
export function foo() {
  console.log('Highlighted') // [!code highlight]
}
```

Alternatively, you can use the [`transformerMetaHighlight`](#transformermetahighlight) to highlight lines based on the meta string.

---

### `transformerNotationWordHighlight`

Use `[!code word:xxx]` to highlight a word (adding `highlighted-word` class).

````md
```ts
export function foo() { // [\!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```
````

Results in

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

Use `[!code focus]` to focus a line (adding `focused` class).

````md
```ts
export function foo() {
  console.log('Focused') // [\!code focus]
}
```
````

Results in

```ts
export function foo() {
  console.log('Focused') // [!code focus]
}
```

---

### `transformerNotationErrorLevel`

Use `[!code error]`, `[!code warning]`, to mark a line with an error level (adding `highlighted error`, `highlighted warning` class).

````md
```ts
export function foo() {
  console.error('Error') // [\!code error]
  console.warn('Warning') // [\!code warning]
}
```
````

Results in

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

````md
```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```
````

Results in

```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```

### `transformerMetaWordHighlight`

Highlight words based on the meta string provided on the code snippet. Requires integrations supports.

````md
```js /Hello/
const msg = 'Hello World'
console.log(msg)
console.log(msg) // prints Hello World
```
````

Results in

```js /Hello/
const msg = 'Hello World'
console.log(msg) // prints Hello World
```

---

### `transformerCompactLineOptions`

Support for `shiki`'s `lineOptions` that is removed in `shikiji`.

---

### `transformerRemoveLineBreak`

Remove line breaks between `<span class="line">`. Useful when you set `display: block` to `.line` in CSS.
