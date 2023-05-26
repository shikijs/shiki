// This file is generated by "scripts/grammars/updateGrammarSourceFiles.ts" inside your project.
// Do not edit this file directly.
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

export const languages: ILanguageRegistration[] = [
  {
    id: 'abap',
    scopeName: 'source.abap',
    path: 'abap.tmLanguage.json',
    displayName: 'ABAP',
    samplePath: 'abap.sample'
  },
  {
    id: 'actionscript-3',
    scopeName: 'source.actionscript.3',
    path: 'actionscript-3.tmLanguage.json',
    displayName: 'Actionscript 3',
    samplePath: 'actionscript-3.sample'
  },
  {
    id: 'ada',
    scopeName: 'source.ada',
    path: 'ada.tmLanguage.json',
    displayName: 'Ada',
    samplePath: 'ada.sample'
  },
  {
    id: 'apache',
    scopeName: 'source.apacheconf',
    path: 'apache.tmLanguage.json',
    displayName: 'Apache Conf'
  },
  {
    id: 'apex',
    scopeName: 'source.apex',
    path: 'apex.tmLanguage.json',
    displayName: 'Apex',
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
    displayName: 'AppleScript',
    samplePath: 'applescript.sample'
  },
  {
    id: 'ara',
    scopeName: 'source.ara',
    path: 'ara.tmLanguage.json',
    displayName: 'Ara',
    samplePath: 'ara.sample'
  },
  {
    id: 'asm',
    scopeName: 'source.asm.x86_64',
    path: 'asm.tmLanguage.json',
    displayName: 'x86 and x86_64 Assembly',
    samplePath: 'asm.sample'
  },
  {
    id: 'astro',
    scopeName: 'source.astro',
    path: 'astro.tmLanguage.json',
    displayName: 'Astro',
    samplePath: 'astro.sample',
    embeddedLangs: ['json', 'javascript', 'typescript', 'stylus', 'sass', 'css', 'scss', 'less', 'postcss', 'tsx']
  },
  {
    id: 'awk',
    scopeName: 'source.awk',
    path: 'awk.tmLanguage.json',
    displayName: 'AWK',
    samplePath: 'awk.sample'
  },
  {
    id: 'ballerina',
    scopeName: 'source.ballerina',
    path: 'ballerina.tmLanguage.json',
    displayName: 'Ballerina',
    samplePath: 'ballerina.sample'
  },
  {
    id: 'bat',
    scopeName: 'source.batchfile',
    path: 'bat.tmLanguage.json',
    displayName: 'Batch',
    samplePath: 'bat.sample',
    aliases: ['batch']
  },
  {
    id: 'beancount',
    scopeName: 'text.beancount',
    path: 'beancount.tmLanguage.json',
    displayName: 'Beancount',
    samplePath: 'beancount.sample'
  },
  {
    id: 'berry',
    scopeName: 'source.berry',
    path: 'berry.tmLanguage.json',
    displayName: 'Berry',
    samplePath: 'berry.sample',
    aliases: ['be']
  },
  {
    id: 'bibtex',
    scopeName: 'text.bibtex',
    path: 'bibtex.tmLanguage.json',
    displayName: 'BibTeX'
  },
  {
    id: 'bicep',
    scopeName: 'source.bicep',
    path: 'bicep.tmLanguage.json',
    displayName: 'Bicep',
    samplePath: 'bicep.sample'
  },
  {
    id: 'blade',
    scopeName: 'text.html.php.blade',
    path: 'blade.tmLanguage.json',
    displayName: 'Blade',
    samplePath: 'blade.sample',
    embeddedLangs: ['html', 'xml', 'sql', 'javascript', 'json', 'css']
  },
  {
    id: 'c',
    scopeName: 'source.c',
    path: 'c.tmLanguage.json',
    displayName: 'C',
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
    displayName: 'Clojure',
    samplePath: 'clojure.sample',
    aliases: ['clj']
  },
  {
    id: 'cmake',
    scopeName: 'source.cmake',
    path: 'cmake.tmLanguage.json',
    displayName: 'CMake',
    samplePath: 'cmake.sample'
  },
  {
    id: 'cobol',
    scopeName: 'source.cobol',
    path: 'cobol.tmLanguage.json',
    displayName: 'COBOL',
    samplePath: 'cobol.sample',
    embeddedLangs: ['sql', 'html', 'java']
  },
  {
    id: 'codeql',
    scopeName: 'source.ql',
    path: 'codeql.tmLanguage.json',
    displayName: 'QL',
    samplePath: 'codeql.sample',
    aliases: ['ql'],
    embeddedLangs: ['markdown']
  },
  {
    id: 'coffee',
    scopeName: 'source.coffee',
    path: 'coffee.tmLanguage.json',
    displayName: 'CoffeeScript',
    samplePath: 'coffee.sample',
    embeddedLangs: ['javascript']
  },
  {
    id: 'cpp',
    scopeName: 'source.cpp',
    path: 'cpp.tmLanguage.json',
    displayName: 'C++',
    samplePath: 'cpp.sample',
    embeddedLangs: ['glsl', 'sql']
  },
  {
    id: 'crystal',
    scopeName: 'source.crystal',
    path: 'crystal.tmLanguage.json',
    displayName: 'Crystal',
    samplePath: 'crystal.sample',
    embeddedLangs: ['html', 'sql', 'css', 'c', 'javascript', 'shellscript']
  },
  {
    id: 'csharp',
    scopeName: 'source.cs',
    path: 'csharp.tmLanguage.json',
    displayName: 'C#',
    samplePath: 'csharp.sample',
    aliases: ['c#', 'cs']
  },
  {
    id: 'css',
    scopeName: 'source.css',
    path: 'css.tmLanguage.json',
    displayName: 'CSS',
    samplePath: 'css.sample'
  },
  {
    id: 'cue',
    scopeName: 'source.cue',
    path: 'cue.tmLanguage.json',
    displayName: 'CUE',
    samplePath: 'cue.sample'
  },
  {
    id: 'cypher',
    scopeName: 'source.cypher',
    path: 'cypher.tmLanguage.json',
    displayName: 'Cypher',
    samplePath: 'cypher.sample',
    aliases: ['cql']
  },
  {
    id: 'd',
    scopeName: 'source.d',
    path: 'd.tmLanguage.json',
    displayName: 'D',
    samplePath: 'd.sample'
  },
  {
    id: 'dart',
    scopeName: 'source.dart',
    path: 'dart.tmLanguage.json',
    displayName: 'Dart',
    samplePath: 'dart.sample'
  },
  {
    id: 'dax',
    scopeName: 'source.dax',
    path: 'dax.tmLanguage.json',
    samplePath: 'dax.sample'
  },
  {
    id: 'diff',
    scopeName: 'source.diff',
    path: 'diff.tmLanguage.json',
    displayName: 'Diff',
    samplePath: 'diff.sample'
  },
  {
    id: 'docker',
    scopeName: 'source.dockerfile',
    path: 'docker.tmLanguage.json',
    displayName: 'Docker',
    samplePath: 'docker.sample',
    aliases: ['dockerfile']
  },
  {
    id: 'dream-maker',
    scopeName: 'source.dm',
    path: 'dream-maker.tmLanguage.json',
    displayName: 'Dream Maker'
  },
  {
    id: 'elixir',
    scopeName: 'source.elixir',
    path: 'elixir.tmLanguage.json',
    displayName: 'Elixir',
    samplePath: 'elixir.sample',
    embeddedLangs: ['html']
  },
  {
    id: 'elm',
    scopeName: 'source.elm',
    path: 'elm.tmLanguage.json',
    displayName: 'Elm',
    samplePath: 'elm.sample',
    embeddedLangs: ['glsl']
  },
  {
    id: 'erb',
    scopeName: 'text.html.erb',
    path: 'erb.tmLanguage.json',
    displayName: 'HTML (Ruby - ERB)',
    samplePath: 'erb.sample',
    embeddedLangs: ['html', 'ruby']
  },
  {
    id: 'erlang',
    scopeName: 'source.erlang',
    path: 'erlang.tmLanguage.json',
    displayName: 'Erlang',
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
    displayName: 'F#',
    samplePath: 'fsharp.sample',
    aliases: ['f#', 'fs'],
    embeddedLangs: ['markdown']
  },
  {
    id: 'gdresource',
    scopeName: 'source.gdresource',
    path: 'gdresource.tmLanguage.json',
    samplePath: 'gdresource.sample',
    embeddedLangs: ['gdshader', 'gdscript']
  },
  {
    id: 'gdscript',
    scopeName: 'source.gdscript',
    path: 'gdscript.tmLanguage.json',
    displayName: 'GDScript',
    samplePath: 'gdscript.sample'
  },
  {
    id: 'gdshader',
    scopeName: 'source.gdshader',
    path: 'gdshader.tmLanguage.json',
    displayName: 'GDShader',
    samplePath: 'gdshader.sample'
  },
  {
    id: 'gherkin',
    scopeName: 'text.gherkin.feature',
    path: 'gherkin.tmLanguage.json',
    displayName: 'Gherkin'
  },
  {
    id: 'git-commit',
    scopeName: 'text.git-commit',
    path: 'git-commit.tmLanguage.json',
    displayName: 'Git Commit Message',
    embeddedLangs: ['diff']
  },
  {
    id: 'git-rebase',
    scopeName: 'text.git-rebase',
    path: 'git-rebase.tmLanguage.json',
    displayName: 'Git Rebase Message',
    embeddedLangs: ['shellscript']
  },
  {
    id: 'glsl',
    scopeName: 'source.glsl',
    path: 'glsl.tmLanguage.json',
    displayName: 'GLSL',
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
    displayName: 'Go',
    samplePath: 'go.sample'
  },
  {
    id: 'graphql',
    scopeName: 'source.graphql',
    path: 'graphql.tmLanguage.json',
    displayName: 'GraphQL',
    embeddedLangs: ['javascript', 'typescript', 'jsx', 'tsx']
  },
  {
    id: 'groovy',
    scopeName: 'source.groovy',
    path: 'groovy.tmLanguage.json',
    displayName: 'Groovy'
  },
  {
    id: 'hack',
    scopeName: 'source.hack',
    path: 'hack.tmLanguage.json',
    displayName: 'Hack',
    embeddedLangs: ['html', 'sql']
  },
  {
    id: 'haml',
    scopeName: 'text.haml',
    path: 'haml.tmLanguage.json',
    displayName: 'Ruby Haml',
    embeddedLangs: ['ruby', 'javascript', 'sass', 'coffee', 'markdown', 'css']
  },
  {
    id: 'handlebars',
    scopeName: 'text.html.handlebars',
    path: 'handlebars.tmLanguage.json',
    displayName: 'Handlebars',
    aliases: ['hbs'],
    embeddedLangs: ['html', 'css', 'javascript', 'yaml']
  },
  {
    id: 'haskell',
    scopeName: 'source.haskell',
    path: 'haskell.tmLanguage.json',
    displayName: 'Haskell',
    aliases: ['hs']
  },
  {
    id: 'hcl',
    scopeName: 'source.hcl',
    path: 'hcl.tmLanguage.json',
    displayName: 'HashiCorp HCL',
    samplePath: 'hcl.sample'
  },
  {
    id: 'hjson',
    scopeName: 'source.hjson',
    path: 'hjson.tmLanguage.json',
    displayName: 'Hjson',
    samplePath: 'hjson.sample'
  },
  {
    id: 'hlsl',
    scopeName: 'source.hlsl',
    path: 'hlsl.tmLanguage.json',
    displayName: 'HLSL'
  },
  {
    id: 'html',
    scopeName: 'text.html.basic',
    path: 'html.tmLanguage.json',
    displayName: 'HTML',
    samplePath: 'html.sample',
    embeddedLangs: ['javascript', 'css']
  },
  {
    id: 'http',
    scopeName: 'source.http',
    path: 'http.tmLanguage.json',
    samplePath: 'http.sample',
    embeddedLangs: ['shellscript', 'json', 'xml', 'graphql']
  },
  {
    id: 'imba',
    scopeName: 'source.imba',
    path: 'imba.tmLanguage.json',
    displayName: 'Imba',
    samplePath: 'imba.sample'
  },
  {
    id: 'ini',
    scopeName: 'source.ini',
    path: 'ini.tmLanguage.json',
    displayName: 'Properties',
    aliases: ['properties']
  },
  {
    id: 'java',
    scopeName: 'source.java',
    path: 'java.tmLanguage.json',
    displayName: 'Java',
    samplePath: 'java.sample'
  },
  {
    id: 'javascript',
    scopeName: 'source.js',
    path: 'javascript.tmLanguage.json',
    displayName: 'JavaScript',
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
    id: 'jison',
    scopeName: 'source.jison',
    path: 'jison.tmLanguage.json',
    displayName: 'Jison',
    samplePath: 'jison.sample',
    embeddedLangs: ['javascript']
  },
  {
    id: 'json',
    scopeName: 'source.json',
    path: 'json.tmLanguage.json',
    displayName: 'JSON'
  },
  {
    id: 'json5',
    scopeName: 'source.json5',
    path: 'json5.tmLanguage.json',
    displayName: 'JSON5',
    samplePath: 'json5.sample'
  },
  {
    id: 'jsonc',
    scopeName: 'source.json.comments',
    path: 'jsonc.tmLanguage.json',
    displayName: 'JSON with Comments'
  },
  {
    id: 'jsonl',
    scopeName: 'source.json.lines',
    path: 'jsonl.tmLanguage.json',
    displayName: 'JSON Lines'
  },
  {
    id: 'jsonnet',
    scopeName: 'source.jsonnet',
    path: 'jsonnet.tmLanguage.json',
    displayName: 'Jsonnet'
  },
  {
    id: 'jssm',
    scopeName: 'source.jssm',
    path: 'jssm.tmLanguage.json',
    displayName: 'JSSM',
    samplePath: 'jssm.sample',
    aliases: ['fsl']
  },
  {
    id: 'jsx',
    scopeName: 'source.js.jsx',
    path: 'jsx.tmLanguage.json',
    displayName: 'JavaScript JSX'
  },
  {
    id: 'julia',
    scopeName: 'source.julia',
    path: 'julia.tmLanguage.json',
    displayName: 'Julia',
    embeddedLangs: ['cpp', 'python', 'javascript', 'r', 'sql']
  },
  {
    id: 'kotlin',
    scopeName: 'source.kotlin',
    path: 'kotlin.tmLanguage.json',
    displayName: 'Kotlin',
    samplePath: 'kotlin.sample'
  },
  {
    id: 'kusto',
    scopeName: 'source.kusto',
    path: 'kusto.tmLanguage.json',
    displayName: 'Kusto',
    samplePath: 'kusto.sample',
    aliases: ['kql']
  },
  {
    id: 'latex',
    scopeName: 'text.tex.latex',
    path: 'latex.tmLanguage.json',
    displayName: 'LaTeX',
    embeddedLangs: ['tex', 'css', 'haskell', 'html', 'xml', 'java', 'lua', 'julia', 'ruby', 'javascript', 'typescript', 'python', 'yaml', 'rust', 'scala', 'gnuplot']
  },
  {
    id: 'less',
    scopeName: 'source.css.less',
    path: 'less.tmLanguage.json',
    displayName: 'Less',
    embeddedLangs: ['css']
  },
  {
    id: 'liquid',
    scopeName: 'text.html.liquid',
    path: 'liquid.tmLanguage.json',
    displayName: 'Liquid HTML',
    samplePath: 'liquid.sample',
    embeddedLangs: ['html', 'css', 'json', 'javascript']
  },
  {
    id: 'lisp',
    scopeName: 'source.lisp',
    path: 'lisp.tmLanguage.json',
    displayName: 'Lisp'
  },
  {
    id: 'logo',
    scopeName: 'source.logo',
    path: 'logo.tmLanguage.json',
    displayName: 'Logo'
  },
  {
    id: 'lua',
    scopeName: 'source.lua',
    path: 'lua.tmLanguage.json',
    displayName: 'Lua',
    embeddedLangs: ['c']
  },
  {
    id: 'make',
    scopeName: 'source.makefile',
    path: 'make.tmLanguage.json',
    displayName: 'Makefile',
    aliases: ['makefile']
  },
  {
    id: 'markdown',
    scopeName: 'text.html.markdown',
    path: 'markdown.tmLanguage.json',
    displayName: 'Markdown',
    aliases: ['md'],
    embeddedLangs: ['css', 'html', 'ini', 'java', 'lua', 'make', 'perl', 'r', 'ruby', 'php', 'sql', 'vb', 'xml', 'xsl', 'yaml', 'bat', 'clojure', 'coffee', 'c', 'cpp', 'diff', 'docker', 'git-commit', 'git-rebase', 'go', 'groovy', 'pug', 'javascript', 'json', 'jsonc', 'less', 'objective-c', 'swift', 'scss', 'raku', 'powershell', 'python', 'julia', 'rust', 'scala', 'shellscript', 'typescript', 'tsx', 'csharp', 'fsharp', 'dart', 'handlebars', 'erlang', 'elixir', 'latex', 'bibtex']
  },
  {
    id: 'marko',
    scopeName: 'text.marko',
    path: 'marko.tmLanguage.json',
    displayName: 'Marko',
    samplePath: 'marko.sample',
    embeddedLangs: ['css', 'less', 'scss', 'javascript']
  },
  {
    id: 'matlab',
    scopeName: 'source.matlab',
    path: 'matlab.tmLanguage.json',
    displayName: 'MATLAB'
  },
  {
    id: 'mdx',
    scopeName: 'source.mdx',
    path: 'mdx.tmLanguage.json',
    displayName: 'MDX',
    embeddedLangs: ['tsx', 'toml', 'yaml', 'c', 'clojure', 'coffee', 'cpp', 'csharp', 'css', 'diff', 'docker', 'elixir', 'elm', 'erlang', 'go', 'graphql', 'haskell', 'html', 'ini', 'java', 'javascript', 'json', 'julia', 'kotlin', 'less', 'lua', 'make', 'markdown', 'objective-c', 'perl', 'python', 'r', 'ruby', 'rust', 'scala', 'scss', 'shellscript', 'sql', 'xml', 'swift', 'typescript']
  },
  {
    id: 'mermaid',
    scopeName: 'source.mermaid',
    path: 'mermaid.tmLanguage.json'
  },
  {
    id: 'nextflow',
    scopeName: 'source.nextflow',
    path: 'nextflow.tmLanguage.json',
    displayName: 'Nextflow',
    samplePath: 'nextflow.sample',
    aliases: ['nf']
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
    displayName: 'Nim',
    embeddedLangs: ['c', 'html', 'xml', 'javascript', 'css', 'glsl', 'markdown']
  },
  {
    id: 'nix',
    scopeName: 'source.nix',
    path: 'nix.tmLanguage.json',
    displayName: 'Nix'
  },
  {
    id: 'objective-c',
    scopeName: 'source.objc',
    path: 'objective-c.tmLanguage.json',
    displayName: 'Objective-C',
    aliases: ['objc']
  },
  {
    id: 'objective-cpp',
    scopeName: 'source.objcpp',
    path: 'objective-cpp.tmLanguage.json',
    displayName: 'Objective-C++'
  },
  {
    id: 'ocaml',
    scopeName: 'source.ocaml',
    path: 'ocaml.tmLanguage.json',
    displayName: 'OCaml'
  },
  {
    id: 'pascal',
    scopeName: 'source.pascal',
    path: 'pascal.tmLanguage.json',
    displayName: 'Pascal'
  },
  {
    id: 'perl',
    scopeName: 'source.perl',
    path: 'perl.tmLanguage.json',
    displayName: 'Perl',
    embeddedLangs: ['html', 'xml', 'css', 'javascript', 'sql']
  },
  {
    id: 'php',
    scopeName: 'source.php',
    path: 'php.tmLanguage.json',
    displayName: 'PHP',
    embeddedLangs: ['html', 'xml', 'sql', 'javascript', 'json', 'css']
  },
  {
    id: 'plsql',
    scopeName: 'source.plsql.oracle',
    path: 'plsql.tmLanguage.json',
    displayName: 'PL/SQL (Oracle)'
  },
  {
    id: 'postcss',
    scopeName: 'source.css.postcss',
    path: 'postcss.tmLanguage.json',
    displayName: 'PostCSS'
  },
  {
    id: 'powerquery',
    scopeName: 'source.powerquery',
    path: 'powerquery.tmLanguage.json',
    samplePath: 'powerquery.sample'
  },
  {
    id: 'powershell',
    scopeName: 'source.powershell',
    path: 'powershell.tmLanguage.json',
    displayName: 'PowerShell',
    aliases: ['ps', 'ps1']
  },
  {
    id: 'prisma',
    scopeName: 'source.prisma',
    path: 'prisma.tmLanguage.json',
    displayName: 'Prisma',
    samplePath: 'prisma.sample'
  },
  {
    id: 'prolog',
    scopeName: 'source.prolog',
    path: 'prolog.tmLanguage.json',
    displayName: 'SWI-Prolog'
  },
  {
    id: 'proto',
    scopeName: 'source.proto',
    path: 'proto.tmLanguage.json',
    displayName: 'Protocol Buffer 3',
    samplePath: 'proto.sample'
  },
  {
    id: 'pug',
    scopeName: 'text.pug',
    path: 'pug.tmLanguage.json',
    displayName: 'Pug',
    aliases: ['jade'],
    embeddedLangs: ['javascript', 'css', 'sass', 'scss', 'stylus', 'coffee', 'html']
  },
  {
    id: 'puppet',
    scopeName: 'source.puppet',
    path: 'puppet.tmLanguage.json',
    displayName: 'Puppet'
  },
  {
    id: 'purescript',
    scopeName: 'source.purescript',
    path: 'purescript.tmLanguage.json',
    displayName: 'PureScript'
  },
  {
    id: 'python',
    scopeName: 'source.python',
    path: 'python.tmLanguage.json',
    displayName: 'Python',
    samplePath: 'python.sample',
    aliases: ['py']
  },
  {
    id: 'r',
    scopeName: 'source.r',
    path: 'r.tmLanguage.json',
    displayName: 'R'
  },
  {
    id: 'raku',
    scopeName: 'source.perl.6',
    path: 'raku.tmLanguage.json',
    displayName: 'Perl 6',
    aliases: ['perl6']
  },
  {
    id: 'razor',
    scopeName: 'text.aspnetcorerazor',
    path: 'razor.tmLanguage.json',
    displayName: 'ASP.NET Razor',
    embeddedLangs: ['html', 'csharp']
  },
  {
    id: 'reg',
    scopeName: 'source.reg',
    path: 'reg.tmLanguage.json',
    displayName: 'REG',
    samplePath: 'reg.sample'
  },
  {
    id: 'rel',
    scopeName: 'source.rel',
    path: 'rel.tmLanguage.json',
    displayName: 'Rel',
    samplePath: 'rel.sample'
  },
  {
    id: 'riscv',
    scopeName: 'source.riscv',
    path: 'riscv.tmLanguage.json',
    displayName: 'RISCV Assembler'
  },
  {
    id: 'rst',
    scopeName: 'source.rst',
    path: 'rst.tmLanguage.json',
    displayName: 'reStructuredText',
    embeddedLangs: ['cpp', 'python', 'javascript', 'shellscript', 'yaml', 'cmake', 'ruby']
  },
  {
    id: 'ruby',
    scopeName: 'source.ruby',
    path: 'ruby.tmLanguage.json',
    displayName: 'Ruby',
    samplePath: 'ruby.sample',
    aliases: ['rb'],
    embeddedLangs: ['html', 'xml', 'sql', 'css', 'c', 'javascript', 'shellscript', 'lua']
  },
  {
    id: 'rust',
    scopeName: 'source.rust',
    path: 'rust.tmLanguage.json',
    displayName: 'Rust',
    aliases: ['rs']
  },
  {
    id: 'sas',
    scopeName: 'source.sas',
    path: 'sas.tmLanguage.json',
    displayName: 'SAS Program',
    embeddedLangs: ['sql']
  },
  {
    id: 'sass',
    scopeName: 'source.sass',
    path: 'sass.tmLanguage.json',
    displayName: 'Sass'
  },
  {
    id: 'scala',
    scopeName: 'source.scala',
    path: 'scala.tmLanguage.json',
    displayName: 'Scala'
  },
  {
    id: 'scheme',
    scopeName: 'source.scheme',
    path: 'scheme.tmLanguage.json',
    displayName: 'Scheme'
  },
  {
    id: 'scss',
    scopeName: 'source.css.scss',
    path: 'scss.tmLanguage.json',
    displayName: 'SCSS',
    embeddedLangs: ['css']
  },
  {
    id: 'shaderlab',
    scopeName: 'source.shaderlab',
    path: 'shaderlab.tmLanguage.json',
    displayName: 'ShaderLab',
    aliases: ['shader'],
    embeddedLangs: ['hlsl']
  },
  {
    id: 'shellscript',
    scopeName: 'source.shell',
    path: 'shellscript.tmLanguage.json',
    displayName: 'Shell Script',
    aliases: ['bash', 'console', 'sh', 'shell', 'zsh']
  },
  {
    id: 'smalltalk',
    scopeName: 'source.smalltalk',
    path: 'smalltalk.tmLanguage.json',
    displayName: 'Smalltalk'
  },
  {
    id: 'solidity',
    scopeName: 'source.solidity',
    path: 'solidity.tmLanguage.json',
    displayName: 'Solidity'
  },
  {
    id: 'sparql',
    scopeName: 'source.sparql',
    path: 'sparql.tmLanguage.json',
    displayName: 'SPARQL',
    samplePath: 'sparql.sample',
    embeddedLangs: ['turtle']
  },
  {
    id: 'sql',
    scopeName: 'source.sql',
    path: 'sql.tmLanguage.json',
    displayName: 'SQL'
  },
  {
    id: 'ssh-config',
    scopeName: 'source.ssh-config',
    path: 'ssh-config.tmLanguage.json',
    displayName: 'SSH Config'
  },
  {
    id: 'stata',
    scopeName: 'source.stata',
    path: 'stata.tmLanguage.json',
    displayName: 'Stata',
    samplePath: 'stata.sample',
    embeddedLangs: ['sql']
  },
  {
    id: 'stylus',
    scopeName: 'source.stylus',
    path: 'stylus.tmLanguage.json',
    displayName: 'Stylus',
    aliases: ['styl']
  },
  {
    id: 'svelte',
    scopeName: 'source.svelte',
    path: 'svelte.tmLanguage.json',
    displayName: 'Svelte Component',
    embeddedLangs: ['javascript', 'typescript', 'coffee', 'stylus', 'sass', 'css', 'scss', 'less', 'postcss', 'pug', 'markdown']
  },
  {
    id: 'swift',
    scopeName: 'source.swift',
    path: 'swift.tmLanguage.json',
    displayName: 'Swift'
  },
  {
    id: 'system-verilog',
    scopeName: 'source.systemverilog',
    path: 'system-verilog.tmLanguage.json',
    displayName: 'SystemVerilog'
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
    path: 'tcl.tmLanguage.json',
    displayName: 'Tcl'
  },
  {
    id: 'tex',
    scopeName: 'text.tex',
    path: 'tex.tmLanguage.json',
    displayName: 'TeX',
    embeddedLangs: ['r']
  },
  {
    id: 'toml',
    scopeName: 'source.toml',
    path: 'toml.tmLanguage.json',
    displayName: 'TOML'
  },
  {
    id: 'tsx',
    scopeName: 'source.tsx',
    path: 'tsx.tmLanguage.json',
    displayName: 'TypeScript JSX',
    samplePath: 'tsx.sample'
  },
  {
    id: 'turtle',
    scopeName: 'source.turtle',
    path: 'turtle.tmLanguage.json',
    displayName: 'Turtle',
    samplePath: 'turtle.sample'
  },
  {
    id: 'twig',
    scopeName: 'text.html.twig',
    path: 'twig.tmLanguage.json',
    displayName: 'HTML (Twig)',
    embeddedLangs: ['css', 'javascript', 'php', 'python', 'ruby']
  },
  {
    id: 'typescript',
    scopeName: 'source.ts',
    path: 'typescript.tmLanguage.json',
    displayName: 'TypeScript',
    aliases: ['ts']
  },
  {
    id: 'v',
    scopeName: 'source.v',
    path: 'v.tmLanguage.json',
    displayName: 'V',
    samplePath: 'v.sample'
  },
  {
    id: 'vb',
    scopeName: 'source.asp.vb.net',
    path: 'vb.tmLanguage.json',
    displayName: 'Visual Basic',
    aliases: ['cmd']
  },
  {
    id: 'verilog',
    scopeName: 'source.verilog',
    path: 'verilog.tmLanguage.json',
    displayName: 'Verilog'
  },
  {
    id: 'vhdl',
    scopeName: 'source.vhdl',
    path: 'vhdl.tmLanguage.json',
    displayName: 'VHDL'
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
    displayName: 'Vue HTML',
    embeddedLangs: ['vue', 'javascript']
  },
  {
    id: 'vue',
    scopeName: 'source.vue',
    path: 'vue.tmLanguage.json',
    displayName: 'Vue',
    embeddedLangs: ['html', 'markdown', 'pug', 'stylus', 'sass', 'css', 'scss', 'less', 'javascript', 'typescript', 'jsx', 'tsx', 'json', 'jsonc', 'json5', 'yaml', 'toml', 'graphql']
  },
  {
    id: 'vyper',
    scopeName: 'source.vyper',
    path: 'vyper.tmLanguage.json',
    displayName: 'Vyper',
    samplePath: 'vyper.sample',
    aliases: ['vy']
  },
  {
    id: 'wasm',
    scopeName: 'source.wat',
    path: 'wasm.tmLanguage.json',
    displayName: 'WebAssembly Binary'
  },
  {
    id: 'wenyan',
    scopeName: 'source.wenyan',
    path: 'wenyan.tmLanguage.json',
    aliases: ['文言']
  },
  {
    id: 'wgsl',
    scopeName: 'source.wgsl',
    path: 'wgsl.tmLanguage.json',
    displayName: 'WGSL',
    samplePath: 'wgsl.sample'
  },
  {
    id: 'wolfram',
    scopeName: 'source.wolfram',
    path: 'wolfram.tmLanguage.json',
    displayName: 'Wolfram',
    samplePath: 'wolfram.sample'
  },
  {
    id: 'xml',
    scopeName: 'text.xml',
    path: 'xml.tmLanguage.json',
    displayName: 'XML',
    embeddedLangs: ['java']
  },
  {
    id: 'xsl',
    scopeName: 'text.xml.xsl',
    path: 'xsl.tmLanguage.json',
    displayName: 'XSL',
    embeddedLangs: ['xml']
  },
  {
    id: 'yaml',
    scopeName: 'source.yaml',
    path: 'yaml.tmLanguage.json',
    displayName: 'YAML',
    aliases: ['yml']
  },
  {
    id: 'zenscript',
    scopeName: 'source.zenscript',
    path: 'zenscript.tmLanguage.json',
    displayName: 'ZenScript',
    samplePath: 'zenscript.sample'
  }
]
