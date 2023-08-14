import { defineConfig } from 'vitest/config'

// @ts-expect-error no types
import { wasmPlugin } from './packages/shikiji/rollup.config.mjs'

export default defineConfig({
  plugins: [
    wasmPlugin(),
  ],
  test: {
    server: {
      deps: {
        inline: [
          /\.wasm/,
        ],
      },
    },
  },
})
