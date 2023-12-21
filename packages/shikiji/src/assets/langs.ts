/**
 * Generated by scripts/prepare.ts
 */
import type { LanguageRegistration } from 'shikiji-core'

type DynamicLangReg = () => Promise<{ default: LanguageRegistration[] }>

export interface BundledLanguageInfo {
  id: string
  name: string
  import: DynamicLangReg
  aliases?: string[]
}

export const bundledLanguagesInfo: BundledLanguageInfo[] = [
  {
    'id': 'abap',
    'name': 'ABAP',
    'import': (() => import('./langs/abap')) as DynamicLangReg
  },
  {
    'id': 'actionscript-3',
    'name': 'ActionScript',
    'import': (() => import('./langs/actionscript-3')) as DynamicLangReg
  },
  {
    'id': 'ada',
    'name': 'Ada',
    'import': (() => import('./langs/ada')) as DynamicLangReg
  },
  {
    'id': 'apache',
    'name': 'Apache Conf',
    'import': (() => import('./langs/apache')) as DynamicLangReg
  },
  {
    'id': 'apex',
    'name': 'Apex',
    'import': (() => import('./langs/apex')) as DynamicLangReg
  },
  {
    'id': 'apl',
    'name': 'APL',
    'import': (() => import('./langs/apl')) as DynamicLangReg
  },
  {
    'id': 'applescript',
    'name': 'AppleScript',
    'import': (() => import('./langs/applescript')) as DynamicLangReg
  },
  {
    'id': 'ara',
    'name': 'Ara',
    'import': (() => import('./langs/ara')) as DynamicLangReg
  },
  {
    'id': 'asm',
    'name': 'Assembly',
    'import': (() => import('./langs/asm')) as DynamicLangReg
  },
  {
    'id': 'astro',
    'name': 'Astro',
    'import': (() => import('./langs/astro')) as DynamicLangReg
  },
  {
    'id': 'awk',
    'name': 'AWK',
    'import': (() => import('./langs/awk')) as DynamicLangReg
  },
  {
    'id': 'ballerina',
    'name': 'Ballerina',
    'import': (() => import('./langs/ballerina')) as DynamicLangReg
  },
  {
    'id': 'bat',
    'name': 'Batch File',
    'aliases': [
      'batch'
    ],
    'import': (() => import('./langs/bat')) as DynamicLangReg
  },
  {
    'id': 'beancount',
    'name': 'Beancount',
    'import': (() => import('./langs/beancount')) as DynamicLangReg
  },
  {
    'id': 'berry',
    'name': 'Berry',
    'aliases': [
      'be'
    ],
    'import': (() => import('./langs/berry')) as DynamicLangReg
  },
  {
    'id': 'bibtex',
    'name': 'BibTeX',
    'import': (() => import('./langs/bibtex')) as DynamicLangReg
  },
  {
    'id': 'bicep',
    'name': 'Bicep',
    'import': (() => import('./langs/bicep')) as DynamicLangReg
  },
  {
    'id': 'blade',
    'name': 'Blade',
    'import': (() => import('./langs/blade')) as DynamicLangReg
  },
  {
    'id': 'c',
    'name': 'C',
    'import': (() => import('./langs/c')) as DynamicLangReg
  },
  {
    'id': 'cadence',
    'name': 'Cadence',
    'aliases': [
      'cdc'
    ],
    'import': (() => import('./langs/cadence')) as DynamicLangReg
  },
  {
    'id': 'clarity',
    'name': 'Clarity',
    'import': (() => import('./langs/clarity')) as DynamicLangReg
  },
  {
    'id': 'clojure',
    'name': 'Clojure',
    'aliases': [
      'clj'
    ],
    'import': (() => import('./langs/clojure')) as DynamicLangReg
  },
  {
    'id': 'cmake',
    'name': 'CMake',
    'import': (() => import('./langs/cmake')) as DynamicLangReg
  },
  {
    'id': 'cobol',
    'name': 'COBOL',
    'import': (() => import('./langs/cobol')) as DynamicLangReg
  },
  {
    'id': 'codeql',
    'name': 'CodeQL',
    'aliases': [
      'ql'
    ],
    'import': (() => import('./langs/codeql')) as DynamicLangReg
  },
  {
    'id': 'coffee',
    'name': 'CoffeeScript',
    'aliases': [
      'coffeescript'
    ],
    'import': (() => import('./langs/coffee')) as DynamicLangReg
  },
  {
    'id': 'cpp',
    'name': 'C++',
    'aliases': [
      'c++'
    ],
    'import': (() => import('./langs/cpp')) as DynamicLangReg
  },
  {
    'id': 'crystal',
    'name': 'Crystal',
    'import': (() => import('./langs/crystal')) as DynamicLangReg
  },
  {
    'id': 'csharp',
    'name': 'C#',
    'aliases': [
      'c#',
      'cs'
    ],
    'import': (() => import('./langs/csharp')) as DynamicLangReg
  },
  {
    'id': 'css',
    'name': 'CSS',
    'import': (() => import('./langs/css')) as DynamicLangReg
  },
  {
    'id': 'csv',
    'name': 'csv syntax',
    'import': (() => import('./langs/csv')) as DynamicLangReg
  },
  {
    'id': 'cue',
    'name': 'CUE',
    'import': (() => import('./langs/cue')) as DynamicLangReg
  },
  {
    'id': 'cypher',
    'name': 'Cypher',
    'aliases': [
      'cql'
    ],
    'import': (() => import('./langs/cypher')) as DynamicLangReg
  },
  {
    'id': 'd',
    'name': 'D',
    'import': (() => import('./langs/d')) as DynamicLangReg
  },
  {
    'id': 'dart',
    'name': 'Dart',
    'import': (() => import('./langs/dart')) as DynamicLangReg
  },
  {
    'id': 'dax',
    'name': 'DAX',
    'import': (() => import('./langs/dax')) as DynamicLangReg
  },
  {
    'id': 'diff',
    'name': 'Diff',
    'import': (() => import('./langs/diff')) as DynamicLangReg
  },
  {
    'id': 'docker',
    'name': 'Dockerfile',
    'aliases': [
      'dockerfile'
    ],
    'import': (() => import('./langs/docker')) as DynamicLangReg
  },
  {
    'id': 'dream-maker',
    'name': 'Dream Maker',
    'import': (() => import('./langs/dream-maker')) as DynamicLangReg
  },
  {
    'id': 'elixir',
    'name': 'Elixir',
    'import': (() => import('./langs/elixir')) as DynamicLangReg
  },
  {
    'id': 'elm',
    'name': 'Elm',
    'import': (() => import('./langs/elm')) as DynamicLangReg
  },
  {
    'id': 'erb',
    'name': 'ERB',
    'import': (() => import('./langs/erb')) as DynamicLangReg
  },
  {
    'id': 'erlang',
    'name': 'Erlang',
    'aliases': [
      'erl'
    ],
    'import': (() => import('./langs/erlang')) as DynamicLangReg
  },
  {
    'id': 'fish',
    'name': 'Fish',
    'import': (() => import('./langs/fish')) as DynamicLangReg
  },
  {
    'id': 'fsharp',
    'name': 'F#',
    'aliases': [
      'f#',
      'fs'
    ],
    'import': (() => import('./langs/fsharp')) as DynamicLangReg
  },
  {
    'id': 'gdresource',
    'name': 'GDResource',
    'import': (() => import('./langs/gdresource')) as DynamicLangReg
  },
  {
    'id': 'gdscript',
    'name': 'GDScript',
    'import': (() => import('./langs/gdscript')) as DynamicLangReg
  },
  {
    'id': 'gdshader',
    'name': 'GDShader',
    'import': (() => import('./langs/gdshader')) as DynamicLangReg
  },
  {
    'id': 'gherkin',
    'name': 'Gherkin',
    'import': (() => import('./langs/gherkin')) as DynamicLangReg
  },
  {
    'id': 'git-commit',
    'name': 'Git Commit Message',
    'import': (() => import('./langs/git-commit')) as DynamicLangReg
  },
  {
    'id': 'git-rebase',
    'name': 'Git Rebase Message',
    'import': (() => import('./langs/git-rebase')) as DynamicLangReg
  },
  {
    'id': 'glimmer-js',
    'name': 'Glimmer JS',
    'aliases': [
      'gjs'
    ],
    'import': (() => import('./langs/glimmer-js')) as DynamicLangReg
  },
  {
    'id': 'glimmer-ts',
    'name': 'Glimmer TS',
    'aliases': [
      'gts'
    ],
    'import': (() => import('./langs/glimmer-ts')) as DynamicLangReg
  },
  {
    'id': 'glsl',
    'name': 'GLSL',
    'import': (() => import('./langs/glsl')) as DynamicLangReg
  },
  {
    'id': 'gnuplot',
    'name': 'Gnuplot',
    'import': (() => import('./langs/gnuplot')) as DynamicLangReg
  },
  {
    'id': 'go',
    'name': 'Go',
    'import': (() => import('./langs/go')) as DynamicLangReg
  },
  {
    'id': 'graphql',
    'name': 'GraphQL',
    'aliases': [
      'gql'
    ],
    'import': (() => import('./langs/graphql')) as DynamicLangReg
  },
  {
    'id': 'groovy',
    'name': 'Groovy',
    'import': (() => import('./langs/groovy')) as DynamicLangReg
  },
  {
    'id': 'hack',
    'name': 'Hack',
    'import': (() => import('./langs/hack')) as DynamicLangReg
  },
  {
    'id': 'haml',
    'name': 'Ruby Haml',
    'import': (() => import('./langs/haml')) as DynamicLangReg
  },
  {
    'id': 'handlebars',
    'name': 'Handlebars',
    'aliases': [
      'hbs'
    ],
    'import': (() => import('./langs/handlebars')) as DynamicLangReg
  },
  {
    'id': 'haskell',
    'name': 'Haskell',
    'aliases': [
      'hs'
    ],
    'import': (() => import('./langs/haskell')) as DynamicLangReg
  },
  {
    'id': 'hcl',
    'name': 'HashiCorp HCL',
    'import': (() => import('./langs/hcl')) as DynamicLangReg
  },
  {
    'id': 'hjson',
    'name': 'Hjson',
    'import': (() => import('./langs/hjson')) as DynamicLangReg
  },
  {
    'id': 'hlsl',
    'name': 'HLSL',
    'import': (() => import('./langs/hlsl')) as DynamicLangReg
  },
  {
    'id': 'html',
    'name': 'HTML',
    'import': (() => import('./langs/html')) as DynamicLangReg
  },
  {
    'id': 'imba',
    'name': 'Imba',
    'import': (() => import('./langs/imba')) as DynamicLangReg
  },
  {
    'id': 'ini',
    'name': 'INI',
    'aliases': [
      'properties'
    ],
    'import': (() => import('./langs/ini')) as DynamicLangReg
  },
  {
    'id': 'java',
    'name': 'Java',
    'import': (() => import('./langs/java')) as DynamicLangReg
  },
  {
    'id': 'javascript',
    'name': 'JavaScript',
    'aliases': [
      'js'
    ],
    'import': (() => import('./langs/javascript')) as DynamicLangReg
  },
  {
    'id': 'jinja',
    'name': 'Jinja',
    'import': (() => import('./langs/jinja')) as DynamicLangReg
  },
  {
    'id': 'jison',
    'name': 'Jison',
    'import': (() => import('./langs/jison')) as DynamicLangReg
  },
  {
    'id': 'json',
    'name': 'JSON',
    'import': (() => import('./langs/json')) as DynamicLangReg
  },
  {
    'id': 'json5',
    'name': 'JSON5',
    'import': (() => import('./langs/json5')) as DynamicLangReg
  },
  {
    'id': 'jsonc',
    'name': 'JSON with Comments',
    'import': (() => import('./langs/jsonc')) as DynamicLangReg
  },
  {
    'id': 'jsonl',
    'name': 'JSON Lines',
    'import': (() => import('./langs/jsonl')) as DynamicLangReg
  },
  {
    'id': 'jsonnet',
    'name': 'Jsonnet',
    'import': (() => import('./langs/jsonnet')) as DynamicLangReg
  },
  {
    'id': 'jssm',
    'name': 'JSSM',
    'aliases': [
      'fsl'
    ],
    'import': (() => import('./langs/jssm')) as DynamicLangReg
  },
  {
    'id': 'jsx',
    'name': 'JSX',
    'import': (() => import('./langs/jsx')) as DynamicLangReg
  },
  {
    'id': 'julia',
    'name': 'Julia',
    'import': (() => import('./langs/julia')) as DynamicLangReg
  },
  {
    'id': 'kotlin',
    'name': 'Kotlin',
    'aliases': [
      'kt',
      'kts'
    ],
    'import': (() => import('./langs/kotlin')) as DynamicLangReg
  },
  {
    'id': 'kusto',
    'name': 'Kusto',
    'aliases': [
      'kql'
    ],
    'import': (() => import('./langs/kusto')) as DynamicLangReg
  },
  {
    'id': 'latex',
    'name': 'LaTeX',
    'import': (() => import('./langs/latex')) as DynamicLangReg
  },
  {
    'id': 'less',
    'name': 'Less',
    'import': (() => import('./langs/less')) as DynamicLangReg
  },
  {
    'id': 'liquid',
    'name': 'Liquid',
    'import': (() => import('./langs/liquid')) as DynamicLangReg
  },
  {
    'id': 'lisp',
    'name': 'Lisp',
    'import': (() => import('./langs/lisp')) as DynamicLangReg
  },
  {
    'id': 'logo',
    'name': 'Logo',
    'import': (() => import('./langs/logo')) as DynamicLangReg
  },
  {
    'id': 'lua',
    'name': 'Lua',
    'import': (() => import('./langs/lua')) as DynamicLangReg
  },
  {
    'id': 'make',
    'name': 'Makefile',
    'aliases': [
      'makefile'
    ],
    'import': (() => import('./langs/make')) as DynamicLangReg
  },
  {
    'id': 'markdown',
    'name': 'Markdown',
    'aliases': [
      'md'
    ],
    'import': (() => import('./langs/markdown')) as DynamicLangReg
  },
  {
    'id': 'marko',
    'name': 'Marko',
    'import': (() => import('./langs/marko')) as DynamicLangReg
  },
  {
    'id': 'matlab',
    'name': 'MATLAB',
    'import': (() => import('./langs/matlab')) as DynamicLangReg
  },
  {
    'id': 'mdc',
    'name': 'mdc',
    'import': (() => import('./langs/mdc')) as DynamicLangReg
  },
  {
    'id': 'mdx',
    'name': 'MDX',
    'import': (() => import('./langs/mdx')) as DynamicLangReg
  },
  {
    'id': 'mermaid',
    'name': 'Mermaid',
    'import': (() => import('./langs/mermaid')) as DynamicLangReg
  },
  {
    'id': 'mojo',
    'name': 'Mojo',
    'import': (() => import('./langs/mojo')) as DynamicLangReg
  },
  {
    'id': 'narrat',
    'name': 'Narrat Language',
    'aliases': [
      'nar'
    ],
    'import': (() => import('./langs/narrat')) as DynamicLangReg
  },
  {
    'id': 'nextflow',
    'name': 'Nextflow',
    'aliases': [
      'nf'
    ],
    'import': (() => import('./langs/nextflow')) as DynamicLangReg
  },
  {
    'id': 'nginx',
    'name': 'Nginx',
    'import': (() => import('./langs/nginx')) as DynamicLangReg
  },
  {
    'id': 'nim',
    'name': 'Nim',
    'import': (() => import('./langs/nim')) as DynamicLangReg
  },
  {
    'id': 'nix',
    'name': 'Nix',
    'import': (() => import('./langs/nix')) as DynamicLangReg
  },
  {
    'id': 'nushell',
    'name': 'nushell',
    'aliases': [
      'nu'
    ],
    'import': (() => import('./langs/nushell')) as DynamicLangReg
  },
  {
    'id': 'objective-c',
    'name': 'Objective-C',
    'aliases': [
      'objc'
    ],
    'import': (() => import('./langs/objective-c')) as DynamicLangReg
  },
  {
    'id': 'objective-cpp',
    'name': 'Objective-C++',
    'import': (() => import('./langs/objective-cpp')) as DynamicLangReg
  },
  {
    'id': 'ocaml',
    'name': 'OCaml',
    'import': (() => import('./langs/ocaml')) as DynamicLangReg
  },
  {
    'id': 'pascal',
    'name': 'Pascal',
    'import': (() => import('./langs/pascal')) as DynamicLangReg
  },
  {
    'id': 'perl',
    'name': 'Perl',
    'import': (() => import('./langs/perl')) as DynamicLangReg
  },
  {
    'id': 'php',
    'name': 'PHP',
    'import': (() => import('./langs/php')) as DynamicLangReg
  },
  {
    'id': 'plsql',
    'name': 'PL/SQL',
    'import': (() => import('./langs/plsql')) as DynamicLangReg
  },
  {
    'id': 'postcss',
    'name': 'PostCSS',
    'import': (() => import('./langs/postcss')) as DynamicLangReg
  },
  {
    'id': 'powerquery',
    'name': 'PowerQuery',
    'import': (() => import('./langs/powerquery')) as DynamicLangReg
  },
  {
    'id': 'powershell',
    'name': 'PowerShell',
    'aliases': [
      'ps',
      'ps1'
    ],
    'import': (() => import('./langs/powershell')) as DynamicLangReg
  },
  {
    'id': 'prisma',
    'name': 'Prisma',
    'import': (() => import('./langs/prisma')) as DynamicLangReg
  },
  {
    'id': 'prolog',
    'name': 'Prolog',
    'import': (() => import('./langs/prolog')) as DynamicLangReg
  },
  {
    'id': 'proto',
    'name': 'Protocol Buffer 3',
    'import': (() => import('./langs/proto')) as DynamicLangReg
  },
  {
    'id': 'pug',
    'name': 'Pug',
    'aliases': [
      'jade'
    ],
    'import': (() => import('./langs/pug')) as DynamicLangReg
  },
  {
    'id': 'puppet',
    'name': 'Puppet',
    'import': (() => import('./langs/puppet')) as DynamicLangReg
  },
  {
    'id': 'purescript',
    'name': 'PureScript',
    'import': (() => import('./langs/purescript')) as DynamicLangReg
  },
  {
    'id': 'python',
    'name': 'Python',
    'aliases': [
      'py'
    ],
    'import': (() => import('./langs/python')) as DynamicLangReg
  },
  {
    'id': 'r',
    'name': 'R',
    'import': (() => import('./langs/r')) as DynamicLangReg
  },
  {
    'id': 'raku',
    'name': 'Raku',
    'aliases': [
      'perl6'
    ],
    'import': (() => import('./langs/raku')) as DynamicLangReg
  },
  {
    'id': 'razor',
    'name': 'ASP.NET Razor',
    'import': (() => import('./langs/razor')) as DynamicLangReg
  },
  {
    'id': 'reg',
    'name': 'Windows Registry Script',
    'import': (() => import('./langs/reg')) as DynamicLangReg
  },
  {
    'id': 'rel',
    'name': 'Rel',
    'import': (() => import('./langs/rel')) as DynamicLangReg
  },
  {
    'id': 'riscv',
    'name': 'RISC-V',
    'import': (() => import('./langs/riscv')) as DynamicLangReg
  },
  {
    'id': 'rst',
    'name': 'reStructuredText',
    'import': (() => import('./langs/rst')) as DynamicLangReg
  },
  {
    'id': 'ruby',
    'name': 'Ruby',
    'aliases': [
      'rb'
    ],
    'import': (() => import('./langs/ruby')) as DynamicLangReg
  },
  {
    'id': 'rust',
    'name': 'Rust',
    'aliases': [
      'rs'
    ],
    'import': (() => import('./langs/rust')) as DynamicLangReg
  },
  {
    'id': 'sas',
    'name': 'SAS',
    'import': (() => import('./langs/sas')) as DynamicLangReg
  },
  {
    'id': 'sass',
    'name': 'Sass',
    'import': (() => import('./langs/sass')) as DynamicLangReg
  },
  {
    'id': 'scala',
    'name': 'Scala',
    'import': (() => import('./langs/scala')) as DynamicLangReg
  },
  {
    'id': 'scheme',
    'name': 'Scheme',
    'import': (() => import('./langs/scheme')) as DynamicLangReg
  },
  {
    'id': 'scss',
    'name': 'SCSS',
    'import': (() => import('./langs/scss')) as DynamicLangReg
  },
  {
    'id': 'shaderlab',
    'name': 'ShaderLab',
    'aliases': [
      'shader'
    ],
    'import': (() => import('./langs/shaderlab')) as DynamicLangReg
  },
  {
    'id': 'shellscript',
    'name': 'Shell',
    'aliases': [
      'bash',
      'sh',
      'shell',
      'zsh'
    ],
    'import': (() => import('./langs/shellscript')) as DynamicLangReg
  },
  {
    'id': 'shellsession',
    'name': 'Shell Session',
    'aliases': [
      'console'
    ],
    'import': (() => import('./langs/shellsession')) as DynamicLangReg
  },
  {
    'id': 'smalltalk',
    'name': 'Smalltalk',
    'import': (() => import('./langs/smalltalk')) as DynamicLangReg
  },
  {
    'id': 'solidity',
    'name': 'Solidity',
    'import': (() => import('./langs/solidity')) as DynamicLangReg
  },
  {
    'id': 'sparql',
    'name': 'SPARQL',
    'import': (() => import('./langs/sparql')) as DynamicLangReg
  },
  {
    'id': 'splunk',
    'name': 'Splunk Query Language',
    'aliases': [
      'spl'
    ],
    'import': (() => import('./langs/splunk')) as DynamicLangReg
  },
  {
    'id': 'sql',
    'name': 'SQL',
    'import': (() => import('./langs/sql')) as DynamicLangReg
  },
  {
    'id': 'ssh-config',
    'name': 'SSH Config',
    'import': (() => import('./langs/ssh-config')) as DynamicLangReg
  },
  {
    'id': 'stata',
    'name': 'Stata',
    'import': (() => import('./langs/stata')) as DynamicLangReg
  },
  {
    'id': 'stylus',
    'name': 'Stylus',
    'aliases': [
      'styl'
    ],
    'import': (() => import('./langs/stylus')) as DynamicLangReg
  },
  {
    'id': 'svelte',
    'name': 'Svelte',
    'import': (() => import('./langs/svelte')) as DynamicLangReg
  },
  {
    'id': 'swift',
    'name': 'Swift',
    'import': (() => import('./langs/swift')) as DynamicLangReg
  },
  {
    'id': 'system-verilog',
    'name': 'SystemVerilog',
    'import': (() => import('./langs/system-verilog')) as DynamicLangReg
  },
  {
    'id': 'tasl',
    'name': 'Tasl',
    'import': (() => import('./langs/tasl')) as DynamicLangReg
  },
  {
    'id': 'tcl',
    'name': 'Tcl',
    'import': (() => import('./langs/tcl')) as DynamicLangReg
  },
  {
    'id': 'tex',
    'name': 'TeX',
    'import': (() => import('./langs/tex')) as DynamicLangReg
  },
  {
    'id': 'toml',
    'name': 'TOML',
    'import': (() => import('./langs/toml')) as DynamicLangReg
  },
  {
    'id': 'tsx',
    'name': 'TSX',
    'import': (() => import('./langs/tsx')) as DynamicLangReg
  },
  {
    'id': 'turtle',
    'name': 'Turtle',
    'import': (() => import('./langs/turtle')) as DynamicLangReg
  },
  {
    'id': 'twig',
    'name': 'Twig',
    'import': (() => import('./langs/twig')) as DynamicLangReg
  },
  {
    'id': 'typescript',
    'name': 'TypeScript',
    'aliases': [
      'ts'
    ],
    'import': (() => import('./langs/typescript')) as DynamicLangReg
  },
  {
    'id': 'v',
    'name': 'V',
    'import': (() => import('./langs/v')) as DynamicLangReg
  },
  {
    'id': 'vb',
    'name': 'Visual Basic',
    'aliases': [
      'cmd'
    ],
    'import': (() => import('./langs/vb')) as DynamicLangReg
  },
  {
    'id': 'verilog',
    'name': 'Verilog',
    'import': (() => import('./langs/verilog')) as DynamicLangReg
  },
  {
    'id': 'vhdl',
    'name': 'VHDL',
    'import': (() => import('./langs/vhdl')) as DynamicLangReg
  },
  {
    'id': 'viml',
    'name': 'Vim Script',
    'aliases': [
      'vim',
      'vimscript'
    ],
    'import': (() => import('./langs/viml')) as DynamicLangReg
  },
  {
    'id': 'vue',
    'name': 'Vue',
    'import': (() => import('./langs/vue')) as DynamicLangReg
  },
  {
    'id': 'vue-html',
    'name': 'Vue HTML',
    'import': (() => import('./langs/vue-html')) as DynamicLangReg
  },
  {
    'id': 'vyper',
    'name': 'Vyper',
    'aliases': [
      'vy'
    ],
    'import': (() => import('./langs/vyper')) as DynamicLangReg
  },
  {
    'id': 'wasm',
    'name': 'WebAssembly',
    'import': (() => import('./langs/wasm')) as DynamicLangReg
  },
  {
    'id': 'wenyan',
    'name': 'Wenyan',
    'aliases': [
      '文言'
    ],
    'import': (() => import('./langs/wenyan')) as DynamicLangReg
  },
  {
    'id': 'wgsl',
    'name': 'WGSL',
    'import': (() => import('./langs/wgsl')) as DynamicLangReg
  },
  {
    'id': 'wolfram',
    'name': 'Wolfram',
    'aliases': [
      'wl'
    ],
    'import': (() => import('./langs/wolfram')) as DynamicLangReg
  },
  {
    'id': 'xml',
    'name': 'XML',
    'import': (() => import('./langs/xml')) as DynamicLangReg
  },
  {
    'id': 'xsl',
    'name': 'XSL',
    'import': (() => import('./langs/xsl')) as DynamicLangReg
  },
  {
    'id': 'yaml',
    'name': 'YAML',
    'aliases': [
      'yml'
    ],
    'import': (() => import('./langs/yaml')) as DynamicLangReg
  },
  {
    'id': 'zenscript',
    'name': 'ZenScript',
    'import': (() => import('./langs/zenscript')) as DynamicLangReg
  },
  {
    'id': 'zig',
    'name': 'zig',
    'import': (() => import('./langs/zig')) as DynamicLangReg
  }
]

export const bundledLanguagesBase = Object.fromEntries(bundledLanguagesInfo.map(i => [i.id, i.import]))

export const bundledLanguagesAlias = Object.fromEntries(bundledLanguagesInfo.flatMap(i => i.aliases?.map(a => [a, i.import]) || []))

export type BuiltinLanguage = 'abap' | 'actionscript-3' | 'ada' | 'apache' | 'apex' | 'apl' | 'applescript' | 'ara' | 'asm' | 'astro' | 'awk' | 'ballerina' | 'bash' | 'bat' | 'batch' | 'be' | 'beancount' | 'berry' | 'bibtex' | 'bicep' | 'blade' | 'c' | 'c#' | 'c++' | 'cadence' | 'cdc' | 'clarity' | 'clj' | 'clojure' | 'cmake' | 'cmd' | 'cobol' | 'codeql' | 'coffee' | 'coffeescript' | 'console' | 'cpp' | 'cql' | 'crystal' | 'cs' | 'csharp' | 'css' | 'csv' | 'cue' | 'cypher' | 'd' | 'dart' | 'dax' | 'diff' | 'docker' | 'dockerfile' | 'dream-maker' | 'elixir' | 'elm' | 'erb' | 'erl' | 'erlang' | 'f#' | 'fish' | 'fs' | 'fsharp' | 'fsl' | 'gdresource' | 'gdscript' | 'gdshader' | 'gherkin' | 'git-commit' | 'git-rebase' | 'gjs' | 'glimmer-js' | 'glimmer-ts' | 'glsl' | 'gnuplot' | 'go' | 'gql' | 'graphql' | 'groovy' | 'gts' | 'hack' | 'haml' | 'handlebars' | 'haskell' | 'hbs' | 'hcl' | 'hjson' | 'hlsl' | 'hs' | 'html' | 'imba' | 'ini' | 'jade' | 'java' | 'javascript' | 'jinja' | 'jison' | 'js' | 'json' | 'json5' | 'jsonc' | 'jsonl' | 'jsonnet' | 'jssm' | 'jsx' | 'julia' | 'kotlin' | 'kql' | 'kt' | 'kts' | 'kusto' | 'latex' | 'less' | 'liquid' | 'lisp' | 'logo' | 'lua' | 'make' | 'makefile' | 'markdown' | 'marko' | 'matlab' | 'md' | 'mdc' | 'mdx' | 'mermaid' | 'mojo' | 'nar' | 'narrat' | 'nextflow' | 'nf' | 'nginx' | 'nim' | 'nix' | 'nu' | 'nushell' | 'objc' | 'objective-c' | 'objective-cpp' | 'ocaml' | 'pascal' | 'perl' | 'perl6' | 'php' | 'plsql' | 'postcss' | 'powerquery' | 'powershell' | 'prisma' | 'prolog' | 'properties' | 'proto' | 'ps' | 'ps1' | 'pug' | 'puppet' | 'purescript' | 'py' | 'python' | 'ql' | 'r' | 'raku' | 'razor' | 'rb' | 'reg' | 'rel' | 'riscv' | 'rs' | 'rst' | 'ruby' | 'rust' | 'sas' | 'sass' | 'scala' | 'scheme' | 'scss' | 'sh' | 'shader' | 'shaderlab' | 'shell' | 'shellscript' | 'shellsession' | 'smalltalk' | 'solidity' | 'sparql' | 'spl' | 'splunk' | 'sql' | 'ssh-config' | 'stata' | 'styl' | 'stylus' | 'svelte' | 'swift' | 'system-verilog' | 'tasl' | 'tcl' | 'tex' | 'toml' | 'ts' | 'tsx' | 'turtle' | 'twig' | 'typescript' | 'v' | 'vb' | 'verilog' | 'vhdl' | 'vim' | 'viml' | 'vimscript' | 'vue' | 'vue-html' | 'vy' | 'vyper' | 'wasm' | 'wenyan' | 'wgsl' | 'wl' | 'wolfram' | 'xml' | 'xsl' | 'yaml' | 'yml' | 'zenscript' | 'zig' | 'zsh' | '文言'

export const bundledLanguages = {
  ...bundledLanguagesBase,
  ...bundledLanguagesAlias,
} as Record<BuiltinLanguage, DynamicLangReg>