import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// @ts-expect-error - no types
import { wasmPlugin } from './packages/shikiji/rollup.config.mjs'

export default defineConfig({
  plugins: [
    wasmPlugin(),
  ],
  resolve: {
    alias: {
      'shikiji': fileURLToPath(new URL('./packages/shikiji/src/index.ts', import.meta.url)),
      'shikiji/core': fileURLToPath(new URL('./packages/shikiji/src/core/index.ts', import.meta.url)),
      'shikiji-transformers': fileURLToPath(new URL('./packages/shikiji-transformers/src/index.ts', import.meta.url)),
      'shikiji-compat': fileURLToPath(new URL('./packages/shikiji-compat/src/index.ts', import.meta.url)),
      'shikiji-twoslash': fileURLToPath(new URL('./packages/shikiji-twoslash/src/index.ts', import.meta.url)),
      'markdown-it-shikiji': fileURLToPath(new URL('./packages/markdown-it-shikiji/src/index.ts', import.meta.url)),
    },
  },
  test: {
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
