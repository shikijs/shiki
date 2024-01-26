# Load Custom Languages

See [All Builtin Languages](/languages) first.

You can load custom languages by passing a TextMate grammar object into the `langs` array.

```ts twoslash
// @noErrors
import { getHighlighter } from 'shiki'

const myLang = JSON.parse(fs.readFileSync('my-lang.json', 'utf8'))

const highlighter = await getHighlighter({
  langs: [myLang]
})

const html = highlighter.codeToHtml(code, {
  lang: 'my-lang',
})
```

You can also load languages after the highlighter has been created.

```ts twoslash
// @noErrors
import { getHighlighter } from 'shiki'

const myLang = JSON.parse(fs.readFileSync('my-lang.json', 'utf8'))

const highlighter = await getHighlighter()

await highlighter.loadLanguage(myLang) // <--

const html = highlighter.codeToHtml(code, {
  lang: 'my-lang',
})
```

## Migrate from v0.14

Since v1.0, `shiki` now is environment agnostic, we don't have access to the file system. That means the `path` property `shiki@0.14` supports is not available in v1.0, and you must to read the files yourself and pass in the object.

For example, the following would not work:

```ts
const highlighter = await getHighlighter({
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
  ]
})
```

Instead, load that file yourself (via `fs`, `import()`, `fetch()`, etc.):

```ts
const vineGrammar = JSON.parse(fs.readFileSync(join(__dirname, './vine-ts.tmLanguage.json'), 'utf8'))

const highlighter = await getHighlighter({
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
  ]
})
```

## Custom Language Aliases

You can register custom language aliases with the `langAlias` option. For example:

```ts twoslash
import { getHighlighter } from 'shiki'

const highlighter = await getHighlighter({
  langs: ['javascript'],
  langAlias: { // [!code hl:3]
    mylang: 'javascript',
  },
})

const code = highlighter.codeToHtml('const a = 1', {
  lang: 'mylang', // [!code hl]
  theme: 'nord'
})
```
