import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import { wasmPlugin } from './packages/core/rollup.config.mjs'

export default defineConfig({
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
        '**/vendor/**',
        '**/stack-element-metadata.ts',
        '**/src/oniguruma/**',
        '**/src/assets/**',

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
