import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { wasmPlugin } from './packages/shikiji-core/rollup.config.mjs'

export default defineConfig({
  plugins: [
    wasmPlugin(),
  ],
  resolve: {
    alias: {
      'shikiji-core/wasm': fileURLToPath(new URL('./packages/shikiji-core/src/wasm.ts', import.meta.url)),
      'shikiji-core/types': fileURLToPath(new URL('./packages/shikiji-core/src/types.ts', import.meta.url)),
      'shikiji-core': fileURLToPath(new URL('./packages/shikiji-core/src/index.ts', import.meta.url)),
      'shikiji-transformers': fileURLToPath(new URL('./packages/shikiji-transformers/src/index.ts', import.meta.url)),
      'shikiji-compat': fileURLToPath(new URL('./packages/shikiji-compat/src/index.ts', import.meta.url)),
      'shikiji-twoslash': fileURLToPath(new URL('./packages/shikiji-twoslash/src/index.ts', import.meta.url)),
      'markdown-it-shikiji': fileURLToPath(new URL('./packages/markdown-it-shikiji/src/index.ts', import.meta.url)),
      'shikiji/wasm': fileURLToPath(new URL('./packages/shikiji/src/wasm.ts', import.meta.url)),
      'shikiji/core': fileURLToPath(new URL('./packages/shikiji/src/core.ts', import.meta.url)),
      'shikiji': fileURLToPath(new URL('./packages/shikiji/src/index.ts', import.meta.url)),
    },
  },
  test: {
    exclude: ['**/vendor/**', '**/node_modules/**'],
    server: {
      deps: {
        inline: [
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
        '**/src/oniguruma/**',
        '**/src/assets/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/scripts/**',
        '**/vendor/**',
        '**/stackElementMetadata.ts',
      ],
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
