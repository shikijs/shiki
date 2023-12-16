import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
    'src/core.ts',
  ],
  declaration: true,
  rollup: {
    emitCJS: false,
  },
  externals: [
    'hast',
  ],
})
