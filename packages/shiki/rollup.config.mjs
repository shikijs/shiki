//@ts-check

// Re: https://github.com/rollup/plugins/issues/1366
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
global['__filename'] = __filename;

import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import copy from 'rollup-plugin-copy'
import terser from '@rollup/plugin-terser'
import rollupReplace from '@rollup/plugin-replace'
import { defineConfig } from 'rollup'
import { resolve } from 'path'
import { readFileSync } from 'fs'



const replace = opts => {
  return rollupReplace({
    ...opts,
    preventAssignment: true
  })
}

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

const external = ['vscode-oniguruma', 'vscode-textmate']
const globals = {
  'vscode-oniguruma': 'vscode-oniguruma',
  'vscode-textmate': 'vscode-textmate'
}

export default defineConfig([
  {
    input: 'src/index.ts',
    external,
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs'
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm'
      }
    ],
    plugins: [
      replace({
        __CDN_ROOT__: '',
        __BROWSER__: JSON.stringify(false)
      }),
      esbuild(),
      nodeResolve(),
      commonjs()
    ]
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.browser.mjs',
      format: 'esm',
      globals
    },
    plugins: [
      replace({
        __BROWSER__: JSON.stringify(true),
        __CDN_ROOT__: ''
      }),
      esbuild(),
      nodeResolve(),
      commonjs(),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.unpkg.iife.js',
      format: 'iife',
      name: 'shiki',
      extend: true,
      globals
    },
    plugins: [
      replace({
        __BROWSER__: JSON.stringify(true),
        __CDN_ROOT__: `https://unpkg.com/shiki@${pkg.version}/`
      }),
      esbuild(),
      nodeResolve(),
      commonjs(),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.jsdelivr.iife.js',
      format: 'iife',
      name: 'shiki',
      extend: true,
      globals
    },
    plugins: [
      replace({
        __BROWSER__: JSON.stringify(true),
        __CDN_ROOT__: `https://cdn.jsdelivr.net/npm/shiki@${pkg.version}/`
      }),
      esbuild(),
      nodeResolve(),
      commonjs(),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es'
      }
    ],
    plugins: [
      dts(),
      copy({
        targets: [{ src: resolve('node_modules/vscode-oniguruma/release/onig.wasm'), dest: 'dist' }]
      })
    ],
    onwarn: (warning, warn) => {
      if (!/Circular/.test(warning.message)) {
        warn(warning)
      }
    }
  }
])
