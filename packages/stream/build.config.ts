import type { Plugin } from 'rollup'
import fs from 'node:fs/promises'
import babel from '@rollup/plugin-babel'
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
    // Leave the Solid entry to babel-preset-solid. unbuild's esbuild uses the
    // classic React JSX runtime, which ignores `/* @jsxImportSource solid-js */`.
    esbuild: {
      exclude: [/node_modules/, /src\/solid\//],
    },
  },
  hooks: {
    'rollup:options': (_config, options) => {
      options.plugins ||= []
      const plugins = options.plugins as Plugin[]
      plugins.unshift(babel({
        babelHelpers: 'bundled',
        include: ['src/solid/**'],
        presets: ['@babel/preset-typescript', 'solid'],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }))
    },
    'mkdist:done': async () => {
      await fs.writeFile('dist/svelte.mjs', 'export * from "./svelte/index.mjs"\n', 'utf-8')
      await fs.writeFile('dist/svelte.d.ts', 'export * from "./svelte/index.mjs"\n', 'utf-8')
      await fs.writeFile('dist/svelte.d.mts', 'export * from "./svelte/index.mjs"\n', 'utf-8')
      await fs.copyFile('dist/svelte/index.d.ts', 'dist/svelte/index.d.mts')
    },
  },
})
