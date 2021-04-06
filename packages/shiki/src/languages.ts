import { ILanguageRegistration } from './types'

export type Lang =
  | 'abap'
  | 'actionscript-3'
  | 'ada'
  | 'apex'
  | 'applescript'
  | 'asm'
  | 'awk'
  | 'bat' | 'batch'
  | 'c'
  | 'clojure' | 'clj'
  | 'cobol'
  | 'coffee'
  | 'cpp'
  | 'crystal'
  | 'csharp' | 'c#'
  | 'css'
  | 'd'
  | 'dart'
  | 'diff'
  | 'docker'
  | 'elixir'
  | 'elm'
  | 'erb'
  | 'erlang'
  | 'fsharp' | 'f#'
  | 'git-commit'
  | 'git-rebase'
  | 'gnuplot'
  | 'go'
  | 'graphql'
  | 'groovy'
  | 'hack'
  | 'haml'
  | 'handlebars' | 'hbs'
  | 'haskell'
  | 'hcl'
  | 'hlsl'
  | 'html'
  | 'ini'
  | 'java'
  | 'javascript' | 'js'
  | 'jinja-html'
  | 'json'
  | 'jsonc'
  | 'jsonnet'
  | 'jsx'
  | 'julia'
  | 'kotlin'
  | 'latex' | 'tex'
  | 'less'
  | 'lisp'
  | 'logo'
  | 'lua'
  | 'make' | 'makefile'
  | 'markdown' | 'md'
  | 'matlab'
  | 'mdx'
  | 'nix'
  | 'objective-c' | 'objc'
  | 'objective-cpp'
  | 'ocaml'
  | 'pascal'
  | 'perl'
  | 'php'
  | 'plsql'
  | 'postcss'
  | 'powershell' | 'ps' | 'ps1'
  | 'prolog'
  | 'pug' | 'jade'
  | 'puppet'
  | 'purescript'
  | 'python' | 'py'
  | 'r'
  | 'raku' | 'perl6'
  | 'razor'
  | 'ruby' | 'rb'
  | 'rust'
  | 'sas'
  | 'sass'
  | 'scala'
  | 'scheme'
  | 'scss'
  | 'shaderlab' | 'shader'
  | 'shellscript' | 'shell' | 'bash' | 'sh' | 'zsh'
  | 'smalltalk'
  | 'sql'
  | 'ssh-config'
  | 'stylus' | 'styl'
  | 'svelte'
  | 'swift'
  | 'tcl'
  | 'toml'
  | 'tsx'
  | 'typescript' | 'ts'
  | 'vb' | 'cmd'
  | 'viml'
  | 'vue'
  | 'wasm'
  | 'wenyan' | '文言'
  | 'xml'
  | 'xsl'
  | 'yaml'

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
    path: 'c.tmLanguage.json',
    samplePath: 'c.sample'
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
    scopeName: 'source.cpp',
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
    path: 'css.tmLanguage.json',
    samplePath: 'css.sample'
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
    id: 'docker',
    scopeName: 'source.dockerfile',
    path: 'docker.tmLanguage.json'
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
    id: 'erb',
    scopeName: 'text.html.erb',
    path: 'erb.tmLanguage.json'
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
    id: 'gnuplot',
    scopeName: 'source.gnuplot',
    path: 'gnuplot.tmLanguage.json'
  },
  {
    id: 'go',
    scopeName: 'source.go',
    path: 'go.tmLanguage.json',
    samplePath: 'go.sample'
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
    id: 'html',
    scopeName: 'text.html.basic',
    path: 'html.tmLanguage.json',
    samplePath: 'html.sample'
  },
  {
    id: 'ini',
    scopeName: 'source.ini',
    path: 'ini.tmLanguage.json'
  },
  {
    id: 'java',
    scopeName: 'source.java',
    path: 'java.tmLanguage.json',
    samplePath: 'java.sample'
  },
  {
    id: 'javascript',
    scopeName: 'source.js',
    path: 'javascript.tmLanguage.json',
    samplePath: 'javascript.sample',
    aliases: ['js']
  },
  {
    id: 'jinja-html',
    scopeName: 'text.html.jinja',
    path: 'jinja-html.tmLanguage.json'
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
    scopeName: 'source.js.jsx',
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
    id: 'make',
    scopeName: 'source.makefile',
    path: 'make.tmLanguage.json',
    aliases: ['makefile']
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
    id: 'mdx',
    scopeName: 'text.html.markdown.jsx',
    path: 'mdx.tmLanguage.json'
  },
  {
    id: 'nix',
    scopeName: 'source.nix',
    path: 'nix.tmLanguage.json'
  },
  {
    id: 'objective-c',
    scopeName: 'source.objc',
    path: 'objective-c.tmLanguage.json',
    aliases: ['objc']
  },
  {
    id: 'objective-cpp',
    scopeName: 'source.objcpp',
    path: 'objective-cpp.tmLanguage.json'
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
    id: 'php',
    scopeName: 'source.php',
    path: 'php.tmLanguage.json'
  },
  {
    id: 'plsql',
    scopeName: 'source.plsql.oracle',
    path: 'plsql.tmLanguage.json'
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
    samplePath: 'python.sample',
    aliases: ['py']
  },
  {
    id: 'r',
    scopeName: 'source.r',
    path: 'r.tmLanguage.json'
  },
  {
    id: 'raku',
    scopeName: 'source.perl.6',
    path: 'raku.tmLanguage.json',
    aliases: ['perl6']
  },
  {
    id: 'razor',
    scopeName: 'text.aspnetcorerazor',
    path: 'razor.tmLanguage.json'
  },
  {
    id: 'ruby',
    scopeName: 'source.ruby',
    path: 'ruby.tmLanguage.json',
    samplePath: 'ruby.sample',
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
    id: 'svelte',
    scopeName: 'source.svelte',
    path: 'svelte.tmLanguage.json'
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
    id: 'tsx',
    scopeName: 'source.tsx',
    path: 'tsx.tmLanguage.json',
    samplePath: 'tsx.sample'
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
    id: 'wenyan',
    scopeName: 'source.wenyan',
    path: 'wenyan.tmLanguage.json',
    aliases: ['文言']
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
  }
]
