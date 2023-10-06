import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      './packages/shikiji/src/assets/**/*',
    ],
  },
  {
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
)
