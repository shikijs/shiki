import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
  ],
  declaration: true,
  rollup: {
    emitCJS: false,
  },
  externals: [
    'hast',
  ],
})
