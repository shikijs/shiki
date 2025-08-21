# Code Example

Here's a code block with escaped notation:

```js
// [\!code highlight:1-3]
export function foo() {
  const a = "Hello World"
  return a
}
```

And here's one without escaping (should not be transformed):

```js
// [!code highlight:1-3]
export function bar() {
  const b = "Goodbye World"
  return b
}
```

The transformer should only remove the backslash from `[\!code` patterns.
