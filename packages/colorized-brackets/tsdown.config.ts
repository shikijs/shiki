import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  dts: {
    compilerOptions: {
      paths: {},
    },
  },
  external: ['hast', ...Object.keys(pkg.dependencies)],
})
