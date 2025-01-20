// @ts-check
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'fs-extra'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const entries = [
  'src/index.ts',
  'src/wasm-inlined.ts',
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
  wasmPlugin(),
]

const external = [
  'hast',
]

export default defineConfig([
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
      chunkFileNames: () => {
        return 'chunks-[name].mjs'
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
      chunkFileNames: 'chunk-[name].d.mts',
      entryFileNames: f => `${f.name.replace(/src[\\/]/, '')}.d.mts`,
    },
    plugins: [
      dts({
        respectExternal: true,
      }),
      {
        name: 'post',
        async buildEnd() {
          await fs.writeFile('dist/onig.d.mts', 'declare const binary: ArrayBuffer; export default binary;', 'utf-8')
        },
      },
    ],
    onwarn: (warning, warn) => {
      if (!/Circular|an empty chunk/.test(warning.message))
        warn(warning)
    },
    external,
  },
])

/**
 * @returns {import('rollup').Plugin} Plugin
 */
export function wasmPlugin() {
  return {
    name: 'wasm',
    async load(id) {
      if (!id.endsWith('.wasm'))
        return
      const binary = await fs.readFile(id)
      const base64 = binary.toString('base64')
      return `export default Uint8Array.from(atob(${JSON.stringify(base64)}), c => c.charCodeAt(0))`
    },
  }
}
