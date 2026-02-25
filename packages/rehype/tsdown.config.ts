import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core.ts',
  ],
  dts: {
    compilerOptions: {
      paths: {},
    },
  },
  external: ['hast'],
})
