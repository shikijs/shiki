# Nuxt

[Nuxt](https://nuxt.com) is a general-purpose meta-framework that gives you full control over your application. You can install Shiki along with integrations like ([markdown-it](/packages/markdown-it), [rehype](/packages/rehype)) or import manually as you needed.

On top of that, Nuxt also provide some module integrations for Shiki allowing you use it easier:

- [`nuxt-shiki`](https://github.com/pi0/nuxt-shiki) - Shiki integration for client and server sides, with component usage.
- [`@nuxt/content`](https://github.com/nuxt/content) - Nuxt Content has Shiki built-in for markdown files. [You can enable it with the `highlight` option](https://content.nuxt.com/get-started/configuration#highlight).
  - [`@nuxtjs/mdc`](https://github.com/nuxt-modules/mdc) - The underlying module of `@nuxt/content` that provides Markdown Component (MDC) syntax as well as Shiki for syntax highlighting.

## TwoSlash Integration

- [`nuxt-content-twoslash`](https://github.com/antfu/nuxt-content-twoslash) - A Nuxt module that adds Twoslash support to Nuxt Content. Twoslash information are evaluated at build time.
