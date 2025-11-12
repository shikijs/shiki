# Load Custom Languages

See [All Builtin Languages](/languages) first.

You can load custom languages by passing a TextMate grammar object into the `langs` array.

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"36a07172af45d084fa0368000740115871c76741f6eb124ed98cb713e4273dcb","data":"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"}
// @noErrors
import { createHighlighter } from 'shiki'

const myLang = JSON.parse(fs.readFileSync('my-lang.json', 'utf8'))

const highlighter = await createHighlighter({
  langs: [myLang],
  themes: ['vitesse-light']
})

const html = highlighter.codeToHtml(code, {
  lang: 'my-lang',
  theme: 'vitesse-light'
})
```

You can also load languages after the highlighter has been created.

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"f4bb6615146b5c0df2c06b8e148cb16f9291904f50fb5b24c0f503af6292e0e7","data":"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"}
// @noErrors
import { createHighlighter } from 'shiki'

const myLang = JSON.parse(fs.readFileSync('my-lang.json', 'utf8'))

const highlighter = await createHighlighter({
  langs: [],
  themes: ['vitesse-light'],
})

await highlighter.loadLanguage(myLang) // <--

const html = highlighter.codeToHtml(code, {
  lang: 'my-lang',
  theme: 'vitesse-light'
})
```

## Migrate from v0.14

Since v1.0, `shiki` now is environment agnostic, we don't have access to the file system. That means the `path` property `shiki@0.14` supports is not available in v1.0, and you must to read the files yourself and pass in the object.

For example, the following would not work:

```ts
const highlighter = await createHighlighter({
  langs: [
    {
      name: 'vue-vine',
      scopeName: 'source.vue-vine',
      // ‼️ This would not work!
      path: join(__dirname, './vine-ts.tmLanguage.json'),
      embeddedLangs: [
        'vue-html',
        'css',
        'scss',
        'sass',
        'less',
        'stylus',
      ],
    },
  ],
  themes: []
})
```

Instead, load that file yourself (via `fs`, `import()`, `fetch()`, etc.):

```ts
const vineGrammar = JSON.parse(fs.readFileSync(join(__dirname, './vine-ts.tmLanguage.json'), 'utf8'))

const highlighter = await createHighlighter({
  langs: [
    {
      name: 'vue-vine',
      scopeName: 'source.vue-vine',
      embeddedLangs: [
        'vue-html',
        'css',
        'scss',
        'sass',
        'less',
        'stylus',
      ],
      ...vineGrammar
    },
  ],
  themes: []
})
```

## Custom Language Aliases

You can register custom language aliases with the `langAlias` option. For example:

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"ca62bdddea1833a5415496007908db6a91f1c19a9ababc3f7316912b2c4f616e","data":"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"}
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  langs: ['javascript'],
  langAlias: { // [!code hl:3]
    mylang: 'javascript',
  },
  themes: ['nord']
})

const code = highlighter.codeToHtml('const a = 1', {
  lang: 'mylang', // [!code hl]
  theme: 'nord'
})
```
