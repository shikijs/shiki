import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace'
import { version } from './package.json'

const external = ['onigasm', 'vscode-textmate']

export default [
  {
    input: 'src/index.ts',
    external,
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs'
      },
      {
        file: 'dist/index.mjs',
        format: 'esm'
      }
    ],
    plugins: [typescript(), nodeResolve(), commonjs()]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.iife.js',
        format: 'iife',
        name: 'Shiki',
        plugins: [
          replace({
            __CDN_ROOT__: ''
          })
        ]
      },
      {
        file: 'dist/index.unpkg.iife.js',
        format: 'iife',
        name: 'Shiki',
        plugins: [
          replace({
            __CDN_ROOT__: `https://unpkg.com/@antfu/shiki@${version}/`
          })
        ]
      },
      {
        file: 'dist/index.jsdelivr.iife.js',
        format: 'iife',
        name: 'Shiki',
        plugins: [
          replace({
            __CDN_ROOT__: `https://cdn.jsdelivr.net/npm/@antfu/shiki@${version}/`
          })
        ]
      }
    ],
    plugins: [typescript(), nodeResolve(), commonjs()]
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
        targets: [{ src: '../../node_modules/onigasm/lib/onigasm.wasm', dest: 'dist' }]
      })
    ]
  }
]
