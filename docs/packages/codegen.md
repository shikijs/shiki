# shiki-codegen

<Badges name="shiki-codegen" />

Codegen for Shiki to create optimized bundles dedicated for your usage.

## Usage

### CLI

```bash
npx shiki-codegen \
  --langs typescript,javascript,vue \
  --themes light-plus,dark-plus \
  --engine javascript \
  ./shiki.bundle.ts
```

File `shiki.bundle.ts` will be created with the code that you can use in your project.

Then you can use it in your project:

```ts
import { codeToHtml } from './shiki.bundle'

const html = await codeToHtml(code, { lang: 'typescript', theme: 'light-plus' })
```

### Programmatic

```ts
import { codegen } from 'shiki-codegen'

const { code } = await codegen({
  langs: ['typescript', 'javascript', 'vue'],
  themes: ['light-plus', 'dark-plus'],
  engine: 'javascript',
  typescript: true
})

// Write the code to a file
```
