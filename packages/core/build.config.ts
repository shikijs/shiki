import { defineBuildConfig } from 'unbuild'
import Quansync from 'unplugin-quansync/rollup'

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
  hooks: {
    'rollup:options': (ctx, options) => {
      options.plugins.push(Quansync())
    },
  },
})
