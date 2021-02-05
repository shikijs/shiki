import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
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
        file: 'dist/index.esm.js',
        format: 'esm'
      }
    ],
    plugins: [
      replace({
        __CDN_ROOT__: '',
        __BROWSER__: JSON.stringify(false)
      }),
      typescript(),
      nodeResolve(),
      commonjs()
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.browser.mjs',
        format: 'esm',
        plugins: [
          replace({
            __CDN_ROOT__: ''
          })
        ]
      },
      {
        file: 'dist/index.iife.js',
        format: 'iife',
        name: 'shiki',
        extend: true,
        plugins: [
          replace({
            __CDN_ROOT__: ''
          })
        ]
      },
      {
        file: 'dist/index.unpkg.iife.js',
        format: 'iife',
        name: 'shiki',
        extend: true,
        plugins: [
          replace({
            __CDN_ROOT__: `https://unpkg.com/shiki@${version}/`
          })
        ]
      },
      {
        file: 'dist/index.jsdelivr.iife.js',
        format: 'iife',
        name: 'shiki',
        extend: true,
        plugins: [
          replace({
            __CDN_ROOT__: `https://cdn.jsdelivr.net/npm/shiki@${version}/`
          })
        ]
      }
    ],
    plugins: [
      replace({
        __BROWSER__: JSON.stringify(true)
      }),
      typescript(),
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
        targets: [{ src: '../../node_modules/onigasm/lib/onigasm.wasm', dest: 'dist' }]
      })
    ],
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }
]
