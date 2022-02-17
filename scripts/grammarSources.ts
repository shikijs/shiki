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
  'jsdoc.ts.injection',
  'md-math',
  'md-math-inline',
  'md-math-block',
  'cpp-grammar-bailout',
  'markdown-latex-combined'
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
 * - Insert `[name, url]` to the list sorted by `name`
 *   - `name` should be the `name` key in the raw json/yaml/plist file
 *     - When the grammar provides an undesirable name (or no `name` key), for example `x86 and x86_64 Assembly` at
 *       https://github.com/13xforever/x86_64-assembly-vscode/blob/face834a56e416230c2d20939f9fa77c25344865/syntaxes/language-x86_64-assembly.tmLanguage#L13-L14
 *       specify the desired name, for example `asm`
 *   - `url` should be the github URL
 * - Run `pnpm update:grammars`, examine the changes
 */
export const githubGrammarSources: [string, string][] = [
  ['abap', 'https://github.com/pvl/abap.tmbundle/blob/master/Syntaxes/ABAP.tmLanguage'],
  [
    'ada',
    'https://github.com/AdaCore/ada_language_server/blob/master/integration/vscode/ada/advanced/ada.tmLanguage.json'
  ],
  ['apache', 'https://github.com/colinta/ApacheConf.tmLanguage/blob/master/ApacheConf.tmLanguage'],
  ['apex', 'https://github.com/forcedotcom/apex-tmLanguage/blob/main/grammars/apex.tmLanguage'],
  [
    'apl',
    'https://github.com/kimmolinna/vscode-apl-language/blob/master/syntaxes/apl.tmLanguage.json'
  ],
  [
    'applescript',
    'https://github.com/textmate/applescript.tmbundle/blob/master/Syntaxes/AppleScript.tmLanguage'
  ],
  [
    'actionscript-3',
    'https://github.com/BowlerHatLLC/vscode-as3mxml/blob/master/distribution/src/assembly/syntaxes/AS3.tmLanguage'
  ],
  [
    'asm',
    'https://github.com/13xforever/x86_64-assembly-vscode/blob/master/syntaxes/language-x86_64-assembly.tmLanguage'
  ],
  [
    'astro',
    'https://github.com/withastro/language-tools/blob/main/packages/vscode/syntaxes/astro.tmLanguage.json'
  ],
  ['awk', 'https://github.com/luggage66/vscode-awk/blob/master/syntaxes/awk.tmLanguage'],
  [
    'ballerina',
    'https://github.com/ballerina-platform/ballerina-grammar/blob/master/syntaxes/ballerina.tmLanguage'
  ],
  [
    'berry',
    'https://github.com/berry-lang/berry/blob/master/tools/plugins/vscode/skiars.berry-0.1.0/syntaxes/berry.json'
  ],
  ['bicep', 'https://github.com/Azure/bicep/blob/main/src/textmate/bicep.tmlanguage'],
  ['cobol', 'https://github.com/spgennard/vscode_cobol/blob/master/syntaxes/COBOL.tmLanguage.json'],
  ['codeql', 'https://github.com/github/vscode-codeql/blob/main/syntaxes/ql.tmLanguage.json'],
  [
    'crystal',
    'https://github.com/crystal-lang-tools/vscode-crystal-lang/blob/master/syntaxes/crystal.json'
  ],
  ['csharp', 'https://github.com/dotnet/csharp-tmLanguage/blob/main/grammars/csharp.tmLanguage'],
  ['cue', 'https://github.com/cue-sh/vscode-cue/blob/master/syntaxes/cue.tmLanguage.json'],
  ['d', 'https://github.com/Pure-D/code-d/blob/master/syntaxes/d.json'],
  ['dart', 'https://github.com/Dart-Code/Dart-Code/blob/master/syntaxes/dart.json'],
  [
    'dream-maker',
    'https://github.com/gbasood/vscode-atomic-dreams/blob/master/syntaxes/dm.tmLanguage.json'
  ],
  [
    'elixir',
    'https://github.com/elixir-editors/elixir-tmbundle/blob/master/Syntaxes/Elixir.tmLanguage'
  ],
  [
    'elm',
    'https://github.com/elm-tooling/elm-language-client-vscode/blob/master/syntaxes/elm-syntax.json'
  ],
  [
    'erb',
    'https://github.com/textmate/ruby.tmbundle/blob/master/Syntaxes/HTML%20(Ruby%20-%20ERB).tmLanguage'
  ],
  ['erlang', 'https://github.com/erlang-ls/grammar/blob/main/Erlang.plist'],
  ['fish', 'https://github.com/bmalehorn/vscode-fish/blob/master/syntaxes/fish.tmLanguage.json'],
  [
    'gherkin',
    'https://github.com/alexkrechik/VSCucumberAutoComplete/blob/master/gclient/syntaxes/feature.tmLanguage'
  ],
  [
    'gnuplot',
    'https://github.com/MarioSchwalbe/vscode-gnuplot/blob/master/syntaxes/gnuplot.tmLanguage'
  ],
  ['graphql', 'https://github.com/prisma-labs/vscode-graphql/blob/master/grammars/graphql.json'],
  ['hack', 'https://github.com/slackhq/vscode-hack/blob/master/syntaxes/hack.json'],
  ['haml', 'https://github.com/karuna/haml-vscode/blob/master/syntaxes/haml.json'],
  ['haskell', 'https://github.com/octref/language-haskell/blob/master/syntaxes/haskell.json'],
  ['hcl', 'https://github.com/wholroyd/vscode-hcl/blob/develop/syntaxes/hcl.json'],
  [
    'jinja',
    'https://github.com/samuelcolvin/jinjahtml-vscode/blob/master/syntaxes/jinja.tmLanguage.json'
  ],
  [
    'jinja-html',
    'https://github.com/samuelcolvin/jinjahtml-vscode/blob/master/syntaxes/jinja-html.tmLanguage.json'
  ],
  [
    'jsonnet',
    'https://github.com/heptio/vscode-jsonnet/blob/master/syntaxes/jsonnet.tmLanguage.json'
  ],
  ['jssm', 'https://github.com/StoneCypher/sublime-jssm/blob/master/jssm.tmLanguage'],
  [
    'kotlin',
    'https://github.com/mathiasfrohlich/vscode-kotlin/blob/master/syntaxes/Kotlin.tmLanguage'
  ],
  ['latex', 'https://github.com/James-Yu/LaTeX-Workshop/blob/master/syntax/LaTeX.tmLanguage.json'],
  ['lisp', 'https://github.com/mattn/vscode-lisp/blob/master/syntaxes/Lisp.tmLanguage'],
  ['logo', 'https://github.com/textmate/logo.tmbundle/blob/master/Syntaxes/Logo.tmLanguage'],
  ['marko', 'https://github.com/marko-js/marko-tmbundle/blob/master/Syntaxes/Marko.tmLanguage'],
  [
    'matlab',
    'https://github.com/mathworks/MATLAB-Language-grammar/blob/40d9a0cd3b628f80cdcf948bbe1747a527ed5dd5/Matlab.tmbundle/Syntaxes/MATLAB.tmLanguage'
  ],
  ['mdx', 'https://github.com/silvenon/vscode-mdx/blob/master/syntaxes/mdx.tmLanguage.json'],
  [
    'nginx',
    'https://github.com/hangxingliu/vscode-nginx-conf-hint/blob/master/src/syntax/nginx.tmLanguage'
  ],
  ['nim', 'https://github.com/pragmagic/vscode-nim/blob/master/syntaxes/nim.json'],
  ['nix', 'https://github.com/bbenoist/vscode-nix/blob/master/syntaxes/nix.tmLanguage'],
  ['ocaml', 'https://github.com/reasonml-editor/vscode-reasonml/blob/master/syntaxes/ocaml.json'],
  [
    'pascal',
    'https://github.com/alefragnani/vscode-language-pascal/blob/master/syntaxes/pascal.tmLanguage'
  ],
  ['plsql', 'https://github.com/zabel-xyz/plsql-language/blob/master/syntaxes/plsql.tmLanguage'],
  [
    'prisma',
    'https://github.com/prisma/language-tools/blob/master/packages/vscode/syntaxes/prisma.tmLanguage.json'
  ],
  [
    'prolog',
    'https://github.com/arthwang/vsc-prolog/blob/master/syntaxes/prolog.swi.tmLanguage.json'
  ],
  ['puppet', 'https://github.com/octref/puppet-vscode/blob/main/syntaxes/puppet.tmLanguage'],
  [
    'purescript',
    'https://github.com/nwolverson/vscode-language-purescript/blob/master/syntaxes/purescript.json'
  ],
  [
    'razor',
    'https://github.com/dotnet/aspnetcore-tooling/blob/master/src/Razor/src/Microsoft.AspNetCore.Razor.VSCode.Extension/syntaxes/aspnetcorerazor.tmLanguage.json'
  ],
  [
    'rel',
    'https://github.com/relationalai-oss/rel_vscode/blob/master/syntaxes/rel.tmLanguage.json'
  ],
  [
    'riscv',
    'https://github.com/zhuanhao-wu/vscode-riscv-support/blob/master/syntaxes/riscv.tmLanguage'
  ],
  ['sas', 'https://github.com/rpardee/sas/blob/master/syntaxes/sas.tmLanguage'],
  [
    'sass',
    'https://github.com/TheRealSyler/vscode-sass-indented/blob/master/syntaxes/sass.tmLanguage.json'
  ],
  [
    'scala',
    'https://github.com/scala/vscode-scala-syntax/blob/master/syntaxes/Scala.tmLanguage.json'
  ],
  ['scheme', 'https://github.com/sjhuangx/vscode-scheme/blob/master/syntaxes/scheme.tmLanguage'],
  [
    'smalltalk',
    'https://github.com/leocamello/vscode-smalltalk/blob/master/syntaxes/smalltalk.tmLanguage.json'
  ],
  [
    'solidity',
    'https://github.com/juanfranblanco/vscode-solidity/blob/master/syntaxes/solidity.json'
  ],
  [
    'sparql',
    'https://github.com/stardog-union/stardog-vsc/blob/master/stardog-rdf-grammars/syntaxes/sparql.tmLanguage.json'
  ],
  [
    'ssh-config',
    'https://github.com/textmate/ssh-config.tmbundle/blob/master/Syntaxes/SSH-Config.tmLanguage'
  ],
  ['stata', 'https://github.com/kylebarron/language-stata/blob/vscode/grammars/stata.json'],
  ['stylus', 'https://github.com/d4rkr00t/language-stylus/blob/master/syntaxes/stylus.json'],
  [
    'svelte',
    'https://github.com/sveltejs/language-tools/blob/master/packages/svelte-vscode/syntaxes/svelte.tmLanguage.src.yaml'
  ],
  [
    'system-verilog',
    'https://github.com/mshr-h/vscode-verilog-hdl-support/blob/master/syntaxes/systemverilog.tmLanguage'
  ],
  ['tasl', 'https://github.com/underlay/vscode-tasl/blob/main/syntaxes/tasl.tmLanguage.json'],
  ['tcl', 'https://github.com/sleutho/tcl/blob/master/syntaxes/tcl.tmLanguage'],
  ['tex', 'https://github.com/James-Yu/LaTeX-Workshop/blob/master/syntax/TeX.tmLanguage.json'],
  ['toml', 'https://github.com/textmate/toml.tmbundle/blob/master/Syntaxes/TOML.tmLanguage'],
  [
    'turtle',
    'https://github.com/stardog-union/stardog-vsc/blob/master/stardog-rdf-grammars/syntaxes/turtle.tmLanguage.json'
  ],
  [
    'twig',
    'https://github.com/nalabdou/Symfony-code-snippets/blob/master/syntaxes/twig.tmLanguage'
  ],
  [
    'verilog',
    'https://github.com/mshr-h/vscode-verilog-hdl-support/blob/master/syntaxes/verilog.tmLanguage'
  ],
  ['vhdl', 'https://github.com/jonasjj/awesome-vhdl/blob/master/syntaxes/vhdl.tmLanguage'],
  ['viml', 'https://github.com/dunstontc/viml/blob/master/syntaxes/viml.tmLanguage.json'],
  ['vue', 'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-generated.json'],
  ['vue-html', 'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-html.tmLanguage.json'],
  ['postcss', 'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-postcss.json'],
  ['wasm', 'https://github.com/wasmerio/vscode-wasm/blob/master/syntaxes/wat.json'],
  ['wenyan', 'https://github.com/wenyan-lang/highlight/blob/master/wenyan.tmLanguage.json'],
  [
    'zenscript',
    'https://github.com/CraftTweaker/ZenScript-tmLanguage/blob/master/zenscript.tmLanguage.json'
  ]
]

/**
 * Aliases to export, so one can use `md` as well as `markdown` to highlight
 * markdown content
 */
export const languageAliases = {
  bat: ['batch'],
  berry: ['be'],
  clojure: ['clj'],
  csharp: ['c#'],
  fsharp: ['f#'],
  handlebars: ['hbs'],
  javascript: ['js'],
  jssm: ['fsl'],
  make: ['makefile'],
  markdown: ['md'],
  'objective-c': ['objc'],
  powershell: ['ps', 'ps1'],
  pug: ['jade'],
  python: ['py'],
  raku: ['perl6'],
  ruby: ['rb'],
  rust: ['rs'],
  'html-ruby-erb': ['erb'],
  shaderlab: ['shader'],
  shellscript: ['shell', 'bash', 'sh', 'zsh'],
  stylus: ['styl'],
  typescript: ['ts'],
  vb: ['cmd'],
  viml: ['vim', 'vimscript'],
  wenyan: ['文言'],
  codeql: ['ql']
}

/**
 * Embedded languages excluded from exporting
 * Users should use languages that embed them
 */
export const embeddedLanguagesToExclude = [
  // `jinja-html` instead
  'jinja',
  // `php` instead
  'php-html',
  // embedded by `cpp`
  'cpp-macro'
]

/**
 * Grammars from VS Code marketplace
 * Some grammars have compilation step and do not include the built grammar on GitHub,
 * so pull from VS Code marketplace instead.
 *
 * Key is publisher + extId
 * Value is a list. Each item represents a file to extract from the downloaded VSIX.
 * If given ['foo.json', `extension/foo/bar.json`], extract `bar.json` to `tmp/grammars/foo.json`
 */
export const marketplaceGrammarSources: { [extPublisherAndId: string]: [string, string][] } = {
  'bpruitt-goddard.mermaid-markdown-syntax-highlighting': [
    ['mermaid.tmLanguage.json', 'extension/out/mermaid.tmLanguage.json']
  ]
}
