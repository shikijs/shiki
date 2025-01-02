import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'

const plugins = [
  resolve(),
  esbuild({
    minify: true,
    target: 'esnext',
  }),
]

export default [
  {
    input: 'index-wasm.ts',
    output: {
      file: 'dist/index-wasm.min.mjs',
      format: 'es',
      inlineDynamicImports: true,
    },
    plugins,
  },
  {
    input: 'index-lite.ts',
    output: {
      file: 'dist/index-lite.min.mjs',
      format: 'es',
      inlineDynamicImports: true,
    },
    plugins,
  },
]
