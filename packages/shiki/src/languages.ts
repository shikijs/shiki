import { ILanguageRegistration } from './types'

export type Lang =
  | 'abap'
  | 'actionscript-3'
  | 'ada'
  | 'apache'
  | 'apex'
  | 'apl'
  | 'applescript'
  | 'ara'
  | 'asm'
  | 'astro'
  | 'awk'
  | 'ballerina'
  | 'bat' | 'batch'
  | 'beancount'
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
  | 'csharp' | 'c#' | 'cs'
  | 'css'
  | 'cue'
  | 'cypher' | 'cql'
  | 'd'
  | 'dart'
  | 'dax'
  | 'diff'
  | 'docker' | 'dockerfile'
  | 'dream-maker'
  | 'elixir'
  | 'elm'
  | 'erb'
  | 'erlang' | 'erl'
  | 'fish'
  | 'fsharp' | 'f#' | 'fs'
  | 'gdresource'
  | 'gdscript'
  | 'gdshader'
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
  | 'hjson'
  | 'hlsl'
  | 'html'
  | 'http'
  | 'imba'
  | 'ini' | 'properties'
  | 'java'
  | 'javascript' | 'js'
  | 'jinja-html'
  | 'jison'
  | 'json'
  | 'json5'
  | 'jsonc'
  | 'jsonl'
  | 'jsonnet'
  | 'jssm' | 'fsl'
  | 'jsx'
  | 'julia'
  | 'kotlin'
  | 'kusto' | 'kql'
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
  | 'nextflow' | 'nf'
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
  | 'powerquery'
  | 'powershell' | 'ps' | 'ps1'
  | 'prisma'
  | 'prolog'
  | 'proto'
  | 'pug' | 'jade'
  | 'puppet'
  | 'purescript'
  | 'python' | 'py'
  | 'r'
  | 'raku' | 'perl6'
  | 'razor'
  | 'reg'
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
  | 'shellscript' | 'bash' | 'console' | 'sh' | 'shell' | 'zsh'
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
  | 'v'
  | 'vb' | 'cmd'
  | 'verilog'
  | 'vhdl'
  | 'viml' | 'vim' | 'vimscript'
  | 'vue-html'
  | 'vue'
  | 'vyper' | 'vy'
  | 'wasm'
  | 'wenyan' | '文言'
  | 'wgsl'
  | 'wolfram'
  | 'xml'
  | 'xsl'
  | 'yaml' | 'yml'
  | 'zenscript'

export const languages: (ILanguageRegistration & { displayName: string })[] = [
  {
    id: 'abap',
    scopeName: 'source.abap',
    displayName: 'ABAP',
    path: 'abap.tmLanguage.json',
    samplePath: 'abap.sample'
  },
  {
    id: 'actionscript-3',
    scopeName: 'source.actionscript.3',
    displayName: 'ActionScript 3',
    path: 'actionscript-3.tmLanguage.json',
    samplePath: 'actionscript-3.sample'
  },
  {
    id: 'ada',
    scopeName: 'source.ada',
    displayName: 'Ada',
    path: 'ada.tmLanguage.json',
    samplePath: 'ada.sample'
  },
  {
    id: 'apache',
    scopeName: 'source.apacheconf',
    displayName: 'ApacheConf',
    path: 'apache.tmLanguage.json'
  },
  {
    id: 'apex',
    scopeName: 'source.apex',
    displayName: 'Apex',
    path: 'apex.tmLanguage.json',
    samplePath: 'apex.sample'
  },
  {
    id: 'apl',
    scopeName: 'source.apl',
    displayName: 'APL',
    path: 'apl.tmLanguage.json',
    embeddedLangs: ['html', 'xml', 'css', 'javascript', 'json']
  },
  {
    id: 'applescript',
    scopeName: 'source.applescript',
    displayName: 'AppleScript',
    path: 'applescript.tmLanguage.json',
    samplePath: 'applescript.sample'
  },
  {
    id: 'ara',
    scopeName: 'source.ara',
    displayName: 'Ara',
    path: 'ara.tmLanguage.json',
    samplePath: 'ara.sample'
  },
  {
    id: 'asm',
    scopeName: 'source.asm.x86_64',
    displayName: 'Assembly',
    path: 'asm.tmLanguage.json',
    samplePath: 'asm.sample'
  },
  {
    id: 'astro',
    scopeName: 'source.astro',
    displayName: 'Astro',
    path: 'astro.tmLanguage.json',
    samplePath: 'astro.sample',
    embeddedLangs: ['json', 'javascript', 'typescript', 'stylus', 'sass', 'css', 'scss', 'less', 'postcss', 'tsx']
  },
  {
    id: 'awk',
    scopeName: 'source.awk',
    displayName: 'AWK',
    path: 'awk.tmLanguage.json',
    samplePath: 'awk.sample'
  },
  {
    id: 'ballerina',
    displayName: 'Ballerina',
    scopeName: 'source.ballerina',
    path: 'ballerina.tmLanguage.json',
    samplePath: 'ballerina.sample'
  },
  {
    id: 'bat',
    scopeName: 'source.batchfile',
    displayName: 'Batch',
    path: 'bat.tmLanguage.json',
    samplePath: 'bat.sample',
    aliases: ['batch']
  },
  {
    id: 'beancount',
    scopeName: 'text.beancount',
    displayName: 'Beancount',
    path: 'beancount.tmLanguage.json',
    samplePath: 'beancount.sample'
  },
  {
    id: 'berry',
    scopeName: 'source.berry',
    displayName: 'Berry',
    path: 'berry.tmLanguage.json',
    samplePath: 'berry.sample',
    aliases: ['be']
  },
  {
    id: 'bibtex',
    scopeName: 'text.bibtex',
    displayName: 'BibTeX',
    path: 'bibtex.tmLanguage.json'
  },
  {
    id: 'bicep',
    scopeName: 'source.bicep',
    displayName: 'Bicep',
    path: 'bicep.tmLanguage.json',
    samplePath: 'bicep.sample'
  },
  {
    id: 'blade',
    scopeName: 'text.html.php.blade',
    displayName: 'Blade',
    path: 'blade.tmLanguage.json',
    samplePath: 'blade.sample',
    embeddedLangs: ['html', 'xml', 'sql', 'javascript', 'json', 'css']
  },
  {
    id: 'c',
    scopeName: 'source.c',
    displayName: 'C',
    path: 'c.tmLanguage.json',
    samplePath: 'c.sample'
  },
  {
    id: 'cadence',
    scopeName: 'source.cadence',
    displayName: 'Cadence',
    path: 'cadence.tmLanguage.json',
    samplePath: 'cadence.sample',
    aliases: ['cdc']
  },
  {
    id: 'clarity',
    scopeName: 'source.clar',
    displayName: 'Clarity',
    path: 'clarity.tmLanguage.json',
    samplePath: 'clarity.sample'
  },
  {
    id: 'clojure',
    scopeName: 'source.clojure',
    displayName: 'Clojure',
    path: 'clojure.tmLanguage.json',
    samplePath: 'clojure.sample',
    aliases: ['clj']
  },
  {
    id: 'cmake',
    scopeName: 'source.cmake',
    displayName: 'CMake',
    path: 'cmake.tmLanguage.json',
    samplePath: 'cmake.sample'
  },
  {
    id: 'cobol',
    scopeName: 'source.cobol',
    displayName: 'COBOL',
    path: 'cobol.tmLanguage.json',
    samplePath: 'cobol.sample',
    embeddedLangs: ['sql', 'html', 'java']
  },
  {
    id: 'codeql',
    scopeName: 'source.ql',
    displayName: 'CodeQL',
    path: 'codeql.tmLanguage.json',
    samplePath: 'codeql.sample',
    aliases: ['ql'],
    embeddedLangs: ['markdown']
  },
  {
    id: 'coffee',
    scopeName: 'source.coffee',
    displayName: 'CoffeeScript',
    path: 'coffee.tmLanguage.json',
    samplePath: 'coffee.sample',
    embeddedLangs: ['javascript']
  },
  {
    id: 'cpp',
    scopeName: 'source.cpp',
    displayName: 'C++',
    path: 'cpp.tmLanguage.json',
    samplePath: 'cpp.sample',
    embeddedLangs: ['glsl', 'sql']
  },
  {
    id: 'crystal',
    scopeName: 'source.crystal',
    displayName: 'Crystal',
    path: 'crystal.tmLanguage.json',
    samplePath: 'crystal.sample',
    embeddedLangs: ['html', 'sql', 'css', 'c', 'javascript', 'shellscript']
  },
  {
    id: 'csharp',
    scopeName: 'source.cs',
    displayName: 'C#',
    path: 'csharp.tmLanguage.json',
    samplePath: 'csharp.sample',
    aliases: ['c#', 'cs']
  },
  {
    id: 'css',
    scopeName: 'source.css',
    displayName: 'CSS',
    path: 'css.tmLanguage.json',
    samplePath: 'css.sample'
  },
  {
    id: 'cue',
    scopeName: 'source.cue',
    displayName: 'CUE',
    path: 'cue.tmLanguage.json',
    samplePath: 'cue.sample'
  },
  {
    id: 'cypher',
    scopeName: 'source.cypher',
    path: 'cypher.tmLanguage.json',
    samplePath: 'cypher.sample',
    aliases: ['cql']
  },
  {
    id: 'd',
    scopeName: 'source.d',
    displayName: 'D',
    path: 'd.tmLanguage.json',
    samplePath: 'd.sample'
  },
  {
    id: 'dart',
    scopeName: 'source.dart',
    displayName: 'Dart',
    path: 'dart.tmLanguage.json',
    samplePath: 'dart.sample'
  },
  {
    id: 'dax',
    scopeName: 'source.dax',
    displayName: 'DAX',
    path: 'dax.tmLanguage.json',
    samplePath: 'dax.sample'
  },
  {
    id: 'diff',
    scopeName: 'source.diff',
    displayName: 'Diff',
    path: 'diff.tmLanguage.json',
    samplePath: 'diff.sample'
  },
  {
    id: 'docker',
    scopeName: 'source.dockerfile',
    displayName: 'Docker',
    path: 'docker.tmLanguage.json',
    samplePath: 'docker.sample',
    aliases: ['dockerfile']
  },
  {
    id: 'dream-maker',
    scopeName: 'source.dm',
    displayName: 'DreamMaker',
    path: 'dream-maker.tmLanguage.json'
  },
  {
    id: 'elixir',
    scopeName: 'source.elixir',
    displayName: 'Elixir',
    path: 'elixir.tmLanguage.json',
    samplePath: 'elixir.sample',
    embeddedLangs: ['html']
  },
  {
    id: 'elm',
    scopeName: 'source.elm',
    displayName: 'Elm',
    path: 'elm.tmLanguage.json',
    samplePath: 'elm.sample',
    embeddedLangs: ['glsl']
  },
  {
    id: 'erb',
    scopeName: 'text.html.erb',
    displayName: 'ERB',
    path: 'erb.tmLanguage.json',
    samplePath: 'erb.sample',
    embeddedLangs: ['html', 'ruby']
  },
  {
    id: 'erlang',
    scopeName: 'source.erlang',
    displayName: 'Erlang',
    path: 'erlang.tmLanguage.json',
    samplePath: 'erlang.sample',
    aliases: ['erl']
  },
  {
    id: 'fish',
    scopeName: 'source.fish',
    displayName: 'fish',
    path: 'fish.tmLanguage.json',
    samplePath: 'fish.sample'
  },
  {
    id: 'fsharp',
    scopeName: 'source.fsharp',
    displayName: 'F#',
    path: 'fsharp.tmLanguage.json',
    samplePath: 'fsharp.sample',
    aliases: ['f#', 'fs'],
    embeddedLangs: ['markdown']
  },
  {
    id: 'gdresource',
    scopeName: 'source.gdresource',
    displayName: 'GDResource',
    path: 'gdresource.tmLanguage.json',
    samplePath: 'gdresource.sample',
    embeddedLangs: ['gdshader', 'gdscript']
  },
  {
    id: 'gdscript',
    scopeName: 'source.gdscript',
    displayName: 'GDScript',
    path: 'gdscript.tmLanguage.json',
    samplePath: 'gdscript.sample'
  },
  {
    id: 'gdshader',
    scopeName: 'source.gdshader',
    displayName: 'GDShader',
    path: 'gdshader.tmLanguage.json',
    samplePath: 'gdshader.sample'
  },
  {
    id: 'gherkin',
    scopeName: 'text.gherkin.feature',
    displayName: 'Gherkin',
    path: 'gherkin.tmLanguage.json'
  },
  {
    id: 'git-commit',
    scopeName: 'text.git-commit',
    displayName: 'Git Commit Message',
    path: 'git-commit.tmLanguage.json',
    embeddedLangs: ['diff']
  },
  {
    id: 'git-rebase',
    scopeName: 'text.git-rebase',
    displayName: 'Git Rebase Message',
    path: 'git-rebase.tmLanguage.json',
    embeddedLangs: ['shellscript']
  },
  {
    id: 'glsl',
    scopeName: 'source.glsl',
    displayName: 'GLSL',
    path: 'glsl.tmLanguage.json',
    samplePath: 'glsl.sample',
    embeddedLangs: ['c']
  },
  {
    id: 'gnuplot',
    scopeName: 'source.gnuplot',
    displayName: 'Gnuplot',
    path: 'gnuplot.tmLanguage.json'
  },
  {
    id: 'go',
    scopeName: 'source.go',
    displayName: 'Go',
    path: 'go.tmLanguage.json',
    samplePath: 'go.sample'
  },
  {
    id: 'graphql',
    scopeName: 'source.graphql',
    displayName: 'GraphQL',
    path: 'graphql.tmLanguage.json',
    embeddedLangs: ['javascript', 'typescript', 'jsx', 'tsx']
  },
  {
    id: 'groovy',
    scopeName: 'source.groovy',
    displayName: 'Groovy',
    path: 'groovy.tmLanguage.json'
  },
  {
    id: 'hack',
    scopeName: 'source.hack',
    displayName: 'Hack',
    path: 'hack.tmLanguage.json',
    embeddedLangs: ['html', 'sql']
  },
  {
    id: 'haml',
    scopeName: 'text.haml',
    displayName: 'Haml',
    path: 'haml.tmLanguage.json',
    embeddedLangs: ['ruby', 'javascript', 'sass', 'coffee', 'markdown', 'css']
  },
  {
    id: 'handlebars',
    scopeName: 'text.html.handlebars',
    displayName: 'Handlebars',
    path: 'handlebars.tmLanguage.json',
    aliases: ['hbs'],
    embeddedLangs: ['html', 'css', 'javascript', 'yaml']
  },
  {
    id: 'haskell',
    scopeName: 'source.haskell',
    displayName: 'Haskell',
    path: 'haskell.tmLanguage.json',
    aliases: ['hs']
  },
  {
    id: 'hcl',
    scopeName: 'source.hcl',
    displayName: 'HCL',
    path: 'hcl.tmLanguage.json',
    samplePath: 'hcl.sample'
  },
  {
    id: 'hjson',
    scopeName: 'source.hjson',
    path: 'hjson.tmLanguage.json',
    samplePath: 'hjson.sample'
  },
  {
    id: 'hlsl',
    scopeName: 'source.hlsl',
    displayName: 'HLSL',
    path: 'hlsl.tmLanguage.json'
  },
  {
    id: 'html',
    scopeName: 'text.html.basic',
    displayName: 'HTML',
    path: 'html.tmLanguage.json',
    samplePath: 'html.sample',
    embeddedLangs: ['javascript', 'css']
  },
  {
    id: 'http',
    scopeName: 'source.http',
    displayName: 'HTTP',
    path: 'http.tmLanguage.json',
    samplePath: 'http.sample',
    embeddedLangs: ['shellscript', 'json', 'xml', 'graphql']
  },
  {
    id: 'imba',
    scopeName: 'source.imba',
    displayName: 'Imba',
    path: 'imba.tmLanguage.json',
    samplePath: 'imba.sample'
  },
  {
    id: 'ini',
    scopeName: 'source.ini',
    displayName: 'Ini',
    path: 'ini.tmLanguage.json',
    aliases: ['properties']
  },
  {
    id: 'java',
    scopeName: 'source.java',
    displayName: 'Java',
    path: 'java.tmLanguage.json',
    samplePath: 'java.sample'
  },
  {
    id: 'javascript',
    scopeName: 'source.js',
    displayName: 'JavaScript',
    path: 'javascript.tmLanguage.json',
    samplePath: 'javascript.sample',
    aliases: ['js']
  },
  {
    id: 'jinja-html',
    scopeName: 'text.html.jinja',
    displayName: 'Jinja HTML',
    path: 'jinja-html.tmLanguage.json',
    embeddedLangs: ['html']
  },
  {
    id: 'jison',
    scopeName: 'source.jison',
    displayName: 'Jison',
    path: 'jison.tmLanguage.json',
    samplePath: 'jison.sample',
    embeddedLangs: ['javascript']
  },
  {
    id: 'json',
    scopeName: 'source.json',
    displayName: 'JSON',
    path: 'json.tmLanguage.json'
  },
  {
    id: 'json5',
    scopeName: 'source.json5',
    displayName: 'JSON5',
    path: 'json5.tmLanguage.json',
    samplePath: 'json5.sample'
  },
  {
    id: 'jsonc',
    scopeName: 'source.json.comments',
    displayName: 'JSON with Comments',
    path: 'jsonc.tmLanguage.json'
  },
  {
    id: 'jsonl',
    scopeName: 'source.json.lines',
    path: 'jsonl.tmLanguage.json'
  },
  {
    id: 'jsonnet',
    scopeName: 'source.jsonnet',
    displayName: 'Jsonnet',
    path: 'jsonnet.tmLanguage.json'
  },
  {
    id: 'jssm',
    scopeName: 'source.jssm',
    displayName: 'JSSM',
    path: 'jssm.tmLanguage.json',
    samplePath: 'jssm.sample',
    aliases: ['fsl']
  },
  {
    id: 'jsx',
    scopeName: 'source.js.jsx',
    displayName: 'JavaScript JSX',
    path: 'jsx.tmLanguage.json'
  },
  {
    id: 'julia',
    scopeName: 'source.julia',
    displayName: 'Julia',
    path: 'julia.tmLanguage.json',
    embeddedLangs: ['cpp', 'python', 'javascript', 'r', 'sql']
  },
  {
    id: 'kotlin',
    scopeName: 'source.kotlin',
    displayName: 'Kotlin',
    path: 'kotlin.tmLanguage.json',
    samplePath: 'kotlin.sample'
  },
  {
    id: 'kusto',
    scopeName: 'source.kusto',
    displayName: 'Kusto Query Language',
    path: 'kusto.tmLanguage.json',
    samplePath: 'kusto.sample',
    aliases: ['kql']
  },
  {
    id: 'latex',
    scopeName: 'text.tex.latex',
    displayName: 'LaTeX',
    path: 'latex.tmLanguage.json',
    embeddedLangs: ['tex', 'css', 'haskell', 'html', 'xml', 'java', 'lua', 'julia', 'ruby', 'javascript', 'typescript', 'python', 'yaml', 'rust', 'scala', 'gnuplot']
  },
  {
    id: 'less',
    scopeName: 'source.css.less',
    displayName: 'Less',
    path: 'less.tmLanguage.json',
    embeddedLangs: ['css']
  },
  {
    id: 'liquid',
    scopeName: 'text.html.liquid',
    displayName: 'Liquid',
    path: 'liquid.tmLanguage.json',
    samplePath: 'liquid.sample',
    embeddedLangs: ['html', 'css', 'json', 'javascript']
  },
  {
    id: 'lisp',
    scopeName: 'source.lisp',
    displayName: 'Lisp',
    path: 'lisp.tmLanguage.json'
  },
  {
    id: 'logo',
    scopeName: 'source.logo',
    displayName: 'Logo',
    path: 'logo.tmLanguage.json'
  },
  {
    id: 'lua',
    scopeName: 'source.lua',
    displayName: 'Lua',
    path: 'lua.tmLanguage.json',
    embeddedLangs: ['c']
  },
  {
    id: 'make',
    scopeName: 'source.makefile',
    displayName: 'Make',
    path: 'make.tmLanguage.json',
    aliases: ['makefile']
  },
  {
    id: 'markdown',
    scopeName: 'text.html.markdown',
    displayName: 'Markdown',
    path: 'markdown.tmLanguage.json',
    aliases: ['md'],
    embeddedLangs: ['css', 'html', 'ini', 'java', 'lua', 'make', 'perl', 'r', 'ruby', 'php', 'sql', 'vb', 'xml', 'xsl', 'yaml', 'bat', 'clojure', 'coffee', 'c', 'cpp', 'diff', 'docker', 'git-commit', 'git-rebase', 'go', 'groovy', 'pug', 'javascript', 'json', 'jsonc', 'less', 'objective-c', 'swift', 'scss', 'raku', 'powershell', 'python', 'julia', 'rust', 'scala', 'shellscript', 'typescript', 'tsx', 'csharp', 'fsharp', 'dart', 'handlebars', 'erlang', 'elixir', 'latex', 'bibtex']
  },
  {
    id: 'marko',
    scopeName: 'text.marko',
    displayName: 'Marko',
    path: 'marko.tmLanguage.json',
    embeddedLangs: ['css', 'less', 'scss', 'javascript']
  },
  {
    id: 'matlab',
    scopeName: 'source.matlab',
    displayName: 'MATLAB',
    path: 'matlab.tmLanguage.json'
  },
  {
    id: 'mdx',
    scopeName: 'source.mdx',
    displayName: 'MDX',
    path: 'mdx.tmLanguage.json',
    embeddedLangs: ['tsx', 'toml', 'yaml', 'c', 'clojure', 'coffee', 'cpp', 'csharp', 'css', 'diff', 'docker', 'elixir', 'elm', 'erlang', 'go', 'graphql', 'haskell', 'html', 'ini', 'java', 'javascript', 'json', 'julia', 'kotlin', 'less', 'lua', 'make', 'markdown', 'objective-c', 'perl', 'python', 'r', 'ruby', 'rust', 'scala', 'scss', 'shellscript', 'sql', 'xml', 'swift', 'typescript']
  },
  {
    id: 'mermaid',
    scopeName: 'source.mermaid',
    displayName: 'Mermaid',
    path: 'mermaid.tmLanguage.json'
  },
  {
    id: 'nextflow',
    scopeName: 'source.nextflow',
    path: 'nextflow.tmLanguage.json',
    samplePath: 'nextflow.sample',
    aliases: ['nf']
  },
  {
    id: 'nginx',
    scopeName: 'source.nginx',
    displayName: 'Nginx',
    path: 'nginx.tmLanguage.json',
    embeddedLangs: ['lua']
  },
  {
    id: 'nim',
    scopeName: 'source.nim',
    displayName: 'Nim',
    path: 'nim.tmLanguage.json',
    embeddedLangs: ['c', 'html', 'xml', 'javascript', 'css', 'glsl', 'markdown']
  },
  {
    id: 'nix',
    scopeName: 'source.nix',
    displayName: 'Nix',
    path: 'nix.tmLanguage.json'
  },
  {
    id: 'objective-c',
    scopeName: 'source.objc',
    displayName: 'Objective-C',
    path: 'objective-c.tmLanguage.json',
    aliases: ['objc']
  },
  {
    id: 'objective-cpp',
    scopeName: 'source.objcpp',
    displayName: 'Objective-C++',
    path: 'objective-cpp.tmLanguage.json'
  },
  {
    id: 'ocaml',
    scopeName: 'source.ocaml',
    displayName: 'OCaml',
    path: 'ocaml.tmLanguage.json'
  },
  {
    id: 'pascal',
    scopeName: 'source.pascal',
    displayName: 'Pascal',
    path: 'pascal.tmLanguage.json'
  },
  {
    id: 'perl',
    scopeName: 'source.perl',
    displayName: 'Perl',
    path: 'perl.tmLanguage.json',
    embeddedLangs: ['html', 'xml', 'css', 'javascript', 'sql']
  },
  {
    id: 'php',
    scopeName: 'source.php',
    displayName: 'PHP',
    path: 'php.tmLanguage.json',
    embeddedLangs: ['html', 'xml', 'sql', 'javascript', 'json', 'css']
  },
  {
    id: 'plsql',
    scopeName: 'source.plsql.oracle',
    displayName: 'PL/SQL',
    path: 'plsql.tmLanguage.json'
  },
  {
    id: 'postcss',
    scopeName: 'source.css.postcss',
    displayName: 'PostCSS',
    path: 'postcss.tmLanguage.json'
  },
  {
    id: 'powerquery',
    scopeName: 'source.powerquery',
    displayName: 'Power Query',
    path: 'powerquery.tmLanguage.json',
    samplePath: 'powerquery.sample'
  },
  {
    id: 'powershell',
    scopeName: 'source.powershell',
    displayName: 'PowerShell',
    path: 'powershell.tmLanguage.json',
    aliases: ['ps', 'ps1']
  },
  {
    id: 'prisma',
    scopeName: 'source.prisma',
    displayName: 'Prisma',
    path: 'prisma.tmLanguage.json',
    samplePath: 'prisma.sample'
  },
  {
    id: 'prolog',
    scopeName: 'source.prolog',
    displayName: 'Prolog',
    path: 'prolog.tmLanguage.json'
  },
  {
    id: 'proto',
    scopeName: 'source.proto',
    displayName: 'Prolog',
    path: 'proto.tmLanguage.json',
    samplePath: 'proto.sample'
  },
  {
    id: 'pug',
    scopeName: 'text.pug',
    displayName: 'Pug',
    path: 'pug.tmLanguage.json',
    aliases: ['jade'],
    embeddedLangs: ['javascript', 'css', 'sass', 'scss', 'stylus', 'coffee', 'html']
  },
  {
    id: 'puppet',
    scopeName: 'source.puppet',
    displayName: 'Puppet',
    path: 'puppet.tmLanguage.json'
  },
  {
    id: 'purescript',
    scopeName: 'source.purescript',
    displayName: 'PureScript',
    path: 'purescript.tmLanguage.json'
  },
  {
    id: 'python',
    scopeName: 'source.python',
    displayName: 'Python',
    path: 'python.tmLanguage.json',
    samplePath: 'python.sample',
    aliases: ['py']
  },
  {
    id: 'r',
    scopeName: 'source.r',
    displayName: 'R',
    path: 'r.tmLanguage.json'
  },
  {
    id: 'raku',
    scopeName: 'source.perl.6',
    displayName: 'Raku',
    path: 'raku.tmLanguage.json',
    aliases: ['perl6']
  },
  {
    id: 'razor',
    scopeName: 'text.aspnetcorerazor',
    displayName: 'Razor',
    path: 'razor.tmLanguage.json',
    embeddedLangs: ['html', 'csharp']
  },
  {
    id: 'reg',
    scopeName: 'source.reg',
    displayName: 'Windows Registry',
    path: 'reg.tmLanguage.json',
    samplePath: 'reg.sample'
  },
  {
    id: 'rel',
    scopeName: 'source.rel',
    displayName: 'Rel',
    path: 'rel.tmLanguage.json',
    samplePath: 'rel.sample'
  },
  {
    id: 'riscv',
    scopeName: 'source.riscv',
    displayName: 'RISC-V Assembly',
    path: 'riscv.tmLanguage.json'
  },
  {
    id: 'rst',
    scopeName: 'source.rst',
    displayName: 'reStructuredText',
    path: 'rst.tmLanguage.json',
    embeddedLangs: ['cpp', 'python', 'javascript', 'shellscript', 'yaml', 'cmake', 'ruby']
  },
  {
    id: 'ruby',
    scopeName: 'source.ruby',
    displayName: 'Ruby',
    path: 'ruby.tmLanguage.json',
    samplePath: 'ruby.sample',
    aliases: ['rb'],
    embeddedLangs: ['html', 'xml', 'sql', 'css', 'c', 'javascript', 'shellscript', 'lua']
  },
  {
    id: 'rust',
    scopeName: 'source.rust',
    displayName: 'Rust',
    path: 'rust.tmLanguage.json',
    aliases: ['rs']
  },
  {
    id: 'sas',
    scopeName: 'source.sas',
    displayName: 'SAS',
    path: 'sas.tmLanguage.json',
    embeddedLangs: ['sql']
  },
  {
    id: 'sass',
    scopeName: 'source.sass',
    displayName: 'Sass',
    path: 'sass.tmLanguage.json'
  },
  {
    id: 'scala',
    scopeName: 'source.scala',
    displayName: 'Scala',
    path: 'scala.tmLanguage.json'
  },
  {
    id: 'scheme',
    scopeName: 'source.scheme',
    displayName: 'Scheme',
    path: 'scheme.tmLanguage.json'
  },
  {
    id: 'scss',
    scopeName: 'source.css.scss',
    displayName: 'SCSS',
    path: 'scss.tmLanguage.json',
    embeddedLangs: ['css']
  },
  {
    id: 'shaderlab',
    scopeName: 'source.shaderlab',
    displayName: 'ShaderLab',
    path: 'shaderlab.tmLanguage.json',
    aliases: ['shader'],
    embeddedLangs: ['hlsl']
  },
  {
    id: 'shellscript',
    scopeName: 'source.shell',
    displayName: 'Shell Script',
    path: 'shellscript.tmLanguage.json',
    aliases: ['bash', 'console', 'sh', 'shell', 'zsh']
  },
  {
    id: 'smalltalk',
    scopeName: 'source.smalltalk',
    displayName: 'Smalltalk',
    path: 'smalltalk.tmLanguage.json'
  },
  {
    id: 'solidity',
    scopeName: 'source.solidity',
    displayName: 'Solidity',
    path: 'solidity.tmLanguage.json'
  },
  {
    id: 'sparql',
    scopeName: 'source.sparql',
    displayName: 'SPARQL',
    path: 'sparql.tmLanguage.json',
    samplePath: 'sparql.sample',
    embeddedLangs: ['turtle']
  },
  {
    id: 'sql',
    scopeName: 'source.sql',
    displayName: 'SQL',
    path: 'sql.tmLanguage.json'
  },
  {
    id: 'ssh-config',
    scopeName: 'source.ssh-config',
    displayName: 'SSH config',
    path: 'ssh-config.tmLanguage.json'
  },
  {
    id: 'stata',
    scopeName: 'source.stata',
    displayName: 'Stata',
    path: 'stata.tmLanguage.json',
    samplePath: 'stata.sample',
    embeddedLangs: ['sql']
  },
  {
    id: 'stylus',
    scopeName: 'source.stylus',
    displayName: 'Stylus',
    path: 'stylus.tmLanguage.json',
    aliases: ['styl']
  },
  {
    id: 'svelte',
    scopeName: 'source.svelte',
    displayName: 'Svelte',
    path: 'svelte.tmLanguage.json',
    embeddedLangs: ['javascript', 'typescript', 'coffee', 'stylus', 'sass', 'css', 'scss', 'less', 'postcss', 'pug', 'markdown']
  },
  {
    id: 'swift',
    scopeName: 'source.swift',
    displayName: 'Swift',
    path: 'swift.tmLanguage.json'
  },
  {
    id: 'system-verilog',
    scopeName: 'source.systemverilog',
    displayName: 'SystemVerilog',
    path: 'system-verilog.tmLanguage.json'
  },
  {
    id: 'tasl',
    scopeName: 'source.tasl',
    displayName: 'TASL',
    path: 'tasl.tmLanguage.json',
    samplePath: 'tasl.sample'
  },
  {
    id: 'tcl',
    scopeName: 'source.tcl',
    displayName: 'Tcl',
    path: 'tcl.tmLanguage.json'
  },
  {
    id: 'tex',
    scopeName: 'text.tex',
    displayName: 'TeX',
    path: 'tex.tmLanguage.json',
    embeddedLangs: ['r']
  },
  {
    id: 'toml',
    scopeName: 'source.toml',
    displayName: 'TOML',
    path: 'toml.tmLanguage.json'
  },
  {
    id: 'tsx',
    scopeName: 'source.tsx',
    displayName: 'TypeScript JSX',
    path: 'tsx.tmLanguage.json',
    samplePath: 'tsx.sample'
  },
  {
    id: 'turtle',
    scopeName: 'source.turtle',
    displayName: 'Turtle',
    path: 'turtle.tmLanguage.json',
    samplePath: 'turtle.sample'
  },
  {
    id: 'twig',
    scopeName: 'text.html.twig',
    displayName: 'Twig',
    path: 'twig.tmLanguage.json',
    embeddedLangs: ['css', 'javascript', 'php', 'python', 'ruby']
  },
  {
    id: 'typescript',
    scopeName: 'source.ts',
    displayName: 'TypeScript',
    path: 'typescript.tmLanguage.json',
    aliases: ['ts']
  },
  {
    id: 'v',
    scopeName: 'source.v',
    displayName: 'V',
    path: 'v.tmLanguage.json',
    samplePath: 'v.sample'
  },
  {
    id: 'vb',
    scopeName: 'source.asp.vb.net',
    displayName: 'Visual Basic',
    path: 'vb.tmLanguage.json',
    aliases: ['cmd']
  },
  {
    id: 'verilog',
    scopeName: 'source.verilog',
    displayName: 'Verilog',
    path: 'verilog.tmLanguage.json'
  },
  {
    id: 'vhdl',
    scopeName: 'source.vhdl',
    displayName: 'VHDL',
    path: 'vhdl.tmLanguage.json'
  },
  {
    id: 'viml',
    scopeName: 'source.viml',
    displayName: 'Vim script',
    path: 'viml.tmLanguage.json',
    aliases: ['vim', 'vimscript']
  },
  {
    id: 'vue-html',
    scopeName: 'text.html.vue-html',
    displayName: 'Vue Template',
    path: 'vue-html.tmLanguage.json',
    embeddedLangs: ['vue', 'javascript']
  },
  {
    id: 'vue',
    scopeName: 'source.vue',
    displayName: 'Vue.js',
    path: 'vue.tmLanguage.json',
    embeddedLangs: ['html', 'markdown', 'pug', 'stylus', 'sass', 'css', 'scss', 'less', 'javascript', 'typescript', 'jsx', 'tsx', 'json', 'jsonc', 'json5', 'yaml', 'toml', 'graphql']
  },
  {
    id: 'vyper',
    scopeName: 'source.vyper',
    path: 'vyper.tmLanguage.json',
    samplePath: 'vyper.sample',
    aliases: ['vy']
  },
  {
    id: 'wasm',
    scopeName: 'source.wat',
    displayName: 'WebAssembly',
    path: 'wasm.tmLanguage.json'
  },
  {
    id: 'wenyan',
    scopeName: 'source.wenyan',
    displayName: '文言',
    aliases: ['文言'],
    path: 'wenyan.tmLanguage.json'
  },
  {
    id: 'wgsl',
    scopeName: 'source.wgsl',
    displayName: 'WGSL',
    path: 'wgsl.tmLanguage.json',
    samplePath: 'wgsl.sample'
  },
  {
    id: 'wolfram',
    scopeName: 'source.wolfram',
    displayName: 'Wolfram Language',
    path: 'wolfram.tmLanguage.json',
    samplePath: 'wolfram.sample'
  },
  {
    id: 'xml',
    scopeName: 'text.xml',
    displayName: 'XML',
    path: 'xml.tmLanguage.json',
    embeddedLangs: ['java']
  },
  {
    id: 'xsl',
    scopeName: 'text.xml.xsl',
    displayName: 'XSL',
    path: 'xsl.tmLanguage.json',
    embeddedLangs: ['xml']
  },
  {
    id: 'yaml',
    scopeName: 'source.yaml',
    displayName: 'YAML',
    path: 'yaml.tmLanguage.json',
    aliases: ['yml']
  },
  {
    id: 'zenscript',
    scopeName: 'source.zenscript',
    displayName: 'ZenScript',
    path: 'zenscript.tmLanguage.json',
    samplePath: 'zenscript.sample'
  }
]
