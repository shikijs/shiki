# API References

## `codeToHast`

You can also get the intermediate `hast` to do custom rendering without serializing them into HTML with `codeToHast`. You can also further integrate the AST with the [unified](https://github.com/unifiedjs) ecosystem.

````ts twoslash
// @cache: {"version":1,"hash":"aa0ea59b9742ed721640f4d1233696e3e09408080ce58a4fde6a5efd7f40382b","twoslash":{"nodes":[{"type":"hover","text":"const root: Root","start":6,"length":4,"target":"root","line":0,"character":6},{"type":"hover","text":"const highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>","start":13,"length":11,"target":"highlighter","line":0,"character":13},{"type":"hover","text":"(property) HighlighterGeneric<BundledLanguage, BundledTheme>.codeToHast: (code: string, options: CodeToHastOptions<BundledLanguage, BundledTheme>) => Root","docs":"Get highlighted code in HAST.","tags":[["see","https://github.com/syntax-tree/hast"]],"start":25,"length":10,"target":"codeToHast","line":0,"character":25},{"type":"hover","text":"(property) lang: \"javascript\"","start":58,"length":4,"target":"lang","line":2,"character":4},{"type":"hover","text":"(property) CodeOptionsSingleTheme<BundledTheme>.theme: ThemeRegistrationAny | StringLiteralUnion<BundledTheme, string>","start":78,"length":5,"target":"theme","line":2,"character":24},{"type":"hover","text":"namespace console\nvar console: Console","docs":"The `console` module provides a simple debugging console that is similar to the\nJavaScript console mechanism provided by web browsers.\n\nThe module exports two specific components:\n\n* A `Console` class with methods such as `console.log()`, `console.error()` and `console.warn()` that can be used to write to any Node.js stream.\n* A global `console` instance configured to write to [`process.stdout`](https://nodejs.org/docs/latest-v24.x/api/process.html#processstdout) and\n[`process.stderr`](https://nodejs.org/docs/latest-v24.x/api/process.html#processstderr). The global `console` can be used without importing the `node:console` module.\n\n_**Warning**_: The global console object's methods are neither consistently\nsynchronous like the browser APIs they resemble, nor are they consistently\nasynchronous like all other Node.js streams. See the [`note on process I/O`](https://nodejs.org/docs/latest-v24.x/api/process.html#a-note-on-process-io) for\nmore information.\n\nExample using the global `console`:\n\n```js\nconsole.log('hello world');\n// Prints: hello world, to stdout\nconsole.log('hello %s', 'world');\n// Prints: hello world, to stdout\nconsole.error(new Error('Whoops, something bad happened'));\n// Prints error message and stack trace to stderr:\n//   Error: Whoops, something bad happened\n//     at [eval]:5:15\n//     at Script.runInThisContext (node:vm:132:18)\n//     at Object.runInThisContext (node:vm:309:38)\n//     at node:internal/process/execution:77:19\n//     at [eval]-wrapper:6:22\n//     at evalScript (node:internal/process/execution:76:60)\n//     at node:internal/main/eval_string:23:3\n\nconst name = 'Will Robinson';\nconsole.warn(`Danger ${name}! Danger!`);\n// Prints: Danger Will Robinson! Danger!, to stderr\n```\n\nExample using the `Console` class:\n\n```js\nconst out = getStreamSomehow();\nconst err = getStreamSomehow();\nconst myConsole = new console.Console(out, err);\n\nmyConsole.log('hello world');\n// Prints: hello world, to out\nmyConsole.log('hello %s', 'world');\n// Prints: hello world, to out\nmyConsole.error(new Error('Whoops, something bad happened'));\n// Prints: [Error: Whoops, something bad happened], to err\n\nconst name = 'Will Robinson';\nmyConsole.warn(`Danger ${name}! Danger!`);\n// Prints: Danger Will Robinson! Danger!, to err\n```","tags":[["see","[source](https://github.com/nodejs/node/blob/v24.x/lib/console.js)"]],"start":97,"length":7,"target":"console","line":5,"character":0},{"type":"hover","text":"(method) Console.log(message?: any, ...optionalParams: any[]): void (+1 overload)","docs":"Prints to `stdout` with newline. Multiple arguments can be passed, with the\nfirst used as the primary message and all additional used as substitution\nvalues similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html)\n(the arguments are all passed to [`util.format()`](https://nodejs.org/docs/latest-v24.x/api/util.html#utilformatformat-args)).\n\n```js\nconst count = 5;\nconsole.log('count: %d', count);\n// Prints: count: 5, to stdout\nconsole.log('count:', count);\n// Prints: count: 5, to stdout\n```\n\nSee [`util.format()`](https://nodejs.org/docs/latest-v24.x/api/util.html#utilformatformat-args) for more information.","tags":[["since","v0.1.100"]],"start":105,"length":3,"target":"log","line":5,"character":8},{"type":"hover","text":"const root: Root","start":109,"length":4,"target":"root","line":5,"character":12}],"code":"const root = highlighter.codeToHast(\n  'const a = 1',\n  { lang: 'javascript', theme: 'nord' }\n)\n\nconsole.log(root)","meta":{"extension":"ts"}}}
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  themes: ['nord', 'min-light'],
  langs: ['javascript'],
})
// ---cut---
const root = highlighter.codeToHast(
  'const a = 1',
  { lang: 'javascript', theme: 'nord' }
)

console.log(root)
````

<!-- eslint-skip -->

```ts
{
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'pre',
      properties: {
        class: 'shiki vitesse-light',
        style: 'background-color:#ffffff;color:#393a34',
        tabindex: '0'
      },
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { class: 'line' },
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#AB5959' },
                  children: [ { type: 'text', value: 'const' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#B07D48' },
                  children: [ { type: 'text', value: ' a' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#999999' },
                  children: [ { type: 'text', value: ' =' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#2F798A' },
                  children: [ { type: 'text', value: ' 1' } ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```
