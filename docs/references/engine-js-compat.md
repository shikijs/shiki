# JavaScript RegExp Engine Compatibility References

> Genreated on Friday, September 6, 2024
>
> Version `1.16.2`
>
> Runtime: Node.js v20.12.2

## Report Summary

|                 |                             Count |
| :-------------- | --------------------------------: |
| Total Languages |                               213 |
| Fully Supported | [132](#fully-supported-languages) |
| Mismatched      |       [45](#mismatched-languages) |
| Unsupported     |      [36](#unsupported-languages) |

## Fully Supported Languages

Languages that works with the JavaScript RegExp engine, and will produce the same result as the WASM engine.

| Language       | Highlight Match | Patterns Parsable | Patterns Failed |
| -------------- | :-------------- | ----------------: | --------------: |
| abap           | ✅ OK           |                49 |               - |
| apache         | ✅ OK           |                60 |               - |
| apl            | ✅ OK           |               179 |               - |
| applescript    | ✅ OK           |               151 |               - |
| asciidoc       | ✅ OK           |               262 |               - |
| asm            | ✅ OK           |               297 |               - |
| astro          | ✅ OK           |                59 |               - |
| awk            | ✅ OK           |                36 |               - |
| bat            | ✅ OK           |                58 |               - |
| berry          | ✅ OK           |                18 |               - |
| bibtex         | ✅ OK           |                19 |               - |
| bicep          | ✅ OK           |                28 |               - |
| clarity        | ✅ OK           |                43 |               - |
| clj            | ✅ OK           |                38 |               - |
| clojure        | ✅ OK           |                38 |               - |
| cmake          | ✅ OK           |                23 |               - |
| cobol          | ✅ OK           |               138 |               - |
| codeowners     | ✅ OK           |                 4 |               - |
| codeql         | ✅ OK           |               150 |               - |
| common-lisp    | ✅ OK           |                57 |               - |
| coq            | ✅ OK           |                25 |               - |
| css            | ✅ OK           |               141 |               - |
| csv            | ✅ OK           |                 1 |               - |
| cue            | ✅ OK           |                85 |               - |
| cypher         | ✅ OK           |                39 |               - |
| d              | ✅ OK           |               270 |               - |
| dart           | ✅ OK           |                71 |               - |
| dax            | ✅ OK           |                23 |               - |
| desktop        | ✅ OK           |                16 |               - |
| diff           | ✅ OK           |                16 |               - |
| docker         | ✅ OK           |                 7 |               - |
| dotenv         | ✅ OK           |                 9 |               - |
| dream-maker    | ✅ OK           |                55 |               - |
| elm            | ✅ OK           |                67 |               - |
| fennel         | ✅ OK           |                31 |               - |
| fish           | ✅ OK           |                22 |               - |
| fluent         | ✅ OK           |                23 |               - |
| fsharp         | ✅ OK           |               120 |               - |
| fsl            | ✅ OK           |                30 |               - |
| gdresource     | ✅ OK           |                32 |               - |
| gdscript       | ✅ OK           |                93 |               - |
| gdshader       | ✅ OK           |                38 |               - |
| genie          | ✅ OK           |                20 |               - |
| gherkin        | ✅ OK           |                16 |               - |
| gleam          | ✅ OK           |                26 |               - |
| glimmer-js     | ✅ OK           |                74 |               - |
| glimmer-ts     | ✅ OK           |                74 |               - |
| graphql        | ✅ OK           |                63 |               - |
| groovy         | ✅ OK           |               133 |               - |
| handlebars     | ✅ OK           |                64 |               - |
| hcl            | ✅ OK           |                61 |               - |
| hjson          | ✅ OK           |                55 |               - |
| hlsl           | ✅ OK           |                52 |               - |
| http           | ✅ OK           |                20 |               - |
| hxml           | ✅ OK           |                 6 |               - |
| hy             | ✅ OK           |                 9 |               - |
| jinja          | ✅ OK           |                35 |               - |
| jison          | ✅ OK           |                57 |               - |
| json           | ✅ OK           |                19 |               - |
| json5          | ✅ OK           |                23 |               - |
| jsonc          | ✅ OK           |                19 |               - |
| jsonl          | ✅ OK           |                19 |               - |
| jsonnet        | ✅ OK           |                33 |               - |
| jssm           | ✅ OK           |                30 |               - |
| lean           | ✅ OK           |                32 |               - |
| less           | ✅ OK           |               280 |               - |
| liquid         | ✅ OK           |                69 |               - |
| log            | ✅ OK           |                30 |               - |
| luau           | ✅ OK           |                88 |               - |
| make           | ✅ OK           |                48 |               - |
| marko          | ✅ OK           |                81 |               - |
| matlab         | ✅ OK           |                77 |               - |
| mojo           | ✅ OK           |               213 |               - |
| move           | ✅ OK           |               118 |               - |
| narrat         | ✅ OK           |                34 |               - |
| nextflow       | ✅ OK           |                17 |               - |
| nim            | ✅ OK           |               114 |               - |
| nix            | ✅ OK           |                80 |               - |
| nushell        | ✅ OK           |                75 |               - |
| ocaml          | ✅ OK           |               178 |               - |
| pascal         | ✅ OK           |                23 |               - |
| plsql          | ✅ OK           |                43 |               - |
| postcss        | ✅ OK           |                47 |               - |
| powerquery     | ✅ OK           |                30 |               - |
| prisma         | ✅ OK           |                26 |               - |
| prolog         | ✅ OK           |                26 |               - |
| proto          | ✅ OK           |                33 |               - |
| puppet         | ✅ OK           |                59 |               - |
| python         | ✅ OK           |               218 |               - |
| qmldir         | ✅ OK           |                 7 |               - |
| qss            | ✅ OK           |                31 |               - |
| racket         | ✅ OK           |                68 |               - |
| reg            | ✅ OK           |                 9 |               - |
| regexp         | ✅ OK           |                34 |               - |
| rel            | ✅ OK           |                17 |               - |
| rust           | ✅ OK           |                89 |               - |
| sas            | ✅ OK           |                32 |               - |
| sass           | ✅ OK           |                67 |               - |
| scss           | ✅ OK           |               104 |               - |
| shaderlab      | ✅ OK           |                38 |               - |
| shellsession   | ✅ OK           |                 2 |               - |
| solidity       | ✅ OK           |               102 |               - |
| soy            | ✅ OK           |                45 |               - |
| sparql         | ✅ OK           |                 4 |               - |
| sql            | ✅ OK           |                67 |               - |
| stylus         | ✅ OK           |               107 |               - |
| system-verilog | ✅ OK           |               102 |               - |
| systemd        | ✅ OK           |                32 |               - |
| tasl           | ✅ OK           |                22 |               - |
| tcl            | ✅ OK           |                33 |               - |
| terraform      | ✅ OK           |                62 |               - |
| tex            | ✅ OK           |                38 |               - |
| ts-tags        | ✅ OK           |                 - |               - |
| tsv            | ✅ OK           |                 1 |               - |
| turtle         | ✅ OK           |                15 |               - |
| twig           | ✅ OK           |                94 |               - |
| typespec       | ✅ OK           |                80 |               - |
| typst          | ✅ OK           |                78 |               - |
| v              | ✅ OK           |                76 |               - |
| vala           | ✅ OK           |                20 |               - |
| vb             | ✅ OK           |                34 |               - |
| vhdl           | ✅ OK           |                82 |               - |
| vue-html       | ✅ OK           |                36 |               - |
| vyper          | ✅ OK           |               238 |               - |
| wasm           | ✅ OK           |                78 |               - |
| wenyan         | ✅ OK           |                18 |               - |
| wgsl           | ✅ OK           |                44 |               - |
| wikitext       | ✅ OK           |               104 |               - |
| xml            | ✅ OK           |                30 |               - |
| xsl            | ✅ OK           |                 5 |               - |
| zenscript      | ✅ OK           |                21 |               - |
| zig            | ✅ OK           |                51 |               - |

## Mismatched Languages

Languages that does not throw with the JavaScript RegExp engine, but will produce different result than the WASM engine. Please use with caution.

| Language           | Highlight Match                                                                         | Patterns Parsable | Patterns Failed |
| ------------------ | :-------------------------------------------------------------------------------------- | ----------------: | --------------: |
| angular-html       | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=angular-html)       |                 2 |               - |
| ara                | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=ara)                |                54 |               - |
| bash               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=bash)               |               146 |               - |
| beancount          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=beancount)          |                39 |               - |
| c                  | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=c)                  |               158 |               - |
| cadence            | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=cadence)            |                71 |               - |
| edge               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=edge)               |                10 |               - |
| elixir             | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=elixir)             |               102 |               - |
| fortran-fixed-form | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=fortran-fixed-form) |                 6 |               - |
| fortran-free-form  | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=fortran-free-form)  |               317 |               - |
| glsl               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=glsl)               |                 7 |               - |
| gnuplot            | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=gnuplot)            |                82 |               - |
| go                 | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=go)                 |               115 |               - |
| hack               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=hack)               |               301 |               - |
| html               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=html)               |               116 |               - |
| ini                | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=ini)                |                11 |               - |
| java               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=java)               |               141 |               - |
| kusto              | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=kusto)              |                60 |               - |
| latex              | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=latex)              |               183 |               - |
| logo               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=logo)               |                 9 |               - |
| lua                | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=lua)                |               113 |               - |
| mermaid            | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=mermaid)            |               129 |               - |
| nginx              | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=nginx)              |               102 |               - |
| objective-c        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=objective-c)        |               217 |               - |
| objective-cpp      | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=objective-cpp)      |               297 |               - |
| perl               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=perl)               |               155 |               - |
| php                | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=php)                |               328 |               - |
| po                 | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=po)                 |                23 |               - |
| pug                | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=pug)                |                92 |               - |
| qml                | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=qml)                |                38 |               - |
| r                  | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=r)                  |                73 |               - |
| raku               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=raku)               |                52 |               - |
| riscv              | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=riscv)              |                36 |               - |
| scala              | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=scala)              |               108 |               - |
| scheme             | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=scheme)             |                34 |               - |
| shellscript        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=shellscript)        |               146 |               - |
| smalltalk          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=smalltalk)          |                31 |               - |
| splunk             | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=splunk)             |                17 |               - |
| ssh-config         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=ssh-config)         |                12 |               - |
| svelte             | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=svelte)             |                83 |               - |
| templ              | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=templ)              |                74 |               - |
| toml               | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=toml)               |                40 |               - |
| verilog            | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=verilog)            |                33 |               - |
| vue                | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=vue)                |                69 |               - |
| zsh                | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=zsh)                |               146 |               - |

## Unsupported Languages

Languages that throws with the JavaScript RegExp engine (contains syntaxes that we can't polyfill yet). If you need to use these languages, please use the Oniguruma engine.

| Language       | Highlight Match                                                                 | Patterns Parsable | Patterns Failed |
| -------------- | :------------------------------------------------------------------------------ | ----------------: | --------------: |
| ada            | ✅ OK                                                                           |               199 |               1 |
| angular-ts     | ✅ OK                                                                           |               362 |               1 |
| ballerina      | ✅ OK                                                                           |               229 |               1 |
| haxe           | ✅ OK                                                                           |               174 |               1 |
| imba           | ✅ OK                                                                           |               240 |               1 |
| tsx            | ✅ OK                                                                           |               375 |               1 |
| typescript     | ✅ OK                                                                           |               362 |               1 |
| coffee         | ✅ OK                                                                           |               118 |               2 |
| erlang         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=erlang)     |               146 |               1 |
| javascript     | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=javascript) |               375 |               1 |
| jsx            | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=jsx)        |               375 |               1 |
| blade          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=blade)      |               328 |               2 |
| stata          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=stata)      |               187 |               2 |
| erb            | ❌ Error                                                                        |                 6 |               - |
| haml           | ❌ Error                                                                        |                64 |               - |
| actionscript-3 | ❌ Error                                                                        |                56 |               1 |
| crystal        | ❌ Error                                                                        |               139 |               1 |
| emacs-lisp     | ❌ Error                                                                        |               150 |               1 |
| mdc            | ❌ Error                                                                        |                26 |               1 |
| powershell     | ❌ Error                                                                        |                87 |               1 |
| rst            | ❌ Error                                                                        |                60 |               1 |
| ruby           | ❌ Error                                                                        |               153 |               1 |
| viml           | ❌ Error                                                                        |                71 |               1 |
| wolfram        | ❌ Error                                                                        |               500 |               1 |
| razor          | ❌ Error                                                                        |                82 |               3 |
| yaml           | ❌ Error                                                                        |                42 |               4 |
| julia          | ❌ Error                                                                        |                90 |               5 |
| swift          | ❌ Error                                                                        |               301 |               5 |
| kotlin         | ❌ Error                                                                        |                52 |               6 |
| mdx            | ❌ Error                                                                        |               173 |               8 |
| markdown       | ❌ Error                                                                        |                94 |               9 |
| purescript     | ❌ Error                                                                        |                63 |               9 |
| apex           | ❌ Error                                                                        |               173 |              14 |
| csharp         | ❌ Error                                                                        |               263 |              32 |
| haskell        | ❌ Error                                                                        |               113 |              44 |
| cpp            | ❌ Error                                                                        |               135 |              85 |
