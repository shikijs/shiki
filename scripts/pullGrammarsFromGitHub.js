const { get, convertGHURLToDownloadURL } = require('./download')
const fs = require('fs')
const url = require('url')
const path = require('path')

const LANGUAGE_GRAMMAR_FOLDER_PATH = path.join(__dirname, '..', 'tmp/grammars')

/**
 * All language grammar sources on github.com.
 *
 * To add one:
 * - Search `<lang> textmate` on GitHub
 * - Search `<lang>` on VS Code Marketplace
 * - Pick the most recently updated fork that contains the grammar
 * - Add the URL to the end
 */
const languageSources = [
  'https://github.com/prisma-labs/vscode-graphql/blob/master/grammars/graphql.json',
  'https://github.com/karuna/haml-vscode/blob/master/syntaxes/haml.json',
  'https://github.com/James-Yu/LaTeX-Workshop/blob/master/syntax/LaTeX.tmLanguage.json',
  'https://github.com/TheRealSyler/vscode-sass-indented/blob/master/syntaxes/sass.tmLanguage.json',
  'https://github.com/d4rkr00t/language-stylus/blob/master/syntaxes/stylus.json',
  'https://github.com/textmate/toml.tmbundle/blob/master/Syntaxes/TOML.tmLanguage',
  'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-generated.json',
  'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-html.tmLanguage.json',
  'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-postcss.json',
  'https://github.com/13xforever/x86_64-assembly-vscode/blob/master/syntaxes/language-x86_64-assembly.tmLanguage',
  'https://github.com/mathworks/MATLAB-Language-grammar/blob/40d9a0cd3b628f80cdcf948bbe1747a527ed5dd5/Matlab.tmbundle/Syntaxes/MATLAB.tmLanguage',
  'https://github.com/rpardee/sas/blob/master/syntaxes/sas.tmLanguage',
  'https://github.com/Pure-D/code-d/blob/master/syntaxes/d.json',
  'https://github.com/Dart-Code/Dart-Code/blob/master/syntaxes/dart.json',
  'https://github.com/zabel-xyz/plsql-language/blob/master/syntaxes/plsql.tmLanguage',
  'https://github.com/textmate/logo.tmbundle/blob/master/Syntaxes/Logo.tmLanguage',
  'https://github.com/alefragnani/vscode-language-pascal/blob/master/syntaxes/pascal.tmLanguage',
  'https://github.com/spgennard/vscode_cobol/blob/master/syntaxes/COBOL.tmLanguage.json',
  'https://github.com/mathiasfrohlich/vscode-kotlin/blob/master/syntaxes/Kotlin.tmLanguage',
  'https://github.com/scala/vscode-scala-syntax/blob/master/syntaxes/Scala.tmLanguage.json',
  'https://github.com/pvl/abap.tmbundle/blob/master/Syntaxes/ABAP.tmLanguage',
  'https://github.com/julia-vscode/julia-vscode/blob/master/syntaxes/julia.json',
  'https://github.com/sjhuangx/vscode-scheme/blob/master/syntaxes/scheme.tmLanguage',
  'https://github.com/arthwang/vsc-prolog/blob/master/syntaxes/prolog.swi.tmLanguage.json',
  'https://github.com/AdaCore/ada_language_server/blob/master/integration/vscode/ada/advanced/ada.tmLanguage.json',
  'https://github.com/mattn/vscode-lisp/blob/master/syntaxes/Lisp.tmLanguage',
  'https://github.com/forcedotcom/apex-tmLanguage/blob/main/grammars/apex.tmLanguage',
  'https://github.com/krvajal/vscode-fortran-support/blob/master/syntaxes/fortran_free-form.tmLanguage.json',
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
  'https://github.com/wasmerio/vscode-wasm/blob/master/syntaxes/wat.json',
  'https://github.com/bbenoist/vscode-nix/blob/master/syntaxes/nix.tmLanguage',
  'https://github.com/elm-tooling/elm-language-client-vscode/blob/master/syntaxes/elm-syntax.json',
  'https://github.com/nwolverson/vscode-language-purescript/blob/master/syntaxes/purescript.json',
  'https://github.com/sveltejs/language-tools/blob/master/packages/svelte-vscode/syntaxes/svelte.tmLanguage.json',
  'https://github.com/samuelcolvin/jinjahtml-vscode/blob/master/syntaxes/jinja.tmLanguage.json',
  'https://github.com/samuelcolvin/jinjahtml-vscode/blob/master/syntaxes/jinja-html.tmLanguage.json',
  'https://github.com/wenyan-lang/highlight/blob/master/wenyan.tmLanguage.json',
  'https://github.com/elixir-editors/elixir-tmbundle/blob/master/Syntaxes/Elixir.tmLanguage',
  'https://github.com/pgourlain/vscode_erlang/blob/master/syntaxes/erlang.tmLanguage',
  'https://github.com/freight-trust/linguist-edi/blob/master/edi.tmLanguage.json',
  'https://github.com/ConsenSys/vscode-solidity-auditor/blob/master/src/syntaxes/solidity.tmLanguage.json',
  'https://github.com/vyperlang/vscode-vyper/blob/master/syntaxes/vyper.tmLanguage.json'
]

async function go() {
  for (let l of languageSources) {
    const targetUrl = convertGHURLToDownloadURL(l)
    const newFileName = l.endsWith('.json')
      ? path.parse(url.parse(l).path).name.replace('.tmLanguage', '') + '.tmLanguage.json'
      : path.parse(url.parse(l).path).name.replace('.tmLanguage', '') + '.tmLanguage.plist'
    const content = await get(targetUrl)
    fs.writeFileSync(path.resolve(LANGUAGE_GRAMMAR_FOLDER_PATH, newFileName), content)
    console.log(`Downloaded ${newFileName}`)
  }
}

go()
