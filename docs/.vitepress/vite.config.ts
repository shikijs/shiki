import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Tsconfig from 'vite-tsconfig-paths'
import { groupIconVitePlugin as GroupIconVitePlugin } from 'vitepress-plugin-group-icons'

export default defineConfig({
  plugins: [
    Tsconfig({
      projects: [
        fileURLToPath(new URL('../../tsconfig.json', import.meta.url)),
      ],
    }),
    Components({
      dirs: [
        fileURLToPath(new URL('./components', import.meta.url)),
      ],
      dts: fileURLToPath(new URL('../components.d.ts', import.meta.url)),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      extensions: ['vue', 'md'],
    }),
    UnoCSS(
      fileURLToPath(new URL('./uno.config.ts', import.meta.url)),
    ),
    GroupIconVitePlugin({
      customIcon: {
        vitepress: 'https://vitepress.dev/vitepress-logo-mini.svg',
      },
    }),
  ],
})
