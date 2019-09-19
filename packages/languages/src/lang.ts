import * as path from 'path'
import { TCommonLang, TCommonLangAlias, TOtherLang, TLang } from './types'
import { IRawGrammar } from 'vscode-textmate'

export const commonLangIds: TCommonLang[] = [
  'clojure',
  'c',
  'cpp',
  'csharp',
  'css',
  'go',
  'html',
  'jade',
  'java',
  'jsx',
  'javascript',
  'json',
  'jsonc',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objective-c',
  'perl6',
  'php',
  'python',
  'r',
  'ruby',
  'rust',
  'scss',
  'shellscript',
  'sql',
  'swift',
  'typescript',
  'tsx',
  'xml',
  'yaml',
  /**
   * Extra grammars
   */
  'haml',
  'graphql',
  'sass',
  'stylus',
  'postcss',
  'vue',
  'vue-html',
  'latex',
  'toml'
]

export const commonLangAliases: TCommonLangAlias[] = [
  'clj',
  'c++',
  'htm',
  'xhtml',
  'js',
  'objc',
  'py',
  'rb',
  'shell',
  'bash',
  'sh',
  'zsh',
  'ts',
  'yml',
  'md',
  /**
   * Extra grammars
   */
  'styl',
  'tex'
]

export const otherLangIds: TOtherLang[] = [
  'bat',
  'coffeescript',
  'diff',
  'dockerfile',
  'fsharp',
  'git-commit',
  'git-rebase',
  'groovy',
  'handlebars',
  'ini',
  'properties',
  'perl',
  'powershell',
  'razor',
  'shaderlab',
  'vb',
  'cmd',
  'xsl'
]

export interface ILanguageRegistration {
  id: string
  scopeName: string
  path: string
  aliases: string[]
  grammar?: IRawGrammar
}

export function getLangRegistrations(langs: TLang[]): ILanguageRegistration[] {
  const langRegistrationMap = {}

  languages.forEach(l => {
    langRegistrationMap[l.id] = l
    l.aliases.forEach(a => {
      langRegistrationMap[a] = l
    })
  })

  return langs.map(l => langRegistrationMap[l])
}

export const languages: ILanguageRegistration[] = [
  {
    id: 'bat',
    scopeName: 'source.dosbatch',
    path: '../data/grammars/Batch File.tmLanguage',
    aliases: ['batch']
  },
  {
    id: 'clojure',
    scopeName: 'source.clojure',
    path: '../data/grammars/Clojure.tmLanguage',
    aliases: ['clj']
  },
  {
    id: 'coffeescript',
    scopeName: 'source.coffee',
    path: '../data/grammars/coffeescript.json',
    aliases: ['coffee']
  },
  {
    id: 'c',
    scopeName: 'source.c',
    path: '../data/grammars/c.json',
    aliases: []
  },
  {
    id: 'cpp',
    scopeName: 'source.cpp',
    path: '../data/grammars/c++.json',
    aliases: ['c++']
  },
  {
    id: 'csharp',
    scopeName: 'source.cs',
    path: '../data/grammars/csharp.tmLanguage.json',
    aliases: []
  },
  {
    id: 'css',
    scopeName: 'source.css',
    path: '../data/grammars/css.plist',
    aliases: []
  },
  {
    id: 'diff',
    scopeName: 'source.diff',
    path: '../data/grammars/diff.tmLanguage',
    aliases: []
  },
  {
    id: 'dockerfile',
    scopeName: 'source.dockerfile',
    path: '../data/grammars/Dockerfile.tmLanguage',
    aliases: ['docker']
  },
  {
    id: 'fsharp',
    scopeName: 'source.fsharp',
    path: '../data/grammars/fsharp.json',
    aliases: ['f#']
  },
  {
    id: 'git-commit',
    scopeName: 'text.git-commit',
    path: '../data/grammars/git-commit.tmLanguage',
    aliases: []
  },
  {
    id: 'git-rebase',
    scopeName: 'text.git-rebase',
    path: '../data/grammars/git-rebase.tmLanguage',
    aliases: []
  },
  {
    id: 'go',
    scopeName: 'source.go',
    path: '../data/grammars/go.json',
    aliases: []
  },
  {
    id: 'groovy',
    scopeName: 'source.groovy',
    path: '../data/grammars/Groovy.tmLanguage',
    aliases: []
  },
  {
    id: 'handlebars',
    scopeName: 'text.html.handlebars',
    path: '../data/grammars/Handlebars.json',
    aliases: ['hbs']
  },
  {
    id: 'html',
    scopeName: 'text.html.basic',
    path: '../data/grammars/html.json',
    aliases: ['htm', 'xhtml']
  },
  {
    id: 'ini',
    scopeName: 'source.properties',
    path: '../data/grammars/properties.plist',
    aliases: []
  },
  {
    id: 'properties',
    scopeName: 'source.properties',
    path: '../data/grammars/properties.plist',
    aliases: []
  },
  {
    id: 'jade',
    scopeName: 'text.jade',
    path: '../data/grammars/Jade.json',
    aliases: []
  },
  {
    id: 'java',
    scopeName: 'source.java',
    path: '../data/grammars/java.json',
    aliases: []
  },
  {
    id: 'jsx',
    scopeName: 'source.js',
    path: '../data/grammars/JavaScript.tmLanguage.json',
    aliases: []
  },
  {
    id: 'javascript',
    scopeName: 'source.js',
    path: '../data/grammars/JavaScript.tmLanguage.json',
    aliases: ['js']
  },
  {
    id: 'json',
    scopeName: 'source.json',
    path: '../data/grammars/JSON.tmLanguage',
    aliases: []
  },
  {
    id: 'jsonc',
    scopeName: 'source.json.comments',
    path: '../data/grammars/JSONC.tmLanguage.json',
    aliases: []
  },
  {
    id: 'less',
    scopeName: 'source.css.less',
    path: '../data/grammars/less.tmLanguage.json',
    aliases: []
  },
  {
    id: 'lua',
    scopeName: 'source.lua',
    path: '../data/grammars/lua.json',
    aliases: []
  },
  {
    id: 'makefile',
    scopeName: 'source.makefile',
    path: '../data/grammars/Makefile.json',
    aliases: []
  },
  {
    id: 'markdown',
    scopeName: 'text.html.markdown',
    path: '../data/grammars/markdown.tmLanguage',
    aliases: ['md']
  },
  {
    id: 'objective-c',
    scopeName: 'source.objc',
    path: '../data/grammars/Objective-C.tmLanguage',
    aliases: ['objc']
  },
  {
    id: 'perl',
    scopeName: 'source.perl',
    path: '../data/grammars/Perl.plist',
    aliases: []
  },
  {
    id: 'perl6',
    scopeName: 'source.perl.6',
    path: '../data/grammars/Perl 6.tmLanguage',
    aliases: []
  },
  {
    id: 'php',
    scopeName: 'text.html.php',
    path: '../data/grammars/php.json',
    aliases: []
  },
  {
    id: 'powershell',
    scopeName: 'source.powershell',
    path: '../data/grammars/PowershellSyntax.tmLanguage',
    aliases: ['ps', 'ps1']
  },
  {
    id: 'python',
    scopeName: 'source.python',
    path: '../data/grammars/MagicPython.tmLanguage.json',
    aliases: ['py']
  },
  {
    id: 'r',
    scopeName: 'source.r',
    path: '../data/grammars/R.plist',
    aliases: []
  },
  {
    id: 'razor',
    scopeName: 'text.html.cshtml',
    path: '../data/grammars/cshtml.json',
    aliases: []
  },
  {
    id: 'ruby',
    scopeName: 'source.ruby',
    path: '../data/grammars/Ruby.plist',
    aliases: ['rb']
  },
  {
    id: 'rust',
    scopeName: 'source.rust',
    path: '../data/grammars/rust.json',
    aliases: []
  },
  {
    id: 'scss',
    scopeName: 'source.css.scss',
    path: '../data/grammars/scss.json',
    aliases: []
  },
  {
    id: 'shaderlab',
    scopeName: 'source.shaderlab',
    path: '../data/grammars/shaderlab.json',
    aliases: ['shader']
  },
  {
    id: 'shellscript',
    scopeName: 'source.shell',
    path: '../data/grammars/Shell-Unix-Bash.tmLanguage.json',
    aliases: ['shell', 'bash', 'sh', 'zsh']
  },
  {
    id: 'sql',
    scopeName: 'source.sql',
    path: '../data/grammars/SQL.plist',
    aliases: []
  },
  {
    id: 'swift',
    scopeName: 'source.swift',
    path: '../data/grammars/swift.json',
    aliases: []
  },
  {
    id: 'typescript',
    scopeName: 'source.ts',
    path: '../data/grammars/TypeScript.tmLanguage.json',
    aliases: ['ts']
  },
  {
    id: 'tsx',
    scopeName: 'source.tsx',
    path: '../data/grammars/TypeScriptReact.tmLanguage.json',
    aliases: []
  },
  {
    id: 'vb',
    scopeName: 'source.asp.vb.net',
    path: '../data/grammars/ASPVBnet.plist',
    aliases: ['cmd']
  },
  {
    id: 'xml',
    scopeName: 'text.xml',
    path: '../data/grammars/xml.json',
    aliases: []
  },
  {
    id: 'xsl',
    scopeName: 'text.xml.xsl',
    path: '../data/grammars/xsl.json',
    aliases: []
  },
  {
    id: 'yaml',
    scopeName: 'source.yaml',
    path: '../data/grammars/yaml.json',
    aliases: ['yml']
  },
  /**
   * Extra grammars
   */
  {
    id: 'haml',
    scopeName: 'text.haml',
    path: '../data/extraGrammars/haml.json',
    aliases: []
  },
  {
    id: 'graphql',
    scopeName: 'source.graphql',
    path: '../data/extraGrammars/graphql.json',
    aliases: []
  },
  {
    id: 'sass',
    scopeName: 'source.sass',
    path: '../data/extraGrammars/sass.tmLanguage',
    aliases: []
  },
  {
    id: 'stylus',
    scopeName: 'source.stylus',
    path: '../data/extraGrammars/stylus.json',
    aliases: ['styl']
  },
  {
    id: 'postcss',
    scopeName: 'source.css.postcss',
    path: '../data/extraGrammars/postcss.json',
    aliases: []
  },
  {
    id: 'vue',
    scopeName: 'source.vue',
    path: '../data/extraGrammars/vue.json',
    aliases: []
  },
  {
    id: 'vue-html',
    scopeName: 'text.html.vue-html',
    path: '../data/extraGrammars/vue-html.json',
    aliases: []
  },
  {
    id: 'latex',
    scopeName: 'text.tex.latex',
    path: '../data/extraGrammars/latex.plist',
    aliases: ['tex']
  },
  {
    id: 'toml',
    scopeName: 'source.toml',
    path: '../data/extraGrammars/TOML.tmLanguage',
    aliases: []
  }
]
languages.forEach(l => {
  l.path = path.resolve(__dirname, l.path)
})
