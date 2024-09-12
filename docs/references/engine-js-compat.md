# JavaScript RegExp Engine Compatibility References

> Genreated on Thursday, September 12, 2024
>
> Version `1.17.4`
>
> Runtime: Node.js v20.12.2

## Report Summary

|                 |                             Count |
| :-------------- | --------------------------------: |
| Total Languages |                               213 |
| Fully Supported | [173](#fully-supported-languages) |
| Mismatched      |       [24](#mismatched-languages) |
| Unsupported     |      [16](#unsupported-languages) |

## Fully Supported Languages

Languages that works with the JavaScript RegExp engine, and will produce the same result as the WASM engine.

| Language           | Highlight Match | Patterns Parsable | Patterns Failed | Diff |
| ------------------ | :-------------- | ----------------: | --------------: | ---: |
| abap               | ✅ OK           |                49 |               - |      |
| actionscript-3     | ✅ OK           |                57 |               - |      |
| angular-ts         | ✅ OK           |               363 |               - |      |
| apache             | ✅ OK           |                60 |               - |      |
| apl                | ✅ OK           |               179 |               - |      |
| applescript        | ✅ OK           |               151 |               - |      |
| ara                | ✅ OK           |                54 |               - |      |
| asciidoc           | ✅ OK           |               262 |               - |      |
| asm                | ✅ OK           |               297 |               - |      |
| astro              | ✅ OK           |                59 |               - |      |
| awk                | ✅ OK           |                36 |               - |      |
| ballerina          | ✅ OK           |               230 |               - |      |
| bat                | ✅ OK           |                58 |               - |      |
| berry              | ✅ OK           |                18 |               - |      |
| bibtex             | ✅ OK           |                19 |               - |      |
| bicep              | ✅ OK           |                28 |               - |      |
| cadence            | ✅ OK           |                71 |               - |      |
| clarity            | ✅ OK           |                43 |               - |      |
| clj                | ✅ OK           |                38 |               - |      |
| clojure            | ✅ OK           |                38 |               - |      |
| cmake              | ✅ OK           |                23 |               - |      |
| cobol              | ✅ OK           |               138 |               - |      |
| codeowners         | ✅ OK           |                 4 |               - |      |
| codeql             | ✅ OK           |               150 |               - |      |
| coffee             | ✅ OK           |               120 |               - |      |
| common-lisp        | ✅ OK           |                57 |               - |      |
| coq                | ✅ OK           |                25 |               - |      |
| css                | ✅ OK           |               141 |               - |      |
| csv                | ✅ OK           |                 1 |               - |      |
| cue                | ✅ OK           |                85 |               - |      |
| cypher             | ✅ OK           |                39 |               - |      |
| d                  | ✅ OK           |               270 |               - |      |
| dart               | ✅ OK           |                71 |               - |      |
| dax                | ✅ OK           |                23 |               - |      |
| desktop            | ✅ OK           |                16 |               - |      |
| diff               | ✅ OK           |                16 |               - |      |
| docker             | ✅ OK           |                 7 |               - |      |
| dotenv             | ✅ OK           |                 9 |               - |      |
| dream-maker        | ✅ OK           |                55 |               - |      |
| edge               | ✅ OK           |                10 |               - |      |
| elm                | ✅ OK           |                67 |               - |      |
| emacs-lisp         | ✅ OK           |               151 |               - |      |
| erb                | ✅ OK           |                 6 |               - |      |
| fennel             | ✅ OK           |                31 |               - |      |
| fish               | ✅ OK           |                22 |               - |      |
| fluent             | ✅ OK           |                23 |               - |      |
| fortran-fixed-form | ✅ OK           |                 6 |               - |      |
| fortran-free-form  | ✅ OK           |               317 |               - |      |
| fsharp             | ✅ OK           |               120 |               - |      |
| fsl                | ✅ OK           |                30 |               - |      |
| gdresource         | ✅ OK           |                32 |               - |      |
| gdscript           | ✅ OK           |                93 |               - |      |
| gdshader           | ✅ OK           |                38 |               - |      |
| genie              | ✅ OK           |                20 |               - |      |
| gherkin            | ✅ OK           |                16 |               - |      |
| gleam              | ✅ OK           |                26 |               - |      |
| glimmer-js         | ✅ OK           |                74 |               - |      |
| glimmer-ts         | ✅ OK           |                74 |               - |      |
| gnuplot            | ✅ OK           |                82 |               - |      |
| go                 | ✅ OK           |               115 |               - |      |
| graphql            | ✅ OK           |                63 |               - |      |
| groovy             | ✅ OK           |               133 |               - |      |
| hack               | ✅ OK           |               301 |               - |      |
| handlebars         | ✅ OK           |                64 |               - |      |
| haxe               | ✅ OK           |               175 |               - |      |
| hcl                | ✅ OK           |                61 |               - |      |
| hjson              | ✅ OK           |                55 |               - |      |
| hlsl               | ✅ OK           |                52 |               - |      |
| html               | ✅ OK           |               116 |               - |      |
| http               | ✅ OK           |                20 |               - |      |
| hxml               | ✅ OK           |                 6 |               - |      |
| hy                 | ✅ OK           |                 9 |               - |      |
| imba               | ✅ OK           |               241 |               - |      |
| ini                | ✅ OK           |                11 |               - |      |
| java               | ✅ OK           |               141 |               - |      |
| javascript         | ✅ OK           |               376 |               - |      |
| jinja              | ✅ OK           |                35 |               - |      |
| jison              | ✅ OK           |                57 |               - |      |
| json               | ✅ OK           |                19 |               - |      |
| json5              | ✅ OK           |                23 |               - |      |
| jsonc              | ✅ OK           |                19 |               - |      |
| jsonl              | ✅ OK           |                19 |               - |      |
| jsonnet            | ✅ OK           |                33 |               - |      |
| jssm               | ✅ OK           |                30 |               - |      |
| jsx                | ✅ OK           |               376 |               - |      |
| lean               | ✅ OK           |                32 |               - |      |
| less               | ✅ OK           |               280 |               - |      |
| liquid             | ✅ OK           |                69 |               - |      |
| log                | ✅ OK           |                30 |               - |      |
| logo               | ✅ OK           |                 9 |               - |      |
| lua                | ✅ OK           |               113 |               - |      |
| luau               | ✅ OK           |                88 |               - |      |
| make               | ✅ OK           |                48 |               - |      |
| marko              | ✅ OK           |                81 |               - |      |
| matlab             | ✅ OK           |                77 |               - |      |
| mojo               | ✅ OK           |               213 |               - |      |
| move               | ✅ OK           |               120 |               - |      |
| narrat             | ✅ OK           |                34 |               - |      |
| nextflow           | ✅ OK           |                17 |               - |      |
| nim                | ✅ OK           |               114 |               - |      |
| nix                | ✅ OK           |                80 |               - |      |
| nushell            | ✅ OK           |                75 |               - |      |
| objective-c        | ✅ OK           |               217 |               - |      |
| ocaml              | ✅ OK           |               178 |               - |      |
| pascal             | ✅ OK           |                23 |               - |      |
| perl               | ✅ OK           |               155 |               - |      |
| plsql              | ✅ OK           |                43 |               - |      |
| postcss            | ✅ OK           |                47 |               - |      |
| powerquery         | ✅ OK           |                30 |               - |      |
| prisma             | ✅ OK           |                26 |               - |      |
| prolog             | ✅ OK           |                26 |               - |      |
| proto              | ✅ OK           |                33 |               - |      |
| puppet             | ✅ OK           |                59 |               - |      |
| python             | ✅ OK           |               218 |               - |      |
| qml                | ✅ OK           |                38 |               - |      |
| qmldir             | ✅ OK           |                 7 |               - |      |
| qss                | ✅ OK           |                31 |               - |      |
| r                  | ✅ OK           |                73 |               - |      |
| racket             | ✅ OK           |                68 |               - |      |
| raku               | ✅ OK           |                52 |               - |      |
| reg                | ✅ OK           |                 9 |               - |      |
| regexp             | ✅ OK           |                34 |               - |      |
| rel                | ✅ OK           |                17 |               - |      |
| riscv              | ✅ OK           |                36 |               - |      |
| rust               | ✅ OK           |                89 |               - |      |
| sas                | ✅ OK           |                32 |               - |      |
| sass               | ✅ OK           |                67 |               - |      |
| scala              | ✅ OK           |               108 |               - |      |
| scheme             | ✅ OK           |                34 |               - |      |
| scss               | ✅ OK           |               104 |               - |      |
| shaderlab          | ✅ OK           |                38 |               - |      |
| shellsession       | ✅ OK           |                 2 |               - |      |
| solidity           | ✅ OK           |               102 |               - |      |
| soy                | ✅ OK           |                45 |               - |      |
| sparql             | ✅ OK           |                 4 |               - |      |
| sql                | ✅ OK           |                67 |               - |      |
| ssh-config         | ✅ OK           |                12 |               - |      |
| stylus             | ✅ OK           |               107 |               - |      |
| svelte             | ✅ OK           |                83 |               - |      |
| system-verilog     | ✅ OK           |               102 |               - |      |
| systemd            | ✅ OK           |                32 |               - |      |
| tasl               | ✅ OK           |                22 |               - |      |
| tcl                | ✅ OK           |                33 |               - |      |
| templ              | ✅ OK           |                74 |               - |      |
| terraform          | ✅ OK           |                62 |               - |      |
| tex                | ✅ OK           |                38 |               - |      |
| toml               | ✅ OK           |                40 |               - |      |
| ts-tags            | ✅ OK           |                 - |               - |      |
| tsv                | ✅ OK           |                 1 |               - |      |
| tsx                | ✅ OK           |               376 |               - |      |
| turtle             | ✅ OK           |                15 |               - |      |
| twig               | ✅ OK           |                94 |               - |      |
| typescript         | ✅ OK           |               363 |               - |      |
| typespec           | ✅ OK           |                80 |               - |      |
| typst              | ✅ OK           |                78 |               - |      |
| v                  | ✅ OK           |                76 |               - |      |
| vala               | ✅ OK           |                20 |               - |      |
| vb                 | ✅ OK           |                34 |               - |      |
| verilog            | ✅ OK           |                33 |               - |      |
| vhdl               | ✅ OK           |                82 |               - |      |
| viml               | ✅ OK           |                72 |               - |      |
| vue                | ✅ OK           |                69 |               - |      |
| vue-html           | ✅ OK           |                36 |               - |      |
| vyper              | ✅ OK           |               238 |               - |      |
| wasm               | ✅ OK           |                78 |               - |      |
| wenyan             | ✅ OK           |                18 |               - |      |
| wgsl               | ✅ OK           |                44 |               - |      |
| wikitext           | ✅ OK           |               104 |               - |      |
| xml                | ✅ OK           |                30 |               - |      |
| xsl                | ✅ OK           |                 5 |               - |      |
| yaml               | ✅ OK           |                46 |               - |      |
| zenscript          | ✅ OK           |                21 |               - |      |
| zig                | ✅ OK           |                51 |               - |      |

## Mismatched Languages

Languages that does not throw with the JavaScript RegExp engine, but will produce different result than the WASM engine. Please use with caution.

| Language      | Highlight Match                                                                    | Patterns Parsable | Patterns Failed | Diff |
| ------------- | :--------------------------------------------------------------------------------- | ----------------: | --------------: | ---: |
| angular-html  | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=angular-html)  |                 2 |               - |    6 |
| bash          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=bash)          |               146 |               - |   13 |
| beancount     | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=beancount)     |                39 |               - |    4 |
| c             | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=c)             |               158 |               - |   35 |
| crystal       | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=crystal)       |               140 |               - |    2 |
| elixir        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=elixir)        |               102 |               - |   43 |
| erlang        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=erlang)        |               147 |               - |   50 |
| glsl          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=glsl)          |                 7 |               - |   74 |
| haml          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=haml)          |                64 |               - |    6 |
| kusto         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=kusto)         |                60 |               - |    1 |
| latex         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=latex)         |               183 |               - |    5 |
| mermaid       | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=mermaid)       |               129 |               - |    2 |
| nginx         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=nginx)         |               102 |               - |    3 |
| objective-cpp | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=objective-cpp) |               297 |               - |   22 |
| php           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=php)           |               328 |               - |   37 |
| po            | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=po)            |                23 |               - |   11 |
| pug           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=pug)           |                92 |               - |    6 |
| rst           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=rst)           |                61 |               - |    4 |
| ruby          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=ruby)          |               154 |               - |    1 |
| shellscript   | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=shellscript)   |               146 |               - |   13 |
| smalltalk     | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=smalltalk)     |                31 |               - |    8 |
| splunk        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=splunk)        |                17 |               - |    4 |
| stata         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=stata)         |               189 |               - |    4 |
| zsh           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=zsh)           |               146 |               - |   26 |

## Unsupported Languages

Languages that throws with the JavaScript RegExp engine (contains syntaxes that we can't polyfill yet). If you need to use these languages, please use the Oniguruma engine.

| Language   | Highlight Match                                                            | Patterns Parsable | Patterns Failed | Diff |
| ---------- | :------------------------------------------------------------------------- | ----------------: | --------------: | ---: |
| ada        | ✅ OK                                                                      |               199 |               1 |      |
| blade      | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=blade) |               328 |               2 |      |
| mdc        | ❌ Error                                                                   |                27 |               - |   22 |
| powershell | ❌ Error                                                                   |                87 |               1 |      |
| wolfram    | ❌ Error                                                                   |               500 |               1 |    2 |
| razor      | ❌ Error                                                                   |                82 |               3 |    7 |
| mdx        | ❌ Error                                                                   |               177 |               4 |      |
| swift      | ❌ Error                                                                   |               302 |               4 |    4 |
| julia      | ❌ Error                                                                   |                90 |               5 |    5 |
| kotlin     | ❌ Error                                                                   |                52 |               6 |   81 |
| purescript | ❌ Error                                                                   |                66 |               6 |  169 |
| markdown   | ❌ Error                                                                   |                96 |               7 |   41 |
| apex       | ❌ Error                                                                   |               173 |              14 |   44 |
| haskell    | ❌ Error                                                                   |               136 |              21 |    3 |
| cpp        | ❌ Error                                                                   |               198 |              22 |    5 |
| csharp     | ❌ Error                                                                   |               263 |              32 |   34 |
