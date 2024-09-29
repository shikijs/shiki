// Generated by scripts/prepare.ts
import type { BundledLanguageInfo, DynamicImportLanguageRegistration } from '@shikijs/core'

export const bundledLanguagesInfo: BundledLanguageInfo[] = [
  {
    id: 'angular-html',
    name: 'Angular HTML',
    import: (() => import('./langs/angular-html.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'angular-ts',
    name: 'Angular TypeScript',
    import: (() => import('./langs/angular-ts.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'astro',
    name: 'Astro',
    import: (() => import('./langs/astro.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'blade',
    name: 'Blade',
    import: (() => import('./langs/blade.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'c',
    name: 'C',
    import: (() => import('./langs/c.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'coffee',
    name: 'CoffeeScript',
    aliases: [
      'coffeescript',
    ],
    import: (() => import('./langs/coffee.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'cpp',
    name: 'C++',
    aliases: [
      'c++',
    ],
    import: (() => import('./langs/cpp.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'css',
    name: 'CSS',
    import: (() => import('./langs/css.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'glsl',
    name: 'GLSL',
    import: (() => import('./langs/glsl.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    aliases: [
      'gql',
    ],
    import: (() => import('./langs/graphql.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'haml',
    name: 'Ruby Haml',
    import: (() => import('./langs/haml.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'handlebars',
    name: 'Handlebars',
    aliases: [
      'hbs',
    ],
    import: (() => import('./langs/handlebars.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'html',
    name: 'HTML',
    import: (() => import('./langs/html.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'html-derivative',
    name: 'HTML (Derivative)',
    import: (() => import('./langs/html-derivative.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'http',
    name: 'HTTP',
    import: (() => import('./langs/http.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'imba',
    name: 'Imba',
    import: (() => import('./langs/imba.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'java',
    name: 'Java',
    import: (() => import('./langs/java.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    aliases: [
      'js',
    ],
    import: (() => import('./langs/javascript.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'jinja',
    name: 'Jinja',
    import: (() => import('./langs/jinja.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'jison',
    name: 'Jison',
    import: (() => import('./langs/jison.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'json',
    name: 'JSON',
    import: (() => import('./langs/json.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'jsonc',
    name: 'JSON with Comments',
    import: (() => import('./langs/jsonc.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'jsonl',
    name: 'JSON Lines',
    import: (() => import('./langs/jsonl.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'jsx',
    name: 'JSX',
    import: (() => import('./langs/jsx.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'julia',
    name: 'Julia',
    aliases: [
      'jl',
    ],
    import: (() => import('./langs/julia.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'less',
    name: 'Less',
    import: (() => import('./langs/less.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'markdown',
    name: 'Markdown',
    aliases: [
      'md',
    ],
    import: (() => import('./langs/markdown.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'marko',
    name: 'Marko',
    import: (() => import('./langs/marko.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'mdc',
    name: 'MDC',
    import: (() => import('./langs/mdc.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'mdx',
    name: 'MDX',
    import: (() => import('./langs/mdx.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'php',
    name: 'PHP',
    import: (() => import('./langs/php.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'postcss',
    name: 'PostCSS',
    import: (() => import('./langs/postcss.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'pug',
    name: 'Pug',
    aliases: [
      'jade',
    ],
    import: (() => import('./langs/pug.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'python',
    name: 'Python',
    aliases: [
      'py',
    ],
    import: (() => import('./langs/python.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'r',
    name: 'R',
    import: (() => import('./langs/r.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'regexp',
    name: 'RegExp',
    aliases: [
      'regex',
    ],
    import: (() => import('./langs/regexp.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'sass',
    name: 'Sass',
    import: (() => import('./langs/sass.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'scss',
    name: 'SCSS',
    import: (() => import('./langs/scss.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'shellscript',
    name: 'Shell',
    aliases: [
      'bash',
      'sh',
      'shell',
      'zsh',
    ],
    import: (() => import('./langs/shellscript.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'sql',
    name: 'SQL',
    import: (() => import('./langs/sql.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'stylus',
    name: 'Stylus',
    aliases: [
      'styl',
    ],
    import: (() => import('./langs/stylus.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'svelte',
    name: 'Svelte',
    import: (() => import('./langs/svelte.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'ts-tags',
    name: 'TypeScript with Tags',
    aliases: [
      'lit',
    ],
    import: (() => import('./langs/ts-tags.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'tsx',
    name: 'TSX',
    import: (() => import('./langs/tsx.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    aliases: [
      'ts',
    ],
    import: (() => import('./langs/typescript.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'vue',
    name: 'Vue',
    import: (() => import('./langs/vue.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'vue-html',
    name: 'Vue HTML',
    import: (() => import('./langs/vue-html.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'wasm',
    name: 'WebAssembly',
    import: (() => import('./langs/wasm.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'wgsl',
    name: 'WGSL',
    import: (() => import('./langs/wgsl.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'xml',
    name: 'XML',
    import: (() => import('./langs/xml.mjs')) as DynamicImportLanguageRegistration,
  },
  {
    id: 'yaml',
    name: 'YAML',
    aliases: [
      'yml',
    ],
    import: (() => import('./langs/yaml.mjs')) as DynamicImportLanguageRegistration,
  },
]

export const bundledLanguagesBase = Object.fromEntries(bundledLanguagesInfo.map(i => [i.id, i.import]))

export const bundledLanguagesAlias = Object.fromEntries(bundledLanguagesInfo.flatMap(i => i.aliases?.map(a => [a, i.import]) || []))

export type BundledLanguage =
  | 'angular-html'
  | 'angular-ts'
  | 'astro'
  | 'bash'
  | 'blade'
  | 'c'
  | 'c++'
  | 'coffee'
  | 'coffeescript'
  | 'cpp'
  | 'css'
  | 'glsl'
  | 'gql'
  | 'graphql'
  | 'haml'
  | 'handlebars'
  | 'hbs'
  | 'html'
  | 'html-derivative'
  | 'http'
  | 'imba'
  | 'jade'
  | 'java'
  | 'javascript'
  | 'jinja'
  | 'jison'
  | 'jl'
  | 'js'
  | 'json'
  | 'jsonc'
  | 'jsonl'
  | 'jsx'
  | 'julia'
  | 'less'
  | 'lit'
  | 'markdown'
  | 'marko'
  | 'md'
  | 'mdc'
  | 'mdx'
  | 'php'
  | 'postcss'
  | 'pug'
  | 'py'
  | 'python'
  | 'r'
  | 'regex'
  | 'regexp'
  | 'sass'
  | 'scss'
  | 'sh'
  | 'shell'
  | 'shellscript'
  | 'sql'
  | 'styl'
  | 'stylus'
  | 'svelte'
  | 'ts'
  | 'ts-tags'
  | 'tsx'
  | 'typescript'
  | 'vue'
  | 'vue-html'
  | 'wasm'
  | 'wgsl'
  | 'xml'
  | 'yaml'
  | 'yml'
  | 'zsh'

export const bundledLanguages = {
  ...bundledLanguagesBase,
  ...bundledLanguagesAlias,
} as Record<BundledLanguage, DynamicImportLanguageRegistration>
