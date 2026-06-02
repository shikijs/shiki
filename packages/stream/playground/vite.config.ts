import { fileURLToPath } from 'node:url'
import React from '@vitejs/plugin-react'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import Solid from 'vite-plugin-solid'

export default defineConfig({
  resolve: {
    alias: {
      '@shikijs/stream/vue': fileURLToPath(new URL('../src/vue/index.ts', import.meta.url)),
      '@shikijs/stream/react': fileURLToPath(new URL('../src/react/index.ts', import.meta.url)),
      '@shikijs/stream/solid': fileURLToPath(new URL('../src/solid/index.ts', import.meta.url)),
      '@shikijs/stream': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
  plugins: [
    Vue(),
    UnoCSS(),
    Solid({ include: ['src/renderer/solid.tsx', '../src/solid/**'] }),
    React({ include: ['src/renderer/react.tsx', '../src/react/**'] }),
  ],
})
