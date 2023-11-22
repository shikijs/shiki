import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// @ts-expect-error no types
import { wasmPlugin } from './packages/shikiji/rollup.config.mjs'

export default defineConfig({
  plugins: [
    wasmPlugin(),
  ],
  resolve: {
    alias: {
      shikiji: fileURLToPath(new URL('./packages/shikiji/src/index.ts', import.meta.url)),
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
      exclude: [
        '**/src/oniguruma/**',
        '**/src/assets/**',
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
