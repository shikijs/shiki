import { defineConfig } from 'tsdown'

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
    respectExternal: true,
  },
  external: ['hast'],
  noExternal: [/^(?!hast$)/],
})
