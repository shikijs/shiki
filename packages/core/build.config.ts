import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
    'src/types.ts',
    'src/textmate.ts',
  ],
  declaration: 'node16',
  rollup: {
    emitCJS: false,
    dts: {
      compilerOptions: {
        paths: {},
      },
      respectExternal: true,
    },
    inlineDependencies: true,
  },
  externals: [
    'hast',
  ],
})
