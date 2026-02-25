import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  dts: {
    compilerOptions: {
      paths: {},
    },
  },
  external: ['monaco-editor-core'],
})
