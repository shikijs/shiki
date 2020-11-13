import * as path from 'path'
import { ILanguageRegistration } from './index'

export type Lang =
  | 'abap'
  | 'actionscript-3'
  | 'ada'
  | 'apex'
  | 'applescript'
  | 'asm'
  | 'awk'
  | 'bat'
  | 'c'
  | 'clojure'
  | 'cobol'
  | 'coffee'
  | 'cpp'
  | 'crystal'
  | 'csharp'
  | 'css'
  | 'd'
  | 'dart'
  | 'diff'
  | 'dockerfile'
  | 'elixir'
  | 'elm'
  | 'erlang'
  | 'fortran'
  | 'fsharp'
  | 'git-commit'
  | 'git-rebase'
  | 'go'
  | 'graphql'
  | 'groovy'
  | 'hack'
  | 'haml'
  | 'handlebars'
  | 'haskell'
  | 'hcl'
  | 'hlsl'
  | 'html'
  | 'ini'
  | 'java'
  | 'javascript'
  | 'jinja-html'
  | 'json'
  | 'jsonc'
  | 'jsonnet'
  | 'jsx'
  | 'julia'
  | 'kotlin'
  | 'latex'
  | 'less'
  | 'lisp'
  | 'log'
  | 'logo'
  | 'lua'
  | 'makefile'
  | 'markdown'
  | 'matlab'
  | 'nix'
  | 'objective-c'
  | 'ocaml'
  | 'pascal'
  | 'perl'
  | 'perl6'
  | 'php'
  | 'pls'
  | 'postcss'
  | 'powershell'
  | 'prolog'
  | 'pug'
  | 'puppet'
  | 'purescript'
  | 'python'
  | 'r'
  | 'razor'
  | 'ruby'
  | 'rust'
  | 'sas'
  | 'sass'
  | 'scala'
  | 'scheme'
  | 'scss'
  | 'shaderlab'
  | 'shellscript'
  | 'smalltalk'
  | 'sql'
  | 'stylus'
  | 'svelte'
  | 'swift'
  | 'tcl'
  | 'toml'
  | 'ts'
  | 'tsx'
  | 'typescript'
  | 'vb'
  | 'viml'
  | 'vue'
  | 'wasm'
  | 'xml'
  | 'xsl'
  | 'yaml'
  | '文言'

export const languages: ILanguageRegistration[] = [
  {
    id: 'abap',
    scopeName: 'source.abap',
    path: path.resolve(__dirname, '../data/abap.tmLanguage.json')
  },
  {
    id: 'actionscript-3',
    scopeName: 'source.actionscript.3',
    path: path.resolve(__dirname, '../data/actionscript-3.tmLanguage.json')
  },
  {
    id: 'ada',
    scopeName: 'source.ada',
    path: path.resolve(__dirname, '../data/ada.tmLanguage.json')
  },
  {
    id: 'apex',
    scopeName: 'source.apex',
    path: path.resolve(__dirname, '../data/apex.tmLanguage.json')
  },
  {
    id: 'applescript',
    scopeName: 'source.applescript',
    path: path.resolve(__dirname, '../data/applescript.tmLanguage.json')
  },
  {
    id: 'asm',
    scopeName: 'source.asm.x86_64',
    path: path.resolve(__dirname, '../data/asm.tmLanguage.json')
  },
  {
    id: 'awk',
    scopeName: 'source.awk',
    path: path.resolve(__dirname, '../data/awk.tmLanguage.json')
  },
  {
    id: 'bat',
    scopeName: 'source.batchfile',
    path: path.resolve(__dirname, '../data/bat.tmLanguage.json'),
    aliases: ['batch']
  },
  {
    id: 'c',
    scopeName: 'source.c',
    path: path.resolve(__dirname, '../data/c.tmLanguage.json')
  },
  {
    id: 'clojure',
    scopeName: 'source.clojure',
    path: path.resolve(__dirname, '../data/clojure.tmLanguage.json'),
    aliases: ['clj']
  },
  {
    id: 'cobol',
    scopeName: 'source.cobol',
    path: path.resolve(__dirname, '../data/cobol.tmLanguage.json')
  },
  {
    id: 'coffee',
    scopeName: 'source.coffee',
    path: path.resolve(__dirname, '../data/coffee.tmLanguage.json')
  },
  {
    id: 'cpp',
    scopeName: 'source.cpp.embedded.macro',
    path: path.resolve(__dirname, '../data/cpp.tmLanguage.json')
  },
  {
    id: 'crystal',
    scopeName: 'source.crystal',
    path: path.resolve(__dirname, '../data/crystal.tmLanguage.json')
  },
  {
    id: 'csharp',
    scopeName: 'source.cs',
    path: path.resolve(__dirname, '../data/csharp.tmLanguage.json'),
    aliases: ['c#']
  },
  {
    id: 'css',
    scopeName: 'source.css',
    path: path.resolve(__dirname, '../data/css.tmLanguage.json')
  },
  {
    id: 'd',
    scopeName: 'source.d',
    path: path.resolve(__dirname, '../data/d.tmLanguage.json')
  },
  {
    id: 'dart',
    scopeName: 'source.dart',
    path: path.resolve(__dirname, '../data/dart.tmLanguage.json')
  },
  {
    id: 'diff',
    scopeName: 'source.diff',
    path: path.resolve(__dirname, '../data/diff.tmLanguage.json')
  },
  {
    id: 'dockerfile',
    scopeName: 'source.dockerfile',
    path: path.resolve(__dirname, '../data/dockerfile.tmLanguage.json')
  },
  {
    id: 'elixir',
    scopeName: 'source.elixir',
    path: path.resolve(__dirname, '../data/elixir.tmLanguage.json')
  },
  {
    id: 'elm',
    scopeName: 'source.elm',
    path: path.resolve(__dirname, '../data/elm.tmLanguage.json')
  },
  {
    id: 'erlang',
    scopeName: 'source.erlang',
    path: path.resolve(__dirname, '../data/erlang.tmLanguage.json')
  },
  {
    id: 'fortran',
    scopeName: 'source.fortran.free',
    path: path.resolve(__dirname, '../data/fortran.tmLanguage.json')
  },
  {
    id: 'fsharp',
    scopeName: 'source.fsharp',
    path: path.resolve(__dirname, '../data/fsharp.tmLanguage.json'),
    aliases: ['f#']
  },
  {
    id: 'git-commit',
    scopeName: 'text.git-commit',
    path: path.resolve(__dirname, '../data/git-commit.tmLanguage.json')
  },
  {
    id: 'git-rebase',
    scopeName: 'text.git-rebase',
    path: path.resolve(__dirname, '../data/git-rebase.tmLanguage.json')
  },
  {
    id: 'go',
    scopeName: 'source.go',
    path: path.resolve(__dirname, '../data/go.tmLanguage.json')
  },
  {
    id: 'graphql',
    scopeName: 'source.graphql',
    path: path.resolve(__dirname, '../data/graphql.tmLanguage.json')
  },
  {
    id: 'groovy',
    scopeName: 'source.groovy',
    path: path.resolve(__dirname, '../data/groovy.tmLanguage.json')
  },
  {
    id: 'hack',
    scopeName: 'source.hack',
    path: path.resolve(__dirname, '../data/hack.tmLanguage.json')
  },
  {
    id: 'haml',
    scopeName: 'text.haml',
    path: path.resolve(__dirname, '../data/haml.tmLanguage.json')
  },
  {
    id: 'handlebars',
    scopeName: 'text.html.handlebars',
    path: path.resolve(__dirname, '../data/handlebars.tmLanguage.json'),
    aliases: ['hbs']
  },
  {
    id: 'haskell',
    scopeName: 'source.haskell',
    path: path.resolve(__dirname, '../data/haskell.tmLanguage.json')
  },
  {
    id: 'hcl',
    scopeName: 'source.hcl',
    path: path.resolve(__dirname, '../data/hcl.tmLanguage.json')
  },
  {
    id: 'hlsl',
    scopeName: 'source.hlsl',
    path: path.resolve(__dirname, '../data/hlsl.tmLanguage.json')
  },
  {
    id: 'html',
    scopeName: 'text.html.basic',
    path: path.resolve(__dirname, '../data/html.tmLanguage.json')
  },
  {
    id: 'ini',
    scopeName: 'source.ini',
    path: path.resolve(__dirname, '../data/ini.tmLanguage.json')
  },
  {
    id: 'java',
    scopeName: 'source.java',
    path: path.resolve(__dirname, '../data/java.tmLanguage.json')
  },
  {
    id: 'javascript',
    scopeName: 'source.js',
    path: path.resolve(__dirname, '../data/javascript.tmLanguage.json'),
    aliases: ['js']
  },
  {
    id: 'jinja-html',
    scopeName: 'text.html.jinja',
    path: path.resolve(__dirname, '../data/jinja-html.tmLanguage.json')
  },
  {
    id: 'jinja',
    scopeName: 'source.jinja',
    path: path.resolve(__dirname, '../data/jinja.tmLanguage.json')
  },
  {
    id: 'json',
    scopeName: 'source.json',
    path: path.resolve(__dirname, '../data/json.tmLanguage.json')
  },
  {
    id: 'jsonc',
    scopeName: 'source.json.comments',
    path: path.resolve(__dirname, '../data/jsonc.tmLanguage.json')
  },
  {
    id: 'jsonnet',
    scopeName: 'source.jsonnet',
    path: path.resolve(__dirname, '../data/jsonnet.tmLanguage.json')
  },
  {
    id: 'jsx',
    scopeName: 'documentation.injection.js.jsx',
    path: path.resolve(__dirname, '../data/jsx.tmLanguage.json')
  },
  {
    id: 'julia',
    scopeName: 'source.julia',
    path: path.resolve(__dirname, '../data/julia.tmLanguage.json')
  },
  {
    id: 'kotlin',
    scopeName: 'source.kotlin',
    path: path.resolve(__dirname, '../data/kotlin.tmLanguage.json')
  },
  {
    id: 'latex',
    scopeName: 'text.tex.latex',
    path: path.resolve(__dirname, '../data/latex.tmLanguage.json')
  },
  {
    id: 'less',
    scopeName: 'source.css.less',
    path: path.resolve(__dirname, '../data/less.tmLanguage.json')
  },
  {
    id: 'lisp',
    scopeName: 'source.lisp',
    path: path.resolve(__dirname, '../data/lisp.tmLanguage.json')
  },
  {
    id: 'log',
    scopeName: 'text.log',
    path: path.resolve(__dirname, '../data/log.tmLanguage.json')
  },
  {
    id: 'logo',
    scopeName: 'source.logo',
    path: path.resolve(__dirname, '../data/logo.tmLanguage.json')
  },
  {
    id: 'lua',
    scopeName: 'source.lua',
    path: path.resolve(__dirname, '../data/lua.tmLanguage.json')
  },
  {
    id: 'makefile',
    scopeName: 'source.makefile',
    path: path.resolve(__dirname, '../data/makefile.tmLanguage.json')
  },
  {
    id: 'markdown',
    scopeName: 'text.html.markdown',
    path: path.resolve(__dirname, '../data/markdown.tmLanguage.json'),
    aliases: ['md']
  },
  {
    id: 'matlab',
    scopeName: 'source.matlab',
    path: path.resolve(__dirname, '../data/matlab.tmLanguage.json')
  },
  {
    id: 'nix',
    scopeName: 'source.nix',
    path: path.resolve(__dirname, '../data/nix.tmLanguage.json')
  },
  {
    id: 'objective-c',
    scopeName: 'source.objcpp',
    path: path.resolve(__dirname, '../data/objective-c.tmLanguage.json'),
    aliases: ['objc']
  },
  {
    id: 'ocaml',
    scopeName: 'source.ocaml',
    path: path.resolve(__dirname, '../data/ocaml.tmLanguage.json')
  },
  {
    id: 'pascal',
    scopeName: 'source.pascal',
    path: path.resolve(__dirname, '../data/pascal.tmLanguage.json')
  },
  {
    id: 'perl',
    scopeName: 'source.perl',
    path: path.resolve(__dirname, '../data/perl.tmLanguage.json')
  },
  {
    id: 'perl6',
    scopeName: 'source.perl.6',
    path: path.resolve(__dirname, '../data/perl6.tmLanguage.json')
  },
  {
    id: 'php-html',
    scopeName: 'text.html.php',
    path: path.resolve(__dirname, '../data/php-html.tmLanguage.json')
  },
  {
    id: 'php',
    scopeName: 'source.php',
    path: path.resolve(__dirname, '../data/php.tmLanguage.json')
  },
  {
    id: 'pls',
    scopeName: 'source.plsql.oracle',
    path: path.resolve(__dirname, '../data/pls.tmLanguage.json')
  },
  {
    id: 'postcss',
    scopeName: 'source.css.postcss',
    path: path.resolve(__dirname, '../data/postcss.tmLanguage.json')
  },
  {
    id: 'powershell',
    scopeName: 'source.powershell',
    path: path.resolve(__dirname, '../data/powershell.tmLanguage.json'),
    aliases: ['ps', 'ps1']
  },
  {
    id: 'prolog',
    scopeName: 'source.prolog',
    path: path.resolve(__dirname, '../data/prolog.tmLanguage.json')
  },
  {
    id: 'pug',
    scopeName: 'text.pug',
    path: path.resolve(__dirname, '../data/pug.tmLanguage.json'),
    aliases: ['jade']
  },
  {
    id: 'puppet',
    scopeName: 'source.puppet',
    path: path.resolve(__dirname, '../data/puppet.tmLanguage.json')
  },
  {
    id: 'purescript',
    scopeName: 'source.purescript',
    path: path.resolve(__dirname, '../data/purescript.tmLanguage.json')
  },
  {
    id: 'python',
    scopeName: 'source.python',
    path: path.resolve(__dirname, '../data/python.tmLanguage.json'),
    aliases: ['py']
  },
  {
    id: 'r',
    scopeName: 'source.r',
    path: path.resolve(__dirname, '../data/r.tmLanguage.json')
  },
  {
    id: 'razor',
    scopeName: 'text.html.cshtml',
    path: path.resolve(__dirname, '../data/razor.tmLanguage.json')
  },
  {
    id: 'ruby',
    scopeName: 'source.ruby',
    path: path.resolve(__dirname, '../data/ruby.tmLanguage.json'),
    aliases: ['rb']
  },
  {
    id: 'rust',
    scopeName: 'source.rust',
    path: path.resolve(__dirname, '../data/rust.tmLanguage.json')
  },
  {
    id: 'sas',
    scopeName: 'source.sas',
    path: path.resolve(__dirname, '../data/sas.tmLanguage.json')
  },
  {
    id: 'sass',
    scopeName: 'source.sass',
    path: path.resolve(__dirname, '../data/sass.tmLanguage.json')
  },
  {
    id: 'scala',
    scopeName: 'source.scala',
    path: path.resolve(__dirname, '../data/scala.tmLanguage.json')
  },
  {
    id: 'scheme',
    scopeName: 'source.scheme',
    path: path.resolve(__dirname, '../data/scheme.tmLanguage.json')
  },
  {
    id: 'scss',
    scopeName: 'source.css.scss',
    path: path.resolve(__dirname, '../data/scss.tmLanguage.json')
  },
  {
    id: 'shaderlab',
    scopeName: 'source.shaderlab',
    path: path.resolve(__dirname, '../data/shaderlab.tmLanguage.json'),
    aliases: ['shader']
  },
  {
    id: 'shellscript',
    scopeName: 'source.shell',
    path: path.resolve(__dirname, '../data/shellscript.tmLanguage.json'),
    aliases: ['shell', 'bash', 'sh', 'zsh']
  },
  {
    id: 'smalltalk',
    scopeName: 'source.smalltalk',
    path: path.resolve(__dirname, '../data/smalltalk.tmLanguage.json')
  },
  {
    id: 'sql',
    scopeName: 'source.sql',
    path: path.resolve(__dirname, '../data/sql.tmLanguage.json')
  },
  {
    id: 'stylus',
    scopeName: 'source.stylus',
    path: path.resolve(__dirname, '../data/stylus.tmLanguage.json'),
    aliases: ['styl']
  },
  {
    id: 'svelte',
    scopeName: 'source.svelte',
    path: path.resolve(__dirname, '../data/svelte.tmLanguage.json')
  },
  {
    id: 'swift',
    scopeName: 'source.swift',
    path: path.resolve(__dirname, '../data/swift.tmLanguage.json')
  },
  {
    id: 'tcl',
    scopeName: 'source.tcl',
    path: path.resolve(__dirname, '../data/tcl.tmLanguage.json')
  },
  {
    id: 'toml',
    scopeName: 'source.toml',
    path: path.resolve(__dirname, '../data/toml.tmLanguage.json')
  },
  {
    id: 'ts',
    scopeName: 'documentation.injection.ts',
    path: path.resolve(__dirname, '../data/ts.tmLanguage.json')
  },
  {
    id: 'tsx',
    scopeName: 'source.tsx',
    path: path.resolve(__dirname, '../data/tsx.tmLanguage.json')
  },
  {
    id: 'typescript',
    scopeName: 'source.ts',
    path: path.resolve(__dirname, '../data/typescript.tmLanguage.json'),
    aliases: ['ts']
  },
  {
    id: 'vb',
    scopeName: 'source.asp.vb.net',
    path: path.resolve(__dirname, '../data/vb.tmLanguage.json'),
    aliases: ['cmd']
  },
  {
    id: 'viml',
    scopeName: 'source.viml',
    path: path.resolve(__dirname, '../data/viml.tmLanguage.json')
  },
  {
    id: 'vue-html',
    scopeName: 'text.html.vue-html',
    path: path.resolve(__dirname, '../data/vue-html.tmLanguage.json')
  },
  {
    id: 'vue',
    scopeName: 'source.vue',
    path: path.resolve(__dirname, '../data/vue.tmLanguage.json')
  },
  {
    id: 'wasm',
    scopeName: 'source.wat',
    path: path.resolve(__dirname, '../data/wasm.tmLanguage.json')
  },
  {
    id: 'xml',
    scopeName: 'text.xml',
    path: path.resolve(__dirname, '../data/xml.tmLanguage.json')
  },
  {
    id: 'xsl',
    scopeName: 'text.xml.xsl',
    path: path.resolve(__dirname, '../data/xsl.tmLanguage.json')
  },
  {
    id: 'yaml',
    scopeName: 'source.yaml',
    path: path.resolve(__dirname, '../data/yaml.tmLanguage.json')
  },
  {
    id: '文言',
    scopeName: 'source.wenyan',
    path: path.resolve(__dirname, '../data/文言.tmLanguage.json'),
    aliases: ['wenyan']
  }
]
