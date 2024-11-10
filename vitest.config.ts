import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import { wasmPlugin } from './packages/core/rollup.config.mjs'

const localOnigurumaToEs = fileURLToPath(new URL('../oniguruma-to-es/dist/index.mjs', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      // For local developement
      ...existsSync(localOnigurumaToEs)
        ? {
            'oniguruma-to-es': localOnigurumaToEs,
          }
        : {},
    },
  },
  plugins: [
    wasmPlugin(),
    tsconfigPaths(),
  ],
  test: {
    exclude: [
      '**/vendor/**',
      '**/node_modules/**',
    ],
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
        '**/node_modules/**',
        '**/dist/**',
        '**/scripts/**',

        // Vendored code
        'packages/engine-oniguruma/src/oniguruma/onig.ts',
        '**/src/langs/**',
        '**/src/themes/**',
        '**/wasm-inlined.ts',

        // Integration packages that are hard to cover, or tested elsewhere
        'packages/cli/**',
        'packages/monaco/**',
        'packages/vitepress-twoslash/**',
      ],
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
