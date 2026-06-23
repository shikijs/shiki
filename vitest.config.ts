import { svelte as Svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'
import { wasmPlugin } from './packages/engine-oniguruma/rollup.config.mjs'

export default defineConfig({
  plugins: [
    wasmPlugin(),
    Svelte(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: [
      { find: '@shikijs/engine-oniguruma/wasm-inlined', replacement: new URL('./packages/engine-oniguruma/src/wasm-inlined.ts', import.meta.url).pathname },
      { find: /^svelte$/, replacement: new URL('./node_modules/svelte/src/index-client.js', import.meta.url).pathname },
    ],
  },
  test: {
    testTimeout: 30_000,
    reporters: 'dot',
    exclude: [
      '**/vendor/**',
      '**/node_modules/**',
      '**/tm-grammars-themes/**',
    ],
    server: {
      deps: {
        inline: [
          'vitest-package-exports',
          /\.wasm/,
        ],
      },
    },
    coverage: {
      provider: 'v8',
      include: [
        '**/packages/*/src/**/*.ts',
      ],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/scripts/**',
        '**/*.test.ts',

        // Vendored code
        'packages/engine-oniguruma/src/oniguruma/onig.ts',
        '**/src/langs/**',
        '**/src/themes/**',
        '**/wasm-inlined.ts',

        // Integration packages that are hard to cover, or tested elsewhere
        'packages/cli/**',
        'packages/monaco/**',
        'packages/vitepress-twoslash/**',
        'packages/stream/**',
        'packages/magic-move/**',
      ],
    },
  },
})
