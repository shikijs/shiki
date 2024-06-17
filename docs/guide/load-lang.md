# Load Custom Languages

See [All Builtin Languages](/languages) first.

You can load custom languages by passing a TextMate grammar object into the `langs` array.

```ts twoslash
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
