import { ILanguageRegistration } from './types'

export type Lang =
  | 'abap'
  | 'actionscript-3'
  | 'ada'
  | 'apex'
  | 'applescript'
  | 'asm'
  | 'asp-net-razor'
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
  | 'html-ruby-erb'
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
  | 'ssh-config'
  | 'stylus'
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
    path: 'abap.tmLanguage.json'
  },
  {
    id: 'actionscript-3',
    scopeName: 'source.actionscript.3',
    path: 'actionscript-3.tmLanguage.json'
  },
  {
    id: 'ada',
    scopeName: 'source.ada',
    path: 'ada.tmLanguage.json'
  },
  {
    id: 'apex',
    scopeName: 'source.apex',
    path: 'apex.tmLanguage.json'
  },
  {
    id: 'applescript',
    scopeName: 'source.applescript',
    path: 'applescript.tmLanguage.json'
  },
  {
    id: 'asm',
    scopeName: 'source.asm.x86_64',
    path: 'asm.tmLanguage.json'
  },
  {
    id: 'asp-net-razor',
    scopeName: 'text.aspnetcorerazor',
    path: 'asp-net-razor.tmLanguage.json'
  },
  {
    id: 'awk',
    scopeName: 'source.awk',
    path: 'awk.tmLanguage.json'
  },
  {
    id: 'bat',
    scopeName: 'source.batchfile',
    path: 'bat.tmLanguage.json',
    aliases: ['batch']
  },
  {
    id: 'c',
    scopeName: 'source.c',
    path: 'c.tmLanguage.json'
  },
  {
    id: 'clojure',
    scopeName: 'source.clojure',
    path: 'clojure.tmLanguage.json',
    aliases: ['clj']
  },
  {
    id: 'cobol',
    scopeName: 'source.cobol',
    path: 'cobol.tmLanguage.json'
  },
  {
    id: 'coffee',
    scopeName: 'source.coffee',
    path: 'coffee.tmLanguage.json'
  },
  {
    id: 'cpp',
    scopeName: 'source.cpp.embedded.macro',
    path: 'cpp.tmLanguage.json'
  },
  {
    id: 'crystal',
    scopeName: 'source.crystal',
    path: 'crystal.tmLanguage.json'
  },
  {
    id: 'csharp',
    scopeName: 'source.cs',
    path: 'csharp.tmLanguage.json',
    aliases: ['c#']
  },
  {
    id: 'css',
    scopeName: 'source.css',
    path: 'css.tmLanguage.json'
  },
  {
    id: 'd',
    scopeName: 'source.d',
    path: 'd.tmLanguage.json'
  },
  {
    id: 'dart',
    scopeName: 'source.dart',
    path: 'dart.tmLanguage.json'
  },
  {
    id: 'diff',
    scopeName: 'source.diff',
    path: 'diff.tmLanguage.json'
  },
  {
    id: 'dockerfile',
    scopeName: 'source.dockerfile',
    path: 'dockerfile.tmLanguage.json'
  },
  {
    id: 'elixir',
    scopeName: 'source.elixir',
    path: 'elixir.tmLanguage.json'
  },
  {
    id: 'elm',
    scopeName: 'source.elm',
    path: 'elm.tmLanguage.json'
  },
  {
    id: 'erlang',
    scopeName: 'source.erlang',
    path: 'erlang.tmLanguage.json'
  },
  {
    id: 'fsharp',
    scopeName: 'source.fsharp',
    path: 'fsharp.tmLanguage.json',
    aliases: ['f#']
  },
  {
    id: 'git-commit',
    scopeName: 'text.git-commit',
    path: 'git-commit.tmLanguage.json'
  },
  {
    id: 'git-rebase',
    scopeName: 'text.git-rebase',
    path: 'git-rebase.tmLanguage.json'
  },
  {
    id: 'go',
    scopeName: 'source.go',
    path: 'go.tmLanguage.json'
  },
  {
    id: 'graphql',
    scopeName: 'source.graphql',
    path: 'graphql.tmLanguage.json'
  },
  {
    id: 'groovy',
    scopeName: 'source.groovy',
    path: 'groovy.tmLanguage.json'
  },
  {
    id: 'hack',
    scopeName: 'source.hack',
    path: 'hack.tmLanguage.json'
  },
  {
    id: 'haml',
    scopeName: 'text.haml',
    path: 'haml.tmLanguage.json'
  },
  {
    id: 'handlebars',
    scopeName: 'text.html.handlebars',
    path: 'handlebars.tmLanguage.json',
    aliases: ['hbs']
  },
  {
    id: 'haskell',
    scopeName: 'source.haskell',
    path: 'haskell.tmLanguage.json'
  },
  {
    id: 'hcl',
    scopeName: 'source.hcl',
    path: 'hcl.tmLanguage.json'
  },
  {
    id: 'hlsl',
    scopeName: 'source.hlsl',
    path: 'hlsl.tmLanguage.json'
  },
  {
    id: 'html-ruby-erb',
    scopeName: 'text.html.erb',
    path: 'html-ruby-erb.tmLanguage.json',
    aliases: ['erb']
  },
  {
    id: 'html',
    scopeName: 'text.html.basic',
    path: 'html.tmLanguage.json'
  },
  {
    id: 'ini',
    scopeName: 'source.ini',
    path: 'ini.tmLanguage.json'
  },
  {
    id: 'java',
    scopeName: 'source.java',
    path: 'java.tmLanguage.json'
  },
  {
    id: 'javascript',
    scopeName: 'source.js',
    path: 'javascript.tmLanguage.json',
    aliases: ['js']
  },
  {
    id: 'jinja-html',
    scopeName: 'text.html.jinja',
    path: 'jinja-html.tmLanguage.json'
  },
  {
    id: 'jinja',
    scopeName: 'source.jinja',
    path: 'jinja.tmLanguage.json'
  },
  {
    id: 'json',
    scopeName: 'source.json',
    path: 'json.tmLanguage.json'
  },
  {
    id: 'jsonc',
    scopeName: 'source.json.comments',
    path: 'jsonc.tmLanguage.json'
  },
  {
    id: 'jsonnet',
    scopeName: 'source.jsonnet',
    path: 'jsonnet.tmLanguage.json'
  },
  {
    id: 'jsx',
    scopeName: 'documentation.injection.js.jsx',
    path: 'jsx.tmLanguage.json'
  },
  {
    id: 'julia',
    scopeName: 'source.julia',
    path: 'julia.tmLanguage.json'
  },
  {
    id: 'kotlin',
    scopeName: 'source.kotlin',
    path: 'kotlin.tmLanguage.json'
  },
  {
    id: 'latex',
    scopeName: 'text.tex.latex',
    path: 'latex.tmLanguage.json',
    aliases: ['tex']
  },
  {
    id: 'less',
    scopeName: 'source.css.less',
    path: 'less.tmLanguage.json'
  },
  {
    id: 'lisp',
    scopeName: 'source.lisp',
    path: 'lisp.tmLanguage.json'
  },
  {
    id: 'logo',
    scopeName: 'source.logo',
    path: 'logo.tmLanguage.json'
  },
  {
    id: 'lua',
    scopeName: 'source.lua',
    path: 'lua.tmLanguage.json'
  },
  {
    id: 'makefile',
    scopeName: 'source.makefile',
    path: 'makefile.tmLanguage.json'
  },
  {
    id: 'markdown',
    scopeName: 'text.html.markdown',
    path: 'markdown.tmLanguage.json',
    aliases: ['md']
  },
  {
    id: 'matlab',
    scopeName: 'source.matlab',
    path: 'matlab.tmLanguage.json'
  },
  {
    id: 'nix',
    scopeName: 'source.nix',
    path: 'nix.tmLanguage.json'
  },
  {
    id: 'objective-c',
    scopeName: 'source.objcpp',
    path: 'objective-c.tmLanguage.json',
    aliases: ['objc']
  },
  {
    id: 'ocaml',
    scopeName: 'source.ocaml',
    path: 'ocaml.tmLanguage.json'
  },
  {
    id: 'pascal',
    scopeName: 'source.pascal',
    path: 'pascal.tmLanguage.json'
  },
  {
    id: 'perl',
    scopeName: 'source.perl',
    path: 'perl.tmLanguage.json'
  },
  {
    id: 'perl6',
    scopeName: 'source.perl.6',
    path: 'perl6.tmLanguage.json'
  },
  {
    id: 'php-html',
    scopeName: 'text.html.php',
    path: 'php-html.tmLanguage.json'
  },
  {
    id: 'php',
    scopeName: 'source.php',
    path: 'php.tmLanguage.json'
  },
  {
    id: 'pls',
    scopeName: 'source.plsql.oracle',
    path: 'pls.tmLanguage.json'
  },
  {
    id: 'postcss',
    scopeName: 'source.css.postcss',
    path: 'postcss.tmLanguage.json'
  },
  {
    id: 'powershell',
    scopeName: 'source.powershell',
    path: 'powershell.tmLanguage.json',
    aliases: ['ps', 'ps1']
  },
  {
    id: 'prolog',
    scopeName: 'source.prolog',
    path: 'prolog.tmLanguage.json'
  },
  {
    id: 'pug',
    scopeName: 'text.pug',
    path: 'pug.tmLanguage.json',
    aliases: ['jade']
  },
  {
    id: 'puppet',
    scopeName: 'source.puppet',
    path: 'puppet.tmLanguage.json'
  },
  {
    id: 'purescript',
    scopeName: 'source.purescript',
    path: 'purescript.tmLanguage.json'
  },
  {
    id: 'python',
    scopeName: 'source.python',
    path: 'python.tmLanguage.json',
    aliases: ['py']
  },
  {
    id: 'r',
    scopeName: 'source.r',
    path: 'r.tmLanguage.json'
  },
  {
    id: 'razor',
    scopeName: 'text.html.cshtml',
    path: 'razor.tmLanguage.json'
  },
  {
    id: 'ruby',
    scopeName: 'source.ruby',
    path: 'ruby.tmLanguage.json',
    aliases: ['rb']
  },
  {
    id: 'rust',
    scopeName: 'source.rust',
    path: 'rust.tmLanguage.json'
  },
  {
    id: 'sas',
    scopeName: 'source.sas',
    path: 'sas.tmLanguage.json'
  },
  {
    id: 'sass',
    scopeName: 'source.sass',
    path: 'sass.tmLanguage.json'
  },
  {
    id: 'scala',
    scopeName: 'source.scala',
    path: 'scala.tmLanguage.json'
  },
  {
    id: 'scheme',
    scopeName: 'source.scheme',
    path: 'scheme.tmLanguage.json'
  },
  {
    id: 'scss',
    scopeName: 'source.css.scss',
    path: 'scss.tmLanguage.json'
  },
  {
    id: 'shaderlab',
    scopeName: 'source.shaderlab',
    path: 'shaderlab.tmLanguage.json',
    aliases: ['shader']
  },
  {
    id: 'shellscript',
    scopeName: 'source.shell',
    path: 'shellscript.tmLanguage.json',
    aliases: ['shell', 'bash', 'sh', 'zsh']
  },
  {
    id: 'smalltalk',
    scopeName: 'source.smalltalk',
    path: 'smalltalk.tmLanguage.json'
  },
  {
    id: 'sql',
    scopeName: 'source.sql',
    path: 'sql.tmLanguage.json'
  },
  {
    id: 'ssh-config',
    scopeName: 'source.ssh-config',
    path: 'ssh-config.tmLanguage.json'
  },
  {
    id: 'stylus',
    scopeName: 'source.stylus',
    path: 'stylus.tmLanguage.json',
    aliases: ['styl']
  },
  {
    id: 'swift',
    scopeName: 'source.swift',
    path: 'swift.tmLanguage.json'
  },
  {
    id: 'tcl',
    scopeName: 'source.tcl',
    path: 'tcl.tmLanguage.json'
  },
  {
    id: 'toml',
    scopeName: 'source.toml',
    path: 'toml.tmLanguage.json'
  },
  {
    id: 'ts',
    scopeName: 'documentation.injection.ts',
    path: 'ts.tmLanguage.json'
  },
  {
    id: 'tsx',
    scopeName: 'source.tsx',
    path: 'tsx.tmLanguage.json'
  },
  {
    id: 'typescript',
    scopeName: 'source.ts',
    path: 'typescript.tmLanguage.json',
    aliases: ['ts']
  },
  {
    id: 'vb',
    scopeName: 'source.asp.vb.net',
    path: 'vb.tmLanguage.json',
    aliases: ['cmd']
  },
  {
    id: 'viml',
    scopeName: 'source.viml',
    path: 'viml.tmLanguage.json'
  },
  {
    id: 'vue-html',
    scopeName: 'text.html.vue-html',
    path: 'vue-html.tmLanguage.json'
  },
  {
    id: 'vue',
    scopeName: 'source.vue',
    path: 'vue.tmLanguage.json'
  },
  {
    id: 'wasm',
    scopeName: 'source.wat',
    path: 'wasm.tmLanguage.json'
  },
  {
    id: 'xml',
    scopeName: 'text.xml',
    path: 'xml.tmLanguage.json'
  },
  {
    id: 'xsl',
    scopeName: 'text.xml.xsl',
    path: 'xsl.tmLanguage.json'
  },
  {
    id: 'yaml',
    scopeName: 'source.yaml',
    path: 'yaml.tmLanguage.json'
  },
  {
    id: '文言',
    scopeName: 'source.wenyan',
    path: '文言.tmLanguage.json',
    aliases: ['wenyan']
  }
]
