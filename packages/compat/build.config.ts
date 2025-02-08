import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
  ],
  declaration: 'node16',
  rollup: {
    emitCJS: false,
    dts: {
      respectExternal: true,
      compilerOptions: {
        paths: {},
      },
    },
  },
  externals: [
    'hast',
    'shiki',
    '@shikijs/types',
    /^@shikijs[\\/].*/,
  ],
})
