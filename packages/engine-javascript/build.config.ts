import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
    'src/engine-compile.ts',
    'src/engine-raw.ts',
  ],
  declaration: true,
  rollup: {
    emitCJS: false,
    dts: {
      compilerOptions: {
        paths: {},
      },
    },
  },
  externals: [
    'hast',
  ],
})
