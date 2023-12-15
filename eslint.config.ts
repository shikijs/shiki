import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: {
      html: false,
      markdown: true,
      css: true,
    },
    ignores: [
      'packages/shikiji/src/assets/*.ts',
      '**/fixtures/**',
      '**/test/out/**',
      'docs/languages.md',
      'docs/themes.md',
      '**/vendor/**',
    ],
  },
  {
    rules: {
      'no-restricted-syntax': 'off',
      'ts/no-invalid-this': 'off',
    },
  },
)
