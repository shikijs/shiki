import fs from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/vue',
    'src/react',
    'src/solid',
    {
      builder: 'mkdist',
      input: 'src/svelte',
      outDir: 'dist/svelte',
      format: 'esm',
      pattern: ['**/*'],
    },
  ],
  declaration: 'node16',
  clean: true,
  rollup: {
    inlineDependencies: [
      '@antfu/utils',
    ],
  },
  hooks: {
    'mkdist:done': async () => {
      await fs.writeFile('dist/svelte.mjs', 'export * from "./svelte/index.mjs"\n', 'utf-8')
      await fs.writeFile('dist/svelte.d.ts', 'export * from "./svelte/index.mjs"\n', 'utf-8')
      await fs.writeFile('dist/svelte.d.mts', 'export * from "./svelte/index.mjs"\n', 'utf-8')
      await fs.copyFile('dist/svelte/index.d.ts', 'dist/svelte/index.d.mts')
    },
  },
})
