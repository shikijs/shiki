import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/vue',
    'src/react',
    'src/solid',
  ],
  declaration: 'node16',
  clean: true,
  rollup: {
    inlineDependencies: [
      '@antfu/utils',
    ],
  },
})
