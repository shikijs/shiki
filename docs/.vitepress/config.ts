import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { bundledThemes } from 'shiki'

// @ts-expect-error missing types
import { withMermaid } from 'vitepress-plugin-mermaid'
import { transformerMetaWordHighlight, transformerNotationWordHighlight, transformerRemoveNotationEscape } from '../../packages/transformers/src'
import { defaultHoverInfoProcessor, transformerTwoslash } from '../../packages/vitepress-twoslash/src/index'
import { version } from '../../package.json'
import vite from './vite.config'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/' },
  { text: 'Installation', link: '/guide/install' },
  { text: 'Bundles', link: '/guide/bundles' },
  { text: 'Dual Themes', link: '/guide/dual-themes' },
  { text: 'Decorations', link: '/guide/decorations' },
  { text: 'Transformers', link: '/guide/transformers' },
  { text: 'Theme Colors Manipulation', link: '/guide/theme-colors' },
  { text: 'Migration', link: '/guide/migrate' },
  { text: 'Compatibility Build', link: '/guide/compat' },
  { text: 'Custom Themes', link: '/guide/load-theme' },
  { text: 'Custom Languages', link: '/guide/load-lang' },
]

const REFERENCES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Themes', link: '/themes' },
  { text: 'Languages', link: '/languages' },
]

const INTEGRATIONS: DefaultTheme.NavItemWithLink[] = [
  { text: 'TypeScript Twoslash', link: '/packages/twoslash' },
  { text: 'markdown-it', link: '/packages/markdown-it' },
  { text: 'Rehype', link: '/packages/rehype' },
  { text: 'Monaco Editor', link: '/packages/monaco' },
  { text: 'VitePress', link: '/packages/vitepress' },
  { text: 'Nuxt', link: '/packages/nuxt' },
  { text: 'Next', link: '/packages/next' },
  { text: 'Astro', link: '/packages/astro' },
  { text: 'Common Transformers', link: '/packages/transformers' },
  { text: 'CLI', link: '/packages/cli' },
]

const VERSIONS: (DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: 'https://github.com/shikijs/shiki/releases' },
  { text: `Contributing`, link: 'https://github.com/shikijs/shiki/blob/main/CONTRIBUTING.md' },
  {
    items: [
      { text: 'Migration from v0.14', link: '/guide/migrate#migrate-from-v0-14' },
      { text: 'Migration from Shikiji', link: '/guide/migrate#migrate-from-shikiji' },
    ],
  },
]

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: 'Shiki',
  description: 'A beautiful and powerful syntax highlighter',
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    async shikiSetup(shiki) {
      await shiki.loadTheme(...Object.keys(bundledThemes) as any)
    },
    codeTransformers: [
      transformerMetaWordHighlight(),
      transformerNotationWordHighlight(),
      {
        // Render custom themes with codeblocks
        name: 'shiki:inline-theme',
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
      {
        name: 'shiki:inline-decorations',
        preprocess(code, options) {
          const reg = /^\/\/ @decorations:(.*)\n/
          code = code.replace(reg, (match, decorations) => {
            options.decorations ||= []
            options.decorations.push(...JSON.parse(decorations))
            return ''
          })
          return code
        },
      },
      transformerTwoslash({
        // errorRendering: 'hover',
        processHoverInfo(info) {
          return defaultHoverInfoProcessor(info)
            // Remove shiki_core namespace
            .replace(/_shikijs_core\w*\./g, '')
        },
      }),
      transformerRemoveNotationEscape(),
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
      pattern: 'https://github.com/shikijs/shiki/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shikijs/shiki' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021 Pine Wu, 2023-PRESENT Anthony Fu.',
    },
  },

  locales: {
    root: {
      label: 'English',
    },
    zh: {
      label: '简体中文 (Community)',
      link: 'https://shiki.tmrs.site',
    },
  },

  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Pine Wu, Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'Shiki' }],
    ['meta', { property: 'og:image', content: 'https://shiki.style/og.png' }],
    ['meta', { property: 'og:description', content: 'A beautiful yet powerful syntax highlighter' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://shiki.style/og.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
}))
