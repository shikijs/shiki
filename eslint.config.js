import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'packages/shikiji/src/assets/*.ts',
      '**/fixtures/**',
    ],
  },
  {
    rules: {
      'no-restricted-syntax': 'off',
      'ts/no-invalid-this': 'off',
    },
  },
)
