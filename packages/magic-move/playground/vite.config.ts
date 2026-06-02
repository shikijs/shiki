import { fileURLToPath } from 'node:url'
import { svelte as Svelte } from '@sveltejs/vite-plugin-svelte'
import React from '@vitejs/plugin-react'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import Solid from 'vite-plugin-solid'

export default defineConfig({
  resolve: {
    alias: {
      '@shikijs/magic-move/core': fileURLToPath(new URL('../src/core.ts', import.meta.url)),
      '@shikijs/magic-move/renderer': fileURLToPath(new URL('../src/renderer.ts', import.meta.url)),
      '@shikijs/magic-move/types': fileURLToPath(new URL('../src/types.ts', import.meta.url)),
      '@shikijs/magic-move/vue': fileURLToPath(new URL('../src/vue/index.ts', import.meta.url)),
      '@shikijs/magic-move/react': fileURLToPath(new URL('../src/react/index.ts', import.meta.url)),
      '@shikijs/magic-move/solid': fileURLToPath(new URL('../src/solid/index.ts', import.meta.url)),
      '@shikijs/magic-move/svelte': fileURLToPath(new URL('../src/svelte/index.ts', import.meta.url)),
    },
  },
  plugins: [
    Vue(),
    UnoCSS(),
    Svelte(),
    Solid({ include: ['src/renderer/solid.tsx', '../src/solid/**'] }),
    React({ include: ['src/renderer/react.tsx', '../src/react/**'] }),
  ],
})
