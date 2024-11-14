import fs from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
    'src/client.ts',
    'src/cache-fs.ts',
  ],
  declaration: true,
  rollup: {
    emitCJS: false,
  },
  externals: [
    'hast',
    '@shikijs/vitepress-twoslash',
    '@shikijs/vitepress-twoslash/style.css',
  ],
  hooks: {
    'rollup:done': async () => {
      console.log('Building style.css')
      const floatingVue = await fs.readFile(new URL('./node_modules/floating-vue/dist/style.css', import.meta.url), 'utf-8')
      const twoslash = await fs.readFile(new URL('./../twoslash/style-rich.css', import.meta.url), 'utf-8')
      const local = await fs.readFile(new URL('./src/style.css', import.meta.url), 'utf-8')

      const all = [
        '/* BUNDLED FROM floating-vue/dist/style.css */',
        floatingVue,
        '',
        '/* BUNDLED FROM @shikijs/twoslash/style-rich.css */',
        twoslash,
        '',
        '/* BUNDLED FROM @shikijs/vitepress-twoslash/style-core.css */',
        local,
      ].join('\n')

      await fs.writeFile(new URL('./style.css', import.meta.url), all)
      await fs.writeFile(new URL('./style-core.css', import.meta.url), local)
    },
  },
})
