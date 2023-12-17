# Load Custom Languages

Check [All Builtin Languages](/languages) as well.

You can load custom languages by passing a TextMate grammar object into the langs array.

```ts
import { getHighlighter } from 'shikiji'

const myLang = JSON.parse(fs.readFileSync('my-lang.json', 'utf8'))

const highlighter = await getHighlighter({
  langs: [myLang]
})

const html = highlighter.codeToHtml(code, {
  lang: 'my-lang',
})
```

You can also load languages after the highlighter has been created.

```ts
import { getHighlighter } from 'shikiji'

const myLang = JSON.parse(fs.readFileSync('my-lang.json', 'utf8'))

const highlighter = await getHighlighter()

await highlighter.loadLanguage(myLang) // <--

const html = highlighter.codeToHtml(code, {
  lang: 'my-lang',
})
```

## Migrate from Shiki

Since `shikiji` is environment agnostic, that means we don't have access to the file system. That means the `path` property `shiki` supports is not available in `shikiji`. Instead, you need to read them in yourself and pass the object. For example:

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

Instead, load that file yourself (via `fs`, `import()`, `fetch()`, etc.) and pass the object:

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
