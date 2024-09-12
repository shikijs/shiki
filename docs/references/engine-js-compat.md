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
| Fully Supported | [172](#fully-supported-languages) |
| Mismatched      |       [24](#mismatched-languages) |
| Unsupported     |      [17](#unsupported-languages) |

## Fully Supported Languages

Languages that works with the JavaScript RegExp engine, and will produce the same result as the WASM engine.

| Language           | Highlight Match | Patterns Parsable | Patterns Failed | Diff |
| ------------------ | :-------------- | ----------------: | --------------: | ---: |
| abap               | ✅ OK           |                51 |               - |      |
| actionscript-3     | ✅ OK           |                57 |               - |      |
| angular-ts         | ✅ OK           |               363 |               - |      |
| apache             | ✅ OK           |                60 |               - |      |
| apl                | ✅ OK           |               182 |               - |      |
| applescript        | ✅ OK           |               152 |               - |      |
| ara                | ✅ OK           |                54 |               - |      |
| asciidoc           | ✅ OK           |               262 |               - |      |
| asm                | ✅ OK           |               297 |               - |      |
| astro              | ✅ OK           |                60 |               - |      |
| awk                | ✅ OK           |                36 |               - |      |
| ballerina          | ✅ OK           |               230 |               - |      |
| bat                | ✅ OK           |                58 |               - |      |
| berry              | ✅ OK           |                18 |               - |      |
| bibtex             | ✅ OK           |                19 |               - |      |
| bicep              | ✅ OK           |                27 |               - |      |
| cadence            | ✅ OK           |                71 |               - |      |
| clarity            | ✅ OK           |                43 |               - |      |
| clj                | ✅ OK           |                38 |               - |      |
| clojure            | ✅ OK           |                38 |               - |      |
| cmake              | ✅ OK           |                23 |               - |      |
| cobol              | ✅ OK           |               138 |               - |      |
| codeowners         | ✅ OK           |                 4 |               - |      |
| codeql             | ✅ OK           |               151 |               - |      |
| coffee             | ✅ OK           |               120 |               - |      |
| common-lisp        | ✅ OK           |                60 |               - |      |
| coq                | ✅ OK           |                25 |               - |      |
| css                | ✅ OK           |               141 |               - |      |
| csv                | ✅ OK           |                 1 |               - |      |
| cue                | ✅ OK           |                85 |               - |      |
| cypher             | ✅ OK           |                39 |               - |      |
| d                  | ✅ OK           |               270 |               - |      |
| dart               | ✅ OK           |                72 |               - |      |
| dax                | ✅ OK           |                23 |               - |      |
| desktop            | ✅ OK           |                16 |               - |      |
| diff               | ✅ OK           |                16 |               - |      |
| docker             | ✅ OK           |                 7 |               - |      |
| dotenv             | ✅ OK           |                 9 |               - |      |
| dream-maker        | ✅ OK           |                56 |               - |      |
| edge               | ✅ OK           |                10 |               - |      |
| elm                | ✅ OK           |                67 |               - |      |
| emacs-lisp         | ✅ OK           |               153 |               - |      |
| erb                | ✅ OK           |                 6 |               - |      |
| fennel             | ✅ OK           |                31 |               - |      |
| fish               | ✅ OK           |                25 |               - |      |
| fluent             | ✅ OK           |                23 |               - |      |
| fortran-fixed-form | ✅ OK           |                 6 |               - |      |
| fortran-free-form  | ✅ OK           |               328 |               - |      |
| fsharp             | ✅ OK           |               121 |               - |      |
| fsl                | ✅ OK           |                30 |               - |      |
| gdresource         | ✅ OK           |                32 |               - |      |
| gdscript           | ✅ OK           |                93 |               - |      |
| gdshader           | ✅ OK           |                39 |               - |      |
| genie              | ✅ OK           |                20 |               - |      |
| gherkin            | ✅ OK           |                19 |               - |      |
| gleam              | ✅ OK           |                26 |               - |      |
| glimmer-js         | ✅ OK           |                82 |               - |      |
| glimmer-ts         | ✅ OK           |                82 |               - |      |
| gnuplot            | ✅ OK           |                82 |               - |      |
| go                 | ✅ OK           |               123 |               - |      |
| graphql            | ✅ OK           |                63 |               - |      |
| groovy             | ✅ OK           |               133 |               - |      |
| hack               | ✅ OK           |               307 |               - |      |
| handlebars         | ✅ OK           |                64 |               - |      |
| haxe               | ✅ OK           |               174 |               - |      |
| hcl                | ✅ OK           |                69 |               - |      |
| hjson              | ✅ OK           |                57 |               - |      |
| hlsl               | ✅ OK           |                52 |               - |      |
| html               | ✅ OK           |               116 |               - |      |
| http               | ✅ OK           |                20 |               - |      |
| hxml               | ✅ OK           |                 8 |               - |      |
| hy                 | ✅ OK           |                 9 |               - |      |
| imba               | ✅ OK           |               241 |               - |      |
| ini                | ✅ OK           |                11 |               - |      |
| java               | ✅ OK           |               142 |               - |      |
| javascript         | ✅ OK           |               376 |               - |      |
| jinja              | ✅ OK           |                37 |               - |      |
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
| liquid             | ✅ OK           |                71 |               - |      |
| log                | ✅ OK           |                30 |               - |      |
| logo               | ✅ OK           |                 9 |               - |      |
| lua                | ✅ OK           |               113 |               - |      |
| luau               | ✅ OK           |                88 |               - |      |
| make               | ✅ OK           |                51 |               - |      |
| marko              | ✅ OK           |                86 |               - |      |
| matlab             | ✅ OK           |                88 |               - |      |
| mojo               | ✅ OK           |               213 |               - |      |
| move               | ✅ OK           |               120 |               - |      |
| narrat             | ✅ OK           |                34 |               - |      |
| nextflow           | ✅ OK           |                17 |               - |      |
| nim                | ✅ OK           |               114 |               - |      |
| nix                | ✅ OK           |                80 |               - |      |
| nushell            | ✅ OK           |                81 |               - |      |
| objective-c        | ✅ OK           |               223 |               - |      |
| ocaml              | ✅ OK           |               178 |               - |      |
| pascal             | ✅ OK           |                23 |               - |      |
| perl               | ✅ OK           |               155 |               - |      |
| plsql              | ✅ OK           |                45 |               - |      |
| postcss            | ✅ OK           |                49 |               - |      |
| powerquery         | ✅ OK           |                30 |               - |      |
| prisma             | ✅ OK           |                26 |               - |      |
| prolog             | ✅ OK           |                26 |               - |      |
| proto              | ✅ OK           |                33 |               - |      |
| puppet             | ✅ OK           |                61 |               - |      |
| python             | ✅ OK           |               218 |               - |      |
| qml                | ✅ OK           |                38 |               - |      |
| qmldir             | ✅ OK           |                 7 |               - |      |
| qss                | ✅ OK           |                31 |               - |      |
| r                  | ✅ OK           |                73 |               - |      |
| racket             | ✅ OK           |                69 |               - |      |
| raku               | ✅ OK           |                52 |               - |      |
| reg                | ✅ OK           |                 9 |               - |      |
| regexp             | ✅ OK           |                34 |               - |      |
| rel                | ✅ OK           |                17 |               - |      |
| riscv              | ✅ OK           |                36 |               - |      |
| rust               | ✅ OK           |                89 |               - |      |
| sas                | ✅ OK           |                34 |               - |      |
| scala              | ✅ OK           |               112 |               - |      |
| scheme             | ✅ OK           |                34 |               - |      |
| scss               | ✅ OK           |               106 |               - |      |
| shaderlab          | ✅ OK           |                38 |               - |      |
| shellsession       | ✅ OK           |                 2 |               - |      |
| solidity           | ✅ OK           |               102 |               - |      |
| soy                | ✅ OK           |                45 |               - |      |
| sparql             | ✅ OK           |                 4 |               - |      |
| sql                | ✅ OK           |                67 |               - |      |
| ssh-config         | ✅ OK           |                12 |               - |      |
| stylus             | ✅ OK           |               107 |               - |      |
| svelte             | ✅ OK           |                95 |               - |      |
| system-verilog     | ✅ OK           |               102 |               - |      |
| systemd            | ✅ OK           |                32 |               - |      |
| tasl               | ✅ OK           |                23 |               - |      |
| tcl                | ✅ OK           |                34 |               - |      |
| templ              | ✅ OK           |                74 |               - |      |
| terraform          | ✅ OK           |                70 |               - |      |
| tex                | ✅ OK           |                38 |               - |      |
| toml               | ✅ OK           |                44 |               - |      |
| ts-tags            | ✅ OK           |                 - |               - |      |
| tsv                | ✅ OK           |                 1 |               - |      |
| tsx                | ✅ OK           |               376 |               - |      |
| turtle             | ✅ OK           |                15 |               - |      |
| twig               | ✅ OK           |                97 |               - |      |
| typescript         | ✅ OK           |               363 |               - |      |
| typespec           | ✅ OK           |                80 |               - |      |
| typst              | ✅ OK           |                78 |               - |      |
| v                  | ✅ OK           |                80 |               - |      |
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
| yaml               | ✅ OK           |                48 |               - |      |
| zenscript          | ✅ OK           |                21 |               - |      |
| zig                | ✅ OK           |                51 |               - |      |

## Mismatched Languages

Languages that does not throw with the JavaScript RegExp engine, but will produce different result than the WASM engine. Please use with caution.

| Language      | Highlight Match                                                                    | Patterns Parsable | Patterns Failed | Diff |
| ------------- | :--------------------------------------------------------------------------------- | ----------------: | --------------: | ---: |
| angular-html  | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=angular-html)  |                 2 |               - |  330 |
| bash          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=bash)          |               148 |               - |   56 |
| beancount     | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=beancount)     |                39 |               - |  171 |
| c             | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=c)             |               178 |               - |  209 |
| crystal       | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=crystal)       |               143 |               - |   40 |
| elixir        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=elixir)        |               105 |               - |  179 |
| erlang        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=erlang)        |               147 |               - |  470 |
| glsl          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=glsl)          |                 9 |               - |  306 |
| haml          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=haml)          |                66 |               - |   48 |
| kusto         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=kusto)         |                60 |               - |   40 |
| latex         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=latex)         |               183 |               - |   25 |
| mermaid       | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=mermaid)       |               129 |               - |   38 |
| nginx         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=nginx)         |               104 |               - |    4 |
| objective-cpp | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=objective-cpp) |               309 |               - |  172 |
| php           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=php)           |               342 |               - |  605 |
| po            | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=po)            |                23 |               - |  336 |
| pug           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=pug)           |                91 |               - |  164 |
| rst           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=rst)           |                64 |               - |   62 |
| ruby          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=ruby)          |               154 |               - |    1 |
| shellscript   | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=shellscript)   |               148 |               - |   56 |
| smalltalk     | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=smalltalk)     |                35 |               - |   40 |
| splunk        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=splunk)        |                17 |               - |    8 |
| stata         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=stata)         |               194 |               - |   32 |
| zsh           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=zsh)           |               148 |               - |  117 |

## Unsupported Languages

Languages that throws with the JavaScript RegExp engine (contains syntaxes that we can't polyfill yet). If you need to use these languages, please use the Oniguruma engine.

| Language   | Highlight Match                                                            | Patterns Parsable | Patterns Failed | Diff |
| ---------- | :------------------------------------------------------------------------- | ----------------: | --------------: | ---: |
| ada        | ✅ OK                                                                      |               201 |               1 |      |
| sass       | ✅ OK                                                                      |                67 |               2 |      |
| blade      | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=blade) |               336 |               2 |      |
| mdc        | ❌ Error                                                                   |                37 |               - |  377 |
| powershell | ❌ Error                                                                   |                87 |               1 |      |
| wolfram    | ❌ Error                                                                   |               500 |               1 |   12 |
| razor      | ❌ Error                                                                   |                82 |               3 |   26 |
| mdx        | ❌ Error                                                                   |               193 |               4 |      |
| swift      | ❌ Error                                                                   |               325 |               4 |   18 |
| julia      | ❌ Error                                                                   |                90 |               5 |   49 |
| kotlin     | ❌ Error                                                                   |                52 |               6 | 2986 |
| purescript | ❌ Error                                                                   |                67 |               6 | 1488 |
| markdown   | ❌ Error                                                                   |               111 |               7 |  584 |
| apex       | ❌ Error                                                                   |               173 |              14 |  242 |
| haskell    | ❌ Error                                                                   |               136 |              21 |   12 |
| cpp        | ❌ Error                                                                   |               238 |              22 |   25 |
| csharp     | ❌ Error                                                                   |               278 |              33 |  232 |
