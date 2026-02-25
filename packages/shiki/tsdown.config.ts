import fs from 'node:fs/promises'
import fg from 'fast-glob'
import { basename, dirname, join } from 'pathe'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core.ts',
    'src/core-unwasm.ts',
    'src/types.ts',
    'src/themes.ts',
    'src/langs.ts',
    'src/wasm.ts',
    'src/bundle-full.ts',
    'src/bundle-web.ts',
    'src/engine-javascript.ts',
    'src/engine-oniguruma.ts',
    'src/textmate.ts',
  ],
  external: [
    'shiki/wasm',
    '@shikijs/types',
    'hast',
    /^@shikijs[/\\].*/,
    /[/\\](langs|themes)[/\\]/,
  ],
  dts: true,
  clean: true,
  hooks: {
    'build:done': async () => {
      await fs.cp('./src/langs', './dist/langs', { recursive: true })
      await fs.cp('./src/themes', './dist/themes', { recursive: true })

      await fs.copyFile(
        './node_modules/vscode-oniguruma/release/onig.wasm',
        './dist/onig.wasm',
      )

      await fs.writeFile('dist/onig.d.mts', 'declare const binary: ArrayBuffer; export default binary;', 'utf-8')
      const langs = await fg('dist/langs/*.mjs', { absolute: true })
      await Promise.all(
        langs.map(file => fs.writeFile(
          join(dirname(file), `${basename(file, '.mjs')}.d.mts`),
          'import { LanguageRegistration } from \'@shikijs/core\';declare const reg: LanguageRegistration[];export default reg',
          'utf-8',
        )),
      )
      const themes = await fg('dist/themes/*.mjs', { absolute: true })
      await Promise.all(
        themes.map(file => fs.writeFile(
          join(dirname(file), `${basename(file, '.mjs')}.d.mts`),
          'import { ThemeRegistrationRaw } from \'@shikijs/core\';declare const reg: ThemeRegistrationRaw;export default reg',
          'utf-8',
        ),
        ),
      )
    },
  },
})
