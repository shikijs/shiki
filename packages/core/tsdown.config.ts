import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/types.ts',
    'src/textmate.ts',
  ],
  dts: {
    compilerOptions: {
      paths: {},
    },
  },
  deps: {
    onlyBundle: [
      'ansi-sequence-parser',
    ],
    neverBundle: [
      'hast',
      ...Object.keys(pkg.dependencies),
    ],
    alwaysBundle: [/^(?!hast$|@shikijs\/primitive$)/],
  },
})
