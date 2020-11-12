# shiki-languages

Languages & grammars for Shiki.

## Collections

- [VS Code](https://github.com/microsoft/vscode)

## Extras

See [/scripts/pullGrammarsFromGitHub.js](/scripts/pullGrammarsFromGitHub.js)

## Literal Values

```ts
export type Lang =
  | 'asm'
  | 'bat'
  | 'c'
  | 'clojure'
  | 'coffee'
  | 'cpp'
  | 'csharp'
  | 'css'
  | 'd'
  | 'dart'
  | 'diff'
  | 'dockerfile'
  | 'fsharp'
  | 'git-commit'
  | 'git-rebase'
  | 'go'
  | 'graphql'
  | 'groovy'
  | 'haml'
  | 'handlebars'
  | 'hlsl'
  | 'html'
  | 'ini'
  | 'java'
  | 'javascript'
  | 'json'
  | 'jsonc'
  | 'jsx'
  | 'latex'
  | 'less'
  | 'log'
  | 'logo'
  | 'lua'
  | 'makefile'
  | 'markdown'
  | 'matlab'
  | 'objective-c'
  | 'pascal'
  | 'perl'
  | 'perl6'
  | 'php'
  | 'pls'
  | 'postcss'
  | 'powershell'
  | 'pug'
  | 'python'
  | 'r'
  | 'razor'
  | 'ruby'
  | 'rust'
  | 'sas'
  | 'sass'
  | 'scss'
  | 'shaderlab'
  | 'shellscript'
  | 'sql'
  | 'stylus'
  | 'swift'
  | 'toml'
  | 'ts'
  | 'tsx'
  | 'typescript'
  | 'vb'
  | 'vue'
  | 'xml'
  | 'xsl'
  | 'yaml'
```

## Add

- [/scripts/pullGrammarsFromGitHub.js](/scripts/pullGrammarsFromGitHub.js)
- `yarn update:grammars`