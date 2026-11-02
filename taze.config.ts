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
    // Babel 8 presets require @babel/core 8, but babel-preset-solid and @rollup/plugin-babel still peer on @babel/core 7
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
})
