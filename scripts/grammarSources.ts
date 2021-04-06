/**
 * All grammars in vscode are copied over, with some transformations
 */

/**
 * Remove these grammars bundled in vscode
 */
export const vscodeGrammarsToRemove = [
  'html-derivative',
  'ignore',
  'MagicRegExp',
  'platform',
  'sassdoc',
  'searchResult',
  'log',
  'cuda-cpp',
  'cshtml',
  'jsdoc.js.injection',
  'jsdoc.ts.injection'
]

/**
 * Rename these grammars bundled in vscode
 */
export const vscodeGrammarsToRename = {
  'asp-vb-net': 'vb',
  batchfile: 'bat',
  coffeescript: 'coffee',
  'cpp.embedded.macro': 'cpp-macro',
  JavaScriptReact: 'jsx',
  MagicPython: 'python',
  'shell-unix-bash': 'shellscript',
  TypeScriptReact: 'tsx',
  'fortran_free-form': 'fortran',
  'objective-c++': 'objective-cpp',
  perl6: 'raku'
}

/**
 * All language grammar sources on github.com.
 *
 * To add one:
 * - Search `<lang> textmate` on GitHub
 * - Search `<lang>` on VS Code Marketplace
 * - Pick the most recently updated fork that contains the grammar
 * - Add the URL to the end
 * - Run `yarn update:grammars`, examine the changes
 *
 * The grammar id is normalized from the `name` key of the grammar json file.
 * When the grammar provides an undesirable name (or no `name` key), for example `x86 and x86_64 Assembly` at
 * https://github.com/13xforever/x86_64-assembly-vscode/blob/face834a56e416230c2d20939f9fa77c25344865/syntaxes/language-x86_64-assembly.tmLanguage#L13-L14,
 * provide an array like `['asm', '<url>']` to name the language `asm`
 */
export const githubGrammarSources: (string | [string, string])[] = [
  'https://github.com/prisma-labs/vscode-graphql/blob/master/grammars/graphql.json',
  ['haml', 'https://github.com/karuna/haml-vscode/blob/master/syntaxes/haml.json'],
  'https://github.com/James-Yu/LaTeX-Workshop/blob/master/syntax/LaTeX.tmLanguage.json',
  'https://github.com/TheRealSyler/vscode-sass-indented/blob/master/syntaxes/sass.tmLanguage.json',
  'https://github.com/d4rkr00t/language-stylus/blob/master/syntaxes/stylus.json',
  'https://github.com/textmate/toml.tmbundle/blob/master/Syntaxes/TOML.tmLanguage',
  'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-generated.json',
  'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-html.tmLanguage.json',
  'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-postcss.json',
  [
    'asm',
    'https://github.com/13xforever/x86_64-assembly-vscode/blob/master/syntaxes/language-x86_64-assembly.tmLanguage'
  ],
  'https://github.com/mathworks/MATLAB-Language-grammar/blob/40d9a0cd3b628f80cdcf948bbe1747a527ed5dd5/Matlab.tmbundle/Syntaxes/MATLAB.tmLanguage',
  ['sas', 'https://github.com/rpardee/sas/blob/master/syntaxes/sas.tmLanguage'],
  'https://github.com/Pure-D/code-d/blob/master/syntaxes/d.json',
  'https://github.com/Dart-Code/Dart-Code/blob/master/syntaxes/dart.json',
  ['plsql', 'https://github.com/zabel-xyz/plsql-language/blob/master/syntaxes/plsql.tmLanguage'],
  'https://github.com/textmate/logo.tmbundle/blob/master/Syntaxes/Logo.tmLanguage',
  'https://github.com/alefragnani/vscode-language-pascal/blob/master/syntaxes/pascal.tmLanguage',
  'https://github.com/spgennard/vscode_cobol/blob/master/syntaxes/COBOL.tmLanguage.json',
  'https://github.com/mathiasfrohlich/vscode-kotlin/blob/master/syntaxes/Kotlin.tmLanguage',
  'https://github.com/scala/vscode-scala-syntax/blob/master/syntaxes/Scala.tmLanguage.json',
  'https://github.com/pvl/abap.tmbundle/blob/master/Syntaxes/ABAP.tmLanguage',
  'https://github.com/sjhuangx/vscode-scheme/blob/master/syntaxes/scheme.tmLanguage',
  [
    'prolog',
    'https://github.com/arthwang/vsc-prolog/blob/master/syntaxes/prolog.swi.tmLanguage.json'
  ],
  'https://github.com/AdaCore/ada_language_server/blob/master/integration/vscode/ada/advanced/ada.tmLanguage.json',
  'https://github.com/mattn/vscode-lisp/blob/master/syntaxes/Lisp.tmLanguage',
  'https://github.com/forcedotcom/apex-tmLanguage/blob/main/grammars/apex.tmLanguage',
  'https://github.com/octref/language-haskell/blob/master/syntaxes/haskell.json',
  'https://github.com/wholroyd/vscode-hcl/blob/develop/syntaxes/hcl.json',
  'https://github.com/slackhq/vscode-hack/blob/master/syntaxes/hack.json',
  'https://github.com/luggage66/vscode-awk/blob/master/syntaxes/awk.tmLanguage',
  'https://github.com/BowlerHatLLC/vscode-as3mxml/blob/master/distribution/src/assembly/syntaxes/AS3.tmLanguage',
  'https://github.com/sleutho/tcl/blob/master/syntaxes/tcl.tmLanguage',
  'https://github.com/reasonml-editor/vscode-reasonml/blob/master/syntaxes/ocaml.json',
  'https://github.com/dunstontc/viml/blob/master/syntaxes/viml.tmLanguage.json',
  'https://github.com/octref/puppet-vscode/blob/main/syntaxes/puppet.tmLanguage',
  'https://github.com/heptio/vscode-jsonnet/blob/master/syntaxes/jsonnet.tmLanguage.json',
  'https://github.com/leocamello/vscode-smalltalk/blob/master/syntaxes/smalltalk.tmLanguage.json',
  'https://github.com/crystal-lang-tools/vscode-crystal-lang/blob/master/syntaxes/crystal.json',
  ['wasm', 'https://github.com/wasmerio/vscode-wasm/blob/master/syntaxes/wat.json'],
  'https://github.com/bbenoist/vscode-nix/blob/master/syntaxes/nix.tmLanguage',
  'https://github.com/elm-tooling/elm-language-client-vscode/blob/master/syntaxes/elm-syntax.json',
  'https://github.com/nwolverson/vscode-language-purescript/blob/master/syntaxes/purescript.json',
  [
    'svelte',
    'https://github.com/sveltejs/language-tools/blob/master/packages/svelte-vscode/syntaxes/svelte.tmLanguage.src.yaml'
  ],
  'https://github.com/samuelcolvin/jinjahtml-vscode/blob/master/syntaxes/jinja.tmLanguage.json',
  'https://github.com/samuelcolvin/jinjahtml-vscode/blob/master/syntaxes/jinja-html.tmLanguage.json',
  'https://github.com/wenyan-lang/highlight/blob/master/wenyan.tmLanguage.json',
  'https://github.com/elixir-editors/elixir-tmbundle/blob/master/Syntaxes/Elixir.tmLanguage',
  'https://github.com/pgourlain/vscode_erlang/blob/master/syntaxes/erlang.tmLanguage',
  'https://github.com/textmate/applescript.tmbundle/blob/master/Syntaxes/AppleScript.tmLanguage',
  [
    'erb',
    'https://github.com/textmate/ruby.tmbundle/blob/master/Syntaxes/HTML%20(Ruby%20-%20ERB).tmLanguage'
  ],
  'https://github.com/textmate/ssh-config.tmbundle/blob/master/Syntaxes/SSH-Config.tmLanguage',
  [
    'razor',
    'https://github.com/dotnet/aspnetcore-tooling/blob/master/src/Razor/src/Microsoft.AspNetCore.Razor.VSCode.Extension/syntaxes/aspnetcorerazor.tmLanguage.json'
  ],
  'https://github.com/MarioSchwalbe/vscode-gnuplot/blob/master/syntaxes/gnuplot.tmLanguage',
  'https://github.com/silvenon/vscode-mdx/blob/master/syntaxes/mdx.tmLanguage.json',
  'https://github.com/kimmolinna/vscode-apl-language/blob/master/syntaxes/apl.tmLanguage.json',
  ['apache', 'https://github.com/colinta/ApacheConf.tmLanguage/blob/master/ApacheConf.tmLanguage'],
  'https://github.com/mshr-h/vscode-verilog-hdl-support/blob/master/syntaxes/verilog.tmLanguage',
  [
    'system-verilog',
    'https://github.com/mshr-h/vscode-verilog-hdl-support/blob/master/syntaxes/systemverilog.tmLanguage'
  ],
  'https://github.com/jonasjj/awesome-vhdl/blob/master/syntaxes/vhdl.tmLanguage',
  'https://github.com/juanfranblanco/vscode-solidity/blob/master/syntaxes/solidity.json',
  [
    'riscv',
    'https://github.com/zhuanhao-wu/vscode-riscv-support/blob/master/syntaxes/riscv.tmLanguage'
  ],
  [
    'gherkin',
    'https://github.com/alexkrechik/VSCucumberAutoComplete/blob/master/gclient/syntaxes/feature.tmLanguage'
  ],
  'https://github.com/hangxingliu/vscode-nginx-conf-hint/blob/master/syntaxes/nginx.tmLanguage',
  'https://github.com/pragmagic/vscode-nim/blob/master/syntaxes/nim.json',
  ['twig', 'https://github.com/nalabdou/Symfony-code-snippets/blob/master/syntaxes/twig.tmLanguage']
]

/**
 * Aliases to export, so one can use `md` as well as `markdown` to highlight
 * markdown content
 */
export const languageAliases = {
  bat: ['batch'],
  clojure: ['clj'],
  csharp: ['c#'],
  fsharp: ['f#'],
  handlebars: ['hbs'],
  javascript: ['js'],
  latex: ['tex'],
  make: ['makefile'],
  markdown: ['md'],
  'objective-c': ['objc'],
  powershell: ['ps', 'ps1'],
  pug: ['jade'],
  python: ['py'],
  raku: ['perl6'],
  ruby: ['rb'],
  'html-ruby-erb': ['erb'],
  shaderlab: ['shader'],
  shellscript: ['shell', 'bash', 'sh', 'zsh'],
  stylus: ['styl'],
  typescript: ['ts'],
  vb: ['cmd'],
  wenyan: ['文言']
}

/**
 * Embedded languages excluded from exporting
 * Users should use languages that embed them
 */
export const embeddedLanguagesToExclude = [
  // `vue` or `html` instead
  'vue-html',
  // `jinja-html` instead
  'jinja',
  // `php` instead
  'php-html',
  // embedded by `cpp`
  'cpp-macro'
]
