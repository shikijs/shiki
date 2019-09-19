# shiki-languages

Languages & grammars for Shiki.

## Collections

- [VS Code](https://github.com/microsoft/vscode)

## Extras

- [Haml](https://github.com/karuna/haml-vscode)
- [Graphql](https://github.com/prisma/vscode-graphql)
- [Sass](https://github.com/robinbentley/vscode-sass-indented)
- [Stylus](https://github.com/d4rkr00t/language-stylus)
- [Postcss](https://github.com/vuejs/vetur)
- [Vue](https://github.com/vuejs/vetur)
- [Vue-html](https://github.com/vuejs/vetur)

## Literal Values

```ts
export type TCommonLang =
  | 'clojure'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'css'
  | 'go'
  | 'html'
  | 'jade'
  | 'java'
  | 'jsx'
  | 'javascript'
  | 'json'
  | 'jsonc'
  | 'less'
  | 'lua'
  | 'makefile'
  | 'markdown'
  | 'objective-c'
  | 'perl6'
  | 'php'
  | 'python'
  | 'r'
  | 'ruby'
  | 'rust'
  | 'scss'
  | 'shellscript'
  | 'sql'
  | 'swift'
  | 'typescript'
  | 'tsx'
  | 'xml'
  | 'yaml'
  /**
   * Extra grammars
   */
  | 'haml'
  | 'graphql'
  | 'postcss'
  | 'sass'
  | 'stylus'
  | 'vue'
  | 'vue-html'
  | 'latex'

export type TCommonLangAlias =
  | 'clj'
  | 'c++'
  | 'htm'
  | 'xhtml'
  | 'js'
  | 'objc'
  | 'py'
  | 'rb'
  | 'shell'
  | 'bash'
  | 'sh'
  | 'zsh'
  | 'ts'
  | 'yml'
  | 'md'
  /**
   * Extra grammars
   */
  | 'styl'
  | 'tex'

export type TOtherLang =
  | 'bat'
  | 'coffeescript'
  | 'diff'
  | 'dockerfile'
  | 'fsharp'
  | 'git-commit'
  | 'git-rebase'
  | 'groovy'
  | 'handlebars'
  | 'ini'
  | 'properties'
  | 'perl'
  | 'powershell'
  | 'razor'
  | 'shaderlab'
  | 'vb'
  | 'cmd'
  | 'xsl'

export type TLang = TCommonLang | TCommonLangAlias | TOtherLang
```

### Upstream

- `toml`: https://github.com/bungcip/better-toml