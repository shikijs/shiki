// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    pnpm: true,
    formatters: {
      html: false,
      markdown: true,
      css: true,
    },
    markdown: {
      overrides: {
        'unicorn/prefer-node-protocol': 'off',
        'import/first': 'off',
        'ts/explicit-function-return-type': 'off',
        'import/no-duplicates': 'off',
      },
    },
    vue: {
      overrides: {
        'ts/explicit-function-return-type': 'off',
      },
    },
    ignores: [
      '**/fixtures/**',
      '**/vendor/**',
      '**/test/out/**',
      'docs/languages.md',
      'docs/themes.md',
      // Generated Files
      'packages/shiki/src/langs/**',
      'packages/shiki/src/themes/**',
      'packages/shiki/src/langs-bundle-full.ts',
      'packages/shiki/src/langs-bundle-web.ts',
      'packages/shiki/src/themes.ts',
    ],
  },
  {
    rules: {
      'no-restricted-syntax': 'off',
      'ts/no-invalid-this': 'off',
    },
  },
  {
    files: ['docs/**/*.([cm])?[jt]s(x)?'],
    rules: {
      'ts/explicit-function-return-type': 'off',
    },
  },
  {
    files: [
      'packages/shiki/**/*.ts',
      'packages/core/**/*.ts',
      'packages/engine-javascript/**/*.ts',
      'packages/engine-oniguruma/**/*.ts',
    ],
    ignores: [
      '**/*.test.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'shiki',
            },
          ],
        },
      ],
    },
  },
)
