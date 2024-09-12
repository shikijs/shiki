// @ts-check
import { basename, dirname, join } from 'node:path'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { defineConfig } from 'rollup'
import copy from 'rollup-plugin-copy'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const entries = [
  'src/index.ts',
  'src/core.ts',
  'src/core-unwasm.ts',
  'src/types.ts',
  'src/themes.ts',
  'src/langs.ts',
  'src/wasm.ts',
  'src/bundle-full.ts',
  'src/bundle-web.ts',
  'src/theme-css-variables.ts',
  'src/engine-javascript.ts',
  'src/engine-oniguruma.ts',
  'src/textmate.ts',
]

const external = [
  '@shikijs/types',
  '@shikijs/core',
  '@shikijs/core/wasm-inlined',
  '@shikijs/core/types',
  '@shikijs/engine-javascript',
  '@shikijs/engine-oniguruma',
  '@shikijs/vscode-textmate',
  'shiki/wasm',
]

const plugins = [
  esbuild(),
  nodeResolve(),
  commonjs(),
  json({
    namedExports: false,
    preferConst: true,
    compact: true,
  }),
]

export default defineConfig([
  {
    input: [
      ...entries,
      // add language files entries
      ...fg.sync('src/assets/langs/*.js'),
    ],
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: (f) => {
        if (f.facadeModuleId?.match(/[\\/]langs[\\/]/))
          return `langs/${f.name}.mjs`
        return '[name].mjs'
      },
      chunkFileNames: (f) => {
        if (f.moduleIds.some(i => i.match(/[\\/]langs[\\/]/)))
          return `langs/${f.name}.mjs`
        else if (f.moduleIds.some(i => i.match(/[\\/]themes[\\/]/)))
          return 'themes/[name].mjs'
        return 'chunks/[name].mjs'
      },
    },
    plugins: [
      ...plugins,
    ],
    external,
  },
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'esm',
      chunkFileNames: 'types/[name].d.mts',
      entryFileNames: f => `${f.name.replace(/src[\\/]/, '')}.d.mts`,
    },
    plugins: [
      dts({
        respectExternal: true,
      }),
      copy({
        targets: [{ src: './node_modules/vscode-oniguruma/release/onig.wasm', dest: 'dist' }],
      }),
      {
        name: 'post',
        async buildEnd() {
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
            )),
          )
        },
      },
    ],
    external,
    onwarn: (warning, warn) => {
      if (!/Circular|an empty chunk/.test(warning.message))
        warn(warning)
    },
  },
])
