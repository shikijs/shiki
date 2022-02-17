# shiki-languages

TextMate grammars for Shiki. Grammars are collected from two sources:

- [VS Code](https://github.com/microsoft/vscode)
- A [handpicked list](/scripts/grammarSources.ts) from GitHub

A [build script](/scripts/pullGrammars.sh) runs every day to pull latest grammars from the upstream sources.

## Supporting your own languages with Shiki 

You can add a new language to your shiki instance by using the JSON version of your `tmLanguage` files with the `langs` param in your config:

```ts
import shiki from "shiki"
import {readFileSync} from "fs"

const myLanguageGrammar = JSON.parse(readFileSync("./path/to/lang.tmLanguage.json"))

const myLanguage = {
  id: "mylanguage",
  scopeName: 'source.mylanguage',
  grammar: myLanguageGrammar,
  aliases: ['my', 'mylang'],
}

const highlighter = await shiki.getHighlighter()
await highlighter.loadLanguage(myLanguage)
```

If you just have a `.tmLanguage` and need to convert it to JSON, [this VS Code extension](https://marketplace.visualstudio.com/items?itemName=Togusa09.tmlanguage) can help.

## Adding Grammar

- Find grammar for a language by searching `<lang> textmate` on GitHub or searching `<lang>` on VS Code Marketplace
- Add your grammar to [/scripts/grammarSources.ts](/scripts/grammarSources.ts)
- In [/packages/shiki/samples/](/packages/shiki/samples/), add a code sample file `<id>.sample` for your language. A sample should include a variety of language syntaxes and succinctly capture the idiosyncrasy of a language. Format requirements:
  - Space for indentation
  - Less than 100 columns if possible
  - Link to source in the last line, for example `# From https://poignant.guide/book/chapter-5.html`
- Run `pnpm update:grammars`
- Review the diffs in git. You should see:
  - `docs/languages.md`: Your language id added
  - `packages/shiki/languages/<lang>.tmLanguage.json`: The grammar downloaded
  - `packages/shiki/samples/<lang>.sample`: The sample file you added
  - `packages/shiki/src/languages.ts`: Your language added to `type Lang` and `const languages`
  - `scripts/grammarSources.ts`: The grammar's id and URL
- 🚀 Send in the PR!

## All Languages

```ts
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
  | 'c'
  | 'clojure' | 'clj'
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
  | 'erlang'
  | 'fish'
  | 'fsharp' | 'f#'
  | 'gherkin'
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
  | 'jssm' | 'fsl'
  | 'jsx'
  | 'julia'
  | 'kotlin'
  | 'latex'
  | 'less'
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
```
