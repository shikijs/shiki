import { defineConfig } from 'taze'

export default defineConfig({
  ignorePaths: [
    '**/vendor/**',
    '**/node_modules/**',
  ],
  exclude: [
    // The WASM in v2.0 is not compatible with our loader
    // As there seems to be no much improvement, I guess we could stick with the old version for a while longer
    'vscode-oniguruma',
  ],
})
