import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
    'src/cli.ts',
  ],
  declaration: true,
  rollup: {
    emitCJS: false,
  },
  externals: [
    'hast',
  ],
})
