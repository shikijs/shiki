// @ts-check
import { basename, dirname, join } from 'node:path'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import fs from 'fs-extra'
import fg from 'fast-glob'

const entries = [
  'src/index.ts',
  'src/core.ts',
  'src/types.ts',
  'src/themes.ts',
  'src/langs.ts',
  'src/wasm.ts',
]

const external = [
  'shikiji-core',
  'shikiji-core/wasm',
  'shikiji-core/types',
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
    input: entries,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
      chunkFileNames: (f) => {
        if (f.moduleIds.some(i => i.match(/[\\\/]langs[\\\/]/)))
          return `langs/${f.name.replace('.tmLanguage', '')}.mjs`
        else if (f.moduleIds.some(i => i.match(/[\\\/]themes[\\\/]/)))
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
      entryFileNames: f => `${f.name.replace(/src[\\\/]/, '')}.d.mts`,
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
              'import { LanguageRegistration } from \'../types.mjs\';declare const reg: LanguageRegistration[];export default reg',
              'utf-8',
            )),
          )
          const themes = await fg('dist/themes/*.mjs', { absolute: true })
          await Promise.all(
            themes.map(file => fs.writeFile(
              join(dirname(file), `${basename(file, '.mjs')}.d.mts`),
              'import { ThemeRegistrationRaw } from \'../types.mjs\';declare const reg: ThemeRegistrationRaw;export default reg',
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
