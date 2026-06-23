import { svelte as Svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'
import { wasmPlugin } from '../engine-oniguruma/rollup.config.mjs'

export default defineConfig({
  plugins: [
    wasmPlugin(),
    Svelte(),
  ],
  resolve: {
    conditions: ['browser', 'import', 'module', 'default'],
    tsconfigPaths: true,
    alias: [
      { find: '@shikijs/engine-oniguruma/wasm-inlined', replacement: new URL('../engine-oniguruma/src/wasm-inlined.ts', import.meta.url).pathname },
      { find: /^svelte$/, replacement: new URL('./node_modules/svelte/src/index-client.js', import.meta.url).pathname },
    ],
  },
  test: {
    testTimeout: 30_000,
  },
})
