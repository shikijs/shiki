import { ILanguageRegistration } from './types'

export type Lang =
  | 'abap'
  | 'actionscript-3'
  | 'ada'
  | 'apache'
  | 'apex'
  | 'apl'
  | 'applescript'
  | 'asm'
  | 'astro'
  | 'awk'
  | 'ballerina'
  | 'bat' | 'batch'
  | 'berry' | 'be'
  | 'bibtex'
  | 'bicep'
  | 'blade'
  | 'c'
  | 'cadence' | 'cdc'
  | 'clarity'
  | 'clojure' | 'clj'
  | 'cmake'
  | 'cobol'
  | 'codeql' | 'ql'
  | 'coffee'
  | 'cpp'
  | 'crystal'
  | 'csharp' | 'c#'
  | 'css'
  | 'cue'
  | 'd'
  | 'dart'
  | 'diff'
  | 'docker'
  | 'dream-maker'
  | 'elixir'
  | 'elm'
  | 'erb'
  | 'erlang' | 'erl'
  | 'fish'
  | 'fsharp' | 'f#'
  | 'gherkin'
  | 'git-commit'
  | 'git-rebase'
  | 'glsl'
  | 'gnuplot'
  | 'go'
  | 'graphql'
  | 'groovy'
  | 'hack'
  | 'haml'
  | 'handlebars' | 'hbs'
  | 'haskell' | 'hs'
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
  | 'jssm' | 'fsl'
  | 'jsx'
  | 'julia'
  | 'kotlin'
  | 'latex'
  | 'less'
  | 'liquid'
  | 'lisp'
  | 'logo'
  | 'lua'
  | 'make' | 'makefile'
  | 'markdown' | 'md'
  | 'marko'
  | 'matlab'
  | 'mdx'
  | 'mermaid'
  | 'nginx'
  | 'nim'
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
  | 'prisma'
  | 'prolog'
  | 'pug' | 'jade'
  | 'puppet'
  | 'purescript'
  | 'python' | 'py'
  | 'r'
  | 'raku' | 'perl6'
  | 'razor'
  | 'rel'
  | 'riscv'
  | 'rst'
  | 'ruby' | 'rb'
  | 'rust' | 'rs'
  | 'sas'
  | 'sass'
  | 'scala'
  | 'scheme'
  | 'scss'
  | 'shaderlab' | 'shader'
  | 'shellscript' | 'shell' | 'bash' | 'sh' | 'zsh'
  | 'smalltalk'
  | 'solidity'
  | 'sparql'
  | 'sql'
  | 'ssh-config'
  | 'stata'
  | 'stylus' | 'styl'
  | 'svelte'
  | 'swift'
  | 'system-verilog'
  | 'tasl'
  | 'tcl'
  | 'tex'
  | 'toml'
  | 'tsx'
  | 'turtle'
  | 'twig'
  | 'typescript' | 'ts'
  | 'vb' | 'cmd'
  | 'verilog'
  | 'vhdl'
  | 'viml' | 'vim' | 'vimscript'
  | 'vue-html'
  | 'vue'
  | 'wasm'
  | 'wenyan' | '文言'
  | 'xml'
  | 'xsl'
  | 'yaml'
  | 'zenscript'

export const languages: ILanguageRegistration[] = [
  {
    id: 'abap',
    scopeName: 'source.abap',
    path: 'abap.tmLanguage.json',
    samplePath: 'abap.sample'
  },
  {
    id: 'actionscript-3',
    scopeName: 'source.actionscript.3',
    path: 'actionscript-3.tmLanguage.json',
    samplePath: 'actionscript-3.sample'
  },
  {
    id: 'ada',
    scopeName: 'source.ada',
    path: 'ada.tmLanguage.json',
    samplePath: 'ada.sample'
  },
  {
    id: 'apache',
    scopeName: 'source.apacheconf',
    path: 'apache.tmLanguage.json'
  },
  {
    id: 'apex',
    scopeName: 'source.apex',
    path: 'apex.tmLanguage.json',
    samplePath: 'apex.sample'
  },
  {
    id: 'apl',
    scopeName: 'source.apl',
    path: 'apl.tmLanguage.json',
    embeddedLangs: ['html', 'xml', 'css', 'javascript', 'json']
  },
  {
    id: 'applescript',
    scopeName: 'source.applescript',
    path: 'applescript.tmLanguage.json',
    samplePath: 'applescript.sample'
  },
  {
    id: 'asm',
    scopeName: 'source.asm.x86_64',
    path: 'asm.tmLanguage.json',
    samplePath: 'asm.sample'
  },
  {
    id: 'astro',
    scopeName: 'source.astro',
    path: 'astro.tmLanguage.json',
    samplePath: 'astro.sample',
    embeddedLangs: ['json', 'javascript', 'typescript', 'tsx', 'css', 'less', 'sass', 'scss', 'stylus']
  },
  {
    id: 'awk',
    scopeName: 'source.awk',
    path: 'awk.tmLanguage.json',
    samplePath: 'awk.sample'
  },
  {
    id: 'ballerina',
    scopeName: 'source.ballerina',
    path: 'ballerina.tmLanguage.json',
    samplePath: 'ballerina.sample'
  },
  {
    id: 'bat',
    scopeName: 'source.batchfile',
    path: 'bat.tmLanguage.json',
    samplePath: 'bat.sample',
    aliases: ['batch']
  },
  {
    id: 'berry',
    scopeName: 'source.berry',
    path: 'berry.tmLanguage.json',
    samplePath: 'berry.sample',
    aliases: ['be']
  },
  {
    id: 'bibtex',
    scopeName: 'text.bibtex',
    path: 'bibtex.tmLanguage.json'
  },
  {
    id: 'bicep',
    scopeName: 'source.bicep',
    path: 'bicep.tmLanguage.json',
    samplePath: 'bicep.sample'
  },
  {
    id: 'blade',
    scopeName: 'text.html.php.blade',
    path: 'blade.tmLanguage.json',
    samplePath: 'blade.sample',
    embeddedLangs: ['html', 'xml', 'sql', 'javascript', 'json', 'css']
  },
  {
    id: 'c',
    scopeName: 'source.c',
    path: 'c.tmLanguage.json',
    samplePath: 'c.sample'
  },
  {
    id: 'cadence',
    scopeName: 'source.cadence',
    path: 'cadence.tmLanguage.json',
    samplePath: 'cadence.sample',
    aliases: ['cdc']
  },
  {
    id: 'clarity',
    scopeName: 'source.clar',
    path: 'clarity.tmLanguage.json',
    samplePath: 'clarity.sample'
  },
  {
    id: 'clojure',
    scopeName: 'source.clojure',
    path: 'clojure.tmLanguage.json',
    samplePath: 'clojure.sample',
    aliases: ['clj']
  },
  {
    id: 'cmake',
    scopeName: 'source.cmake',
    path: 'cmake.tmLanguage.json',
    samplePath: 'cmake.sample'
  },
  {
    id: 'cobol',
    scopeName: 'source.cobol',
    path: 'cobol.tmLanguage.json',
    samplePath: 'cobol.sample',
    embeddedLangs: ['sql', 'html', 'java']
  },
  {
    id: 'codeql',
    scopeName: 'source.ql',
    path: 'codeql.tmLanguage.json',
    samplePath: 'codeql.sample',
    aliases: ['ql'],
    embeddedLangs: ['markdown']
  },
  {
    id: 'coffee',
    scopeName: 'source.coffee',
    path: 'coffee.tmLanguage.json',
    samplePath: 'coffee.sample',
    embeddedLangs: ['javascript']
  },
  {
    id: 'cpp',
    scopeName: 'source.cpp',
    path: 'cpp.tmLanguage.json',
    samplePath: 'cpp.sample',
    embeddedLangs: ['glsl', 'sql']
  },
  {
    id: 'crystal',
    scopeName: 'source.crystal',
    path: 'crystal.tmLanguage.json',
    samplePath: 'crystal.sample',
    embeddedLangs: ['html', 'sql', 'css', 'c', 'javascript', 'shellscript']
  },
  {
    id: 'csharp',
    scopeName: 'source.cs',
    path: 'csharp.tmLanguage.json',
    samplePath: 'csharp.sample',
    aliases: ['c#']
  },
  {
    id: 'css',
    scopeName: 'source.css',
    path: 'css.tmLanguage.json',
    samplePath: 'css.sample'
  },
  {
    id: 'cue',
    scopeName: 'source.cue',
    path: 'cue.tmLanguage.json',
    samplePath: 'cue.sample'
  },
  {
    id: 'd',
    scopeName: 'source.d',
    path: 'd.tmLanguage.json',
    samplePath: 'd.sample'
  },
  {
    id: 'dart',
    scopeName: 'source.dart',
    path: 'dart.tmLanguage.json',
    samplePath: 'dart.sample'
  },
  {
    id: 'diff',
    scopeName: 'source.diff',
    path: 'diff.tmLanguage.json',
    samplePath: 'diff.sample'
  },
  {
    id: 'docker',
    scopeName: 'source.dockerfile',
    path: 'docker.tmLanguage.json',
    samplePath: 'docker.sample'
  },
  {
    id: 'dream-maker',
    scopeName: 'source.dm',
    path: 'dream-maker.tmLanguage.json'
  },
  {
    id: 'elixir',
    scopeName: 'source.elixir',
    path: 'elixir.tmLanguage.json',
    samplePath: 'elixir.sample',
    embeddedLangs: ['html']
  },
  {
    id: 'elm',
    scopeName: 'source.elm',
    path: 'elm.tmLanguage.json',
    samplePath: 'elm.sample',
    embeddedLangs: ['glsl']
  },
  {
    id: 'erb',
    scopeName: 'text.html.erb',
    path: 'erb.tmLanguage.json',
    samplePath: 'erb.sample',
    embeddedLangs: ['html', 'ruby']
  },
  {
    id: 'erlang',
    scopeName: 'source.erlang',
    path: 'erlang.tmLanguage.json',
    samplePath: 'erlang.sample',
    aliases: ['erl']
  },
  {
    id: 'fish',
    scopeName: 'source.fish',
    path: 'fish.tmLanguage.json',
    samplePath: 'fish.sample'
  },
  {
    id: 'fsharp',
    scopeName: 'source.fsharp',
    path: 'fsharp.tmLanguage.json',
    samplePath: 'fsharp.sample',
    aliases: ['f#'],
    embeddedLangs: ['markdown']
  },
  {
    id: 'gherkin',
    scopeName: 'text.gherkin.feature',
    path: 'gherkin.tmLanguage.json'
  },
  {
    id: 'git-commit',
    scopeName: 'text.git-commit',
    path: 'git-commit.tmLanguage.json',
    embeddedLangs: ['diff']
  },
  {
    id: 'git-rebase',
    scopeName: 'text.git-rebase',
    path: 'git-rebase.tmLanguage.json',
    embeddedLangs: ['shellscript']
  },
  {
    id: 'glsl',
    scopeName: 'source.glsl',
    path: 'glsl.tmLanguage.json',
    samplePath: 'glsl.sample',
    embeddedLangs: ['c']
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
    path: 'graphql.tmLanguage.json',
    embeddedLangs: ['javascript', 'typescript', 'jsx', 'tsx']
  },
  {
    id: 'groovy',
    scopeName: 'source.groovy',
    path: 'groovy.tmLanguage.json'
  },
  {
    id: 'hack',
    scopeName: 'source.hack',
    path: 'hack.tmLanguage.json',
    embeddedLangs: ['html', 'sql']
  },
  {
    id: 'haml',
    scopeName: 'text.haml',
    path: 'haml.tmLanguage.json',
    embeddedLangs: ['ruby', 'javascript', 'sass', 'coffee', 'markdown', 'css']
  },
  {
    id: 'handlebars',
    scopeName: 'text.html.handlebars',
    path: 'handlebars.tmLanguage.json',
    aliases: ['hbs'],
    embeddedLangs: ['html', 'css', 'javascript', 'yaml']
  },
  {
    id: 'haskell',
    scopeName: 'source.haskell',
    path: 'haskell.tmLanguage.json',
    aliases: ['hs']
  },
  {
    id: 'hcl',
    scopeName: 'source.hcl',
    path: 'hcl.tmLanguage.json',
    samplePath: 'hcl.sample'
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
    samplePath: 'html.sample',
    embeddedLangs: ['javascript', 'css']
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
    path: 'jinja-html.tmLanguage.json',
    embeddedLangs: ['html']
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
    id: 'jssm',
    scopeName: 'source.jssm',
    path: 'jssm.tmLanguage.json',
    samplePath: 'jssm.sample',
    aliases: ['fsl']
  },
  {
    id: 'jsx',
    scopeName: 'source.js.jsx',
    path: 'jsx.tmLanguage.json'
  },
  {
    id: 'julia',
    scopeName: 'source.julia',
    path: 'julia.tmLanguage.json',
    embeddedLangs: ['cpp', 'python', 'javascript', 'r', 'sql']
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
    embeddedLangs: ['tex', 'css', 'haskell', 'html', 'xml', 'java', 'lua', 'julia', 'ruby', 'javascript', 'typescript', 'python', 'yaml', 'scala', 'gnuplot']
  },
  {
    id: 'less',
    scopeName: 'source.css.less',
    path: 'less.tmLanguage.json',
    embeddedLangs: ['css']
  },
  {
    id: 'liquid',
    scopeName: 'text.html.liquid',
    path: 'liquid.tmLanguage.json',
    samplePath: 'liquid.sample',
    embeddedLangs: ['html', 'css', 'json', 'javascript']
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
    path: 'lua.tmLanguage.json',
    embeddedLangs: ['c']
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
    aliases: ['md'],
    embeddedLangs: ['css', 'html', 'ini', 'java', 'lua', 'make', 'perl', 'r', 'ruby', 'php', 'sql', 'vb', 'xml', 'xsl', 'yaml', 'bat', 'clojure', 'coffee', 'c', 'cpp', 'diff', 'docker', 'git-commit', 'git-rebase', 'go', 'groovy', 'pug', 'javascript', 'json', 'jsonc', 'less', 'objective-c', 'swift', 'scss', 'raku', 'powershell', 'python', 'julia', 'rust', 'scala', 'shellscript', 'typescript', 'tsx', 'csharp', 'fsharp', 'dart', 'handlebars', 'erlang', 'elixir', 'latex', 'bibtex']
  },
  {
    id: 'marko',
    scopeName: 'text.marko',
    path: 'marko.tmLanguage.json',
    samplePath: 'marko.sample',
    embeddedLangs: ['css', 'less', 'scss', 'typescript']
  },
  {
    id: 'matlab',
    scopeName: 'source.matlab',
    path: 'matlab.tmLanguage.json'
  },
  {
    id: 'mdx',
    scopeName: 'text.html.markdown.jsx',
    path: 'mdx.tmLanguage.json',
    embeddedLangs: ['jsx', 'markdown']
  },
  {
    id: 'mermaid',
    scopeName: 'source.mermaid',
    path: 'mermaid.tmLanguage.json'
  },
  {
    id: 'nginx',
    scopeName: 'source.nginx',
    path: 'nginx.tmLanguage.json',
    embeddedLangs: ['lua']
  },
  {
    id: 'nim',
    scopeName: 'source.nim',
    path: 'nim.tmLanguage.json',
    embeddedLangs: ['c', 'html', 'xml', 'javascript', 'css', 'glsl', 'markdown']
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
    path: 'perl.tmLanguage.json',
    embeddedLangs: ['html', 'xml', 'css', 'javascript', 'sql']
  },
  {
    id: 'php',
    scopeName: 'source.php',
    path: 'php.tmLanguage.json',
    embeddedLangs: ['html', 'xml', 'sql', 'javascript', 'json', 'css']
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
    id: 'prisma',
    scopeName: 'source.prisma',
    path: 'prisma.tmLanguage.json',
    samplePath: 'prisma.sample'
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
    aliases: ['jade'],
    embeddedLangs: ['javascript', 'css', 'sass', 'stylus', 'coffee', 'html']
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
    path: 'razor.tmLanguage.json',
    embeddedLangs: ['html', 'csharp']
  },
  {
    id: 'rel',
    scopeName: 'source.rel',
    path: 'rel.tmLanguage.json',
    samplePath: 'rel.sample'
  },
  {
    id: 'riscv',
    scopeName: 'source.riscv',
    path: 'riscv.tmLanguage.json'
  },
  {
    id: 'rst',
    scopeName: 'source.rst',
    path: 'rst.tmLanguage.json',
    embeddedLangs: ['cpp', 'python', 'javascript', 'shellscript', 'yaml', 'cmake', 'ruby']
  },
  {
    id: 'ruby',
    scopeName: 'source.ruby',
    path: 'ruby.tmLanguage.json',
    samplePath: 'ruby.sample',
    aliases: ['rb'],
    embeddedLangs: ['html', 'xml', 'sql', 'css', 'c', 'javascript', 'shellscript', 'lua']
  },
  {
    id: 'rust',
    scopeName: 'source.rust',
    path: 'rust.tmLanguage.json',
    aliases: ['rs']
  },
  {
    id: 'sas',
    scopeName: 'source.sas',
    path: 'sas.tmLanguage.json',
    embeddedLangs: ['sql']
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
    path: 'scss.tmLanguage.json',
    embeddedLangs: ['css']
  },
  {
    id: 'shaderlab',
    scopeName: 'source.shaderlab',
    path: 'shaderlab.tmLanguage.json',
    aliases: ['shader'],
    embeddedLangs: ['hlsl']
  },
  {
    id: 'shellscript',
    scopeName: 'source.shell',
    path: 'shellscript.tmLanguage.json',
    aliases: ['shell', 'bash', 'sh', 'zsh'],
    embeddedLangs: ['ruby', 'python', 'applescript', 'html', 'markdown']
  },
  {
    id: 'smalltalk',
    scopeName: 'source.smalltalk',
    path: 'smalltalk.tmLanguage.json'
  },
  {
    id: 'solidity',
    scopeName: 'source.solidity',
    path: 'solidity.tmLanguage.json'
  },
  {
    id: 'sparql',
    scopeName: 'source.sparql',
    path: 'sparql.tmLanguage.json',
    samplePath: 'sparql.sample',
    embeddedLangs: ['turtle']
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
    id: 'stata',
    scopeName: 'source.stata',
    path: 'stata.tmLanguage.json',
    samplePath: 'stata.sample',
    embeddedLangs: ['sql']
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
    path: 'svelte.tmLanguage.json',
    embeddedLangs: ['javascript', 'typescript', 'coffee', 'stylus', 'sass', 'css', 'scss', 'less', 'postcss', 'pug', 'markdown']
  },
  {
    id: 'swift',
    scopeName: 'source.swift',
    path: 'swift.tmLanguage.json'
  },
  {
    id: 'system-verilog',
    scopeName: 'source.systemverilog',
    path: 'system-verilog.tmLanguage.json'
  },
  {
    id: 'tasl',
    scopeName: 'source.tasl',
    path: 'tasl.tmLanguage.json',
    samplePath: 'tasl.sample'
  },
  {
    id: 'tcl',
    scopeName: 'source.tcl',
    path: 'tcl.tmLanguage.json'
  },
  {
    id: 'tex',
    scopeName: 'text.tex',
    path: 'tex.tmLanguage.json',
    embeddedLangs: ['r']
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
    id: 'turtle',
    scopeName: 'source.turtle',
    path: 'turtle.tmLanguage.json',
    samplePath: 'turtle.sample'
  },
  {
    id: 'twig',
    scopeName: 'text.html.twig',
    path: 'twig.tmLanguage.json',
    embeddedLangs: ['css', 'javascript', 'php', 'python', 'ruby']
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
    id: 'verilog',
    scopeName: 'source.verilog',
    path: 'verilog.tmLanguage.json'
  },
  {
    id: 'vhdl',
    scopeName: 'source.vhdl',
    path: 'vhdl.tmLanguage.json'
  },
  {
    id: 'viml',
    scopeName: 'source.viml',
    path: 'viml.tmLanguage.json',
    aliases: ['vim', 'vimscript']
  },
  {
    id: 'vue-html',
    scopeName: 'text.html.vue-html',
    path: 'vue-html.tmLanguage.json',
    embeddedLangs: ['vue', 'javascript']
  },
  {
    id: 'vue',
    scopeName: 'source.vue',
    path: 'vue.tmLanguage.json',
    embeddedLangs: ['json', 'markdown', 'pug', 'haml', 'liquid', 'vue-html', 'sass', 'scss', 'less', 'stylus', 'postcss', 'css', 'typescript', 'coffee', 'javascript']
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
    path: 'xml.tmLanguage.json',
    embeddedLangs: ['java']
  },
  {
    id: 'xsl',
    scopeName: 'text.xml.xsl',
    path: 'xsl.tmLanguage.json',
    embeddedLangs: ['xml']
  },
  {
    id: 'yaml',
    scopeName: 'source.yaml',
    path: 'yaml.tmLanguage.json'
  },
  {
    id: 'zenscript',
    scopeName: 'source.zenscript',
    path: 'zenscript.tmLanguage.json',
    samplePath: 'zenscript.sample'
  }
]
