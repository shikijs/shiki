//@ts-check
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import rollupReplace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

const replace = opts => {
  return rollupReplace({
    ...opts,
    preventAssignment: true
  })
}

const external = ['shiki']

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
    plugins: [
      replace({
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
    output: [
      {
        file: 'dist/index.iife.js',
        format: 'iife',
        extend: true,
        name: 'shiki'
      },
      {
        file: 'dist/index.iife.min.js',
        format: 'iife',
        extend: true,
        name: 'shiki',
        plugins: [terser()]
      },
      {
        file: 'dist/index.browser.mjs',
        format: 'esm'
      }
    ],
    plugins: [
      replace({
        __BROWSER__: JSON.stringify(true)
      }),
      esbuild(),
      nodeResolve(),
      commonjs()
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
    plugins: [dts()]
  }
]
