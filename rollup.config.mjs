// @ts-check
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import { defineConfig } from 'rollup'
import { wasmPlugin } from './build/wasm.mjs'

const plugins = [
  esbuild(),
  nodeResolve(),
  commonjs(),
  json({
    namedExports: false,
    preferConst: true,
    compact: true,
  }),
  wasmPlugin,
]

export default defineConfig([
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
      chunkFileNames: (f) => {
        if (f.moduleIds.some(i => i.includes('/languages')))
          return `languages/${f.name.replace('.tmLanguage', '')}.mjs`
        else if (f.moduleIds.some(i => i.includes('/themes')))
          return 'themes/[name].mjs'
        return '[name].mjs'
      },
    },
    plugins: [
      ...plugins,
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [
      dts({
        respectExternal: true,
      }),
      copy({
        targets: [{ src: './node_modules/vscode-oniguruma/release/onig.wasm', dest: 'dist' }],
      }),
    ],
    onwarn: (warning, warn) => {
      if (!/Circular/.test(warning.message))
        warn(warning)
    },
  },
])
