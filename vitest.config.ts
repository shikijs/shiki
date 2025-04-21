import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import { wasmPlugin } from './packages/engine-oniguruma/rollup.config.mjs'

export default defineConfig({
  plugins: [
    wasmPlugin(),
    tsconfigPaths(),
  ],
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
