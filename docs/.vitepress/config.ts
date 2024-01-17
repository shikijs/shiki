import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { bundledThemes } from 'shikiji'
import { transformerMetaWordHighlight, transformerNotationWordHighlight } from '../../packages/shikiji-transformers/src'
import { defaultHoverInfoProcessor, transformerTwoslash } from '../../packages/vitepress-plugin-twoslash/src/index'
import { version } from '../../package.json'
import vite from './vite.config'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/' },
  { text: 'Installation', link: '/guide/install' },
  { text: 'Bundles', link: '/guide/bundles' },
  { text: 'Dual Themes', link: '/guide/dual-themes' },
  { text: 'Transformers', link: '/guide/transformers' },
  { text: 'Theme Colors Manipulation', link: '/guide/theme-colors' },
  { text: 'Compatibly Build', link: '/guide/compat' },
  { text: 'Custom Themes', link: '/guide/load-theme' },
  { text: 'Custom Languages', link: '/guide/load-lang' },
]

const REFERENCES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Themes', link: '/themes' },
  { text: 'Languages', link: '/languages' },
]

const INTEGRATIONS: DefaultTheme.NavItemWithLink[] = [
  { text: 'TypeScript Twoslash', link: '/packages/twoslash' },
  { text: 'Markdown It', link: '/packages/markdown-it' },
  { text: 'Rehype', link: '/packages/rehype' },
  { text: 'Monaco Editor', link: '/packages/monaco' },
  { text: 'VitePress', link: '/packages/vitepress' },
  { text: 'Astro', link: '/packages/astro' },
  { text: 'Common Transformers', link: '/packages/transformers' },
  { text: 'CLI', link: '/packages/cli' },
]

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: 'https://github.com/antfu/shikiji/releases' },
  { text: `Contributing`, link: 'https://github.com/antfu/shikiji/blob/main/CONTRIBUTING.md' },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Shikiji',
  description: 'A beautiful and powerful syntax highlighter',
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    async shikijiSetup(shikiji) {
      await Promise.all(Object.keys(bundledThemes).map(async (theme) => {
        await shikiji.loadTheme(theme as any)
      }))
    },
    codeTransformers: [
      transformerMetaWordHighlight(),
      transformerNotationWordHighlight(),
      {
        // Render custom themes with codeblocks
        name: 'shikiji:inline-theme',
        preprocess(code, options) {
          const reg = /\btheme:([\w,-]+)\b/
          const match = options.meta?.__raw?.match(reg)
          if (!match?.[1])
            return
          const theme = match[1]
          const themes = theme.split(',').map(i => i.trim())
          if (!themes.length)
            return
          if (themes.length === 1) {
            // @ts-expect-error anyway
            delete options.themes
            // @ts-expect-error anyway
            options.theme = themes[0]
          }
          else if (themes.length === 2) {
            // @ts-expect-error anyway
            delete options.theme
            // @ts-expect-error anyway
            options.themes = {
              light: themes[0],
              dark: themes[1],
            }
          }
          else {
            throw new Error(`Only 1 or 2 themes are supported, got ${themes.length}`)
          }
          return code
        },
      },
      transformerTwoslash({
        processHoverInfo(info) {
          return defaultHoverInfoProcessor(info)
            // Remove shikiji_core namespace
            .replace(/shikiji_core\./g, '')
            // Remove member access
            .replace(/^[a-zA-Z0-9_]*(\<[^\>]*\>)?\./, '')
        },
      }),
      {
        name: 'shikiji:remove-escape',
        postprocess(code) {
          return code.replace(/\[\\\!code/g, '[!code')
        },
      },
    ],
  },

  cleanUrls: true,
  vite,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      {
        text: 'Guide',
        items: [
          {
            items: GUIDES,
          },
        ],
      },
      {
        text: 'Integrations',
        items: INTEGRATIONS,
      },
      {
        text: 'References',
        items: REFERENCES,
      },
      // {
      //   text: 'Play',
      //   link: '/play',
      // },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],

    sidebar: Object.assign(
      {},
      {
        '/': [
          {
            text: 'Guide',
            items: GUIDES,
          },
          {
            text: 'Integrations',
            items: INTEGRATIONS,
          },
          {
            text: 'References',
            items: REFERENCES,
          },
        ],
      },
    ),

    editLink: {
      pattern: 'https://github.com/antfu/shikiji/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/antfu/shikiji' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021 Pine Wu, 2023-PRESENT Anthony Fu.',
    },
  },

  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Pine Wu, Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'Shikiji' }],
    ['meta', { property: 'og:image', content: 'https://shikiji.netlify.app/og.png' }],
    ['meta', { property: 'og:description', content: 'A beautiful and powerful syntax highlighter' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://shikiji.netlify.app/og.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
