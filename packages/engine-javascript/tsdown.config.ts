import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/engine-compile.ts',
    'src/engine-raw.ts',
  ],
  dts: {
    compilerOptions: {
      paths: {},
    },
  },
  external: ['hast'],
})
