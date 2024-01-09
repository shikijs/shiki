import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
    'src/client.ts',
  ],
  declaration: true,
  rollup: {
    emitCJS: false,
  },
  externals: [
    'hast',
    'vitepress-plugin-twoslash',
    'vitepress-plugin-twoslash/style.css',
  ],
})
