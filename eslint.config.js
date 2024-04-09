// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: {
      html: false,
      markdown: true,
      css: true,
    },
    markdown: {
      overrides: {
        'unicorn/prefer-node-protocol': 'off',
        'import/first': 'off',
      },
    },
    ignores: [
      'packages/shiki/src/assets/*.ts',
      '**/fixtures/**',
      '**/vendor/**',
      '**/test/out/**',
      'docs/languages.md',
      'docs/themes.md',
    ],
  },
  {
    rules: {
      'no-restricted-syntax': 'off',
      'ts/no-invalid-this': 'off',
    },
  },
)
