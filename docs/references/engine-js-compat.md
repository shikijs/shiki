# JavaScript RegExp Engine Compatibility References

Compatibility reference of all built-in grammars with the [JavaScript RegExp engine](/guide/regex-engines#javascript-regexp-engine-experimental).

> Genreated on Sunday, September 29, 2024
>
> Version `1.20.0`
>
> Runtime: Node.js v20.12.2

## Report Summary

|                 |                        Count |
| :-------------- | ---------------------------: |
| Total Languages |                          213 |
| Supported       |  [175](#supported-languages) |
| Mismatched      |  [23](#mismatched-languages) |
| Unsupported     | [15](#unsupported-languages) |

## Supported Languages

Languages that works with the JavaScript RegExp engine, and will produce the same result as the WASM engine (with the [sample snippets in the registry](https://github.com/shikijs/textmate-grammars-themes/tree/main/samples)).
In some edge cases, it's not guaranteed that the the highlight will be 100% the same. If that happens, please create an issue with the sample snippet.

| Language           | Highlight Match | Patterns Parsable | Patterns Failed | Diff |
| ------------------ | :-------------- | ----------------: | --------------: | ---: |
| abap               | ✅ OK           |                51 |               - |      |
| actionscript-3     | ✅ OK           |                57 |               - |      |
| angular-ts         | ✅ OK           |               779 |               - |      |
| apache             | ✅ OK           |                60 |               - |      |
| apl                | ✅ OK           |               917 |               - |      |
| applescript        | ✅ OK           |               152 |               - |      |
| ara                | ✅ OK           |                54 |               - |      |
| asciidoc           | ✅ OK           |               262 |               - |      |
| asm                | ✅ OK           |               297 |               - |      |
| astro              | ✅ OK           |               613 |               - |      |
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
| cobol              | ✅ OK           |               864 |               - |      |
| codeowners         | ✅ OK           |                 4 |               - |      |
| codeql             | ✅ OK           |               151 |               - |      |
| coffee             | ✅ OK           |               469 |               - |      |
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
| edge               | ✅ OK           |               632 |               - |      |
| elm                | ✅ OK           |               244 |               - |      |
| emacs-lisp         | ✅ OK           |               153 |               - |      |
| erb                | ✅ OK           |              1312 |               - |      |
| fennel             | ✅ OK           |                31 |               - |      |
| fish               | ✅ OK           |                25 |               - |      |
| fluent             | ✅ OK           |                23 |               - |      |
| fortran-fixed-form | ✅ OK           |               332 |               - |      |
| fortran-free-form  | ✅ OK           |               328 |               - |      |
| fsharp             | ✅ OK           |               239 |               - |      |
| fsl                | ✅ OK           |                30 |               - |      |
| gdresource         | ✅ OK           |               157 |               - |      |
| gdscript           | ✅ OK           |                93 |               - |      |
| gdshader           | ✅ OK           |                39 |               - |      |
| genie              | ✅ OK           |                20 |               - |      |
| gherkin            | ✅ OK           |                19 |               - |      |
| gleam              | ✅ OK           |                26 |               - |      |
| glimmer-js         | ✅ OK           |               676 |               - |      |
| glimmer-ts         | ✅ OK           |               676 |               - |      |
| gnuplot            | ✅ OK           |                82 |               - |      |
| go                 | ✅ OK           |               123 |               - |      |
| graphql            | ✅ OK           |               448 |               - |      |
| groovy             | ✅ OK           |               133 |               - |      |
| hack               | ✅ OK           |               948 |               - |      |
| haml               | ✅ OK           |               562 |               - |      |
| handlebars         | ✅ OK           |               699 |               - |      |
| haxe               | ✅ OK           |               174 |               - |      |
| hcl                | ✅ OK           |                67 |               - |      |
| hjson              | ✅ OK           |                57 |               - |      |
| hlsl               | ✅ OK           |                52 |               - |      |
| html               | ✅ OK           |               611 |               - |      |
| http               | ✅ OK           |               753 |               - |      |
| hxml               | ✅ OK           |               182 |               - |      |
| hy                 | ✅ OK           |                 9 |               - |      |
| imba               | ✅ OK           |               516 |               - |      |
| ini                | ✅ OK           |                11 |               - |      |
| java               | ✅ OK           |               142 |               - |      |
| javascript         | ✅ OK           |               376 |               - |      |
| jinja              | ✅ OK           |               642 |               - |      |
| jison              | ✅ OK           |               421 |               - |      |
| json               | ✅ OK           |                19 |               - |      |
| json5              | ✅ OK           |                23 |               - |      |
| jsonc              | ✅ OK           |                19 |               - |      |
| jsonl              | ✅ OK           |                19 |               - |      |
| jsonnet            | ✅ OK           |                33 |               - |      |
| jssm               | ✅ OK           |                30 |               - |      |
| jsx                | ✅ OK           |               376 |               - |      |
| lean               | ✅ OK           |                32 |               - |      |
| less               | ✅ OK           |               280 |               - |      |
| liquid             | ✅ OK           |               684 |               - |      |
| log                | ✅ OK           |                30 |               - |      |
| logo               | ✅ OK           |                 9 |               - |      |
| lua                | ✅ OK           |               278 |               - |      |
| luau               | ✅ OK           |                88 |               - |      |
| make               | ✅ OK           |                51 |               - |      |
| marko              | ✅ OK           |               926 |               - |      |
| matlab             | ✅ OK           |                88 |               - |      |
| mdc                | ✅ OK           |               784 |               - |      |
| mojo               | ✅ OK           |               213 |               - |      |
| move               | ✅ OK           |               120 |               - |      |
| narrat             | ✅ OK           |                34 |               - |      |
| nextflow           | ✅ OK           |                17 |               - |      |
| nim                | ✅ OK           |              1126 |               - |      |
| nix                | ✅ OK           |                80 |               - |      |
| nushell            | ✅ OK           |                81 |               - |      |
| objective-c        | ✅ OK           |               223 |               - |      |
| ocaml              | ✅ OK           |               178 |               - |      |
| pascal             | ✅ OK           |                23 |               - |      |
| perl               | ✅ OK           |               941 |               - |      |
| plsql              | ✅ OK           |                45 |               - |      |
| postcss            | ✅ OK           |                49 |               - |      |
| powerquery         | ✅ OK           |                30 |               - |      |
| prisma             | ✅ OK           |                26 |               - |      |
| prolog             | ✅ OK           |                26 |               - |      |
| proto              | ✅ OK           |                33 |               - |      |
| puppet             | ✅ OK           |                61 |               - |      |
| python             | ✅ OK           |               218 |               - |      |
| qml                | ✅ OK           |               408 |               - |      |
| qmldir             | ✅ OK           |                 7 |               - |      |
| qss                | ✅ OK           |                31 |               - |      |
| r                  | ✅ OK           |                71 |               - |      |
| racket             | ✅ OK           |                69 |               - |      |
| raku               | ✅ OK           |                52 |               - |      |
| reg                | ✅ OK           |                 9 |               - |      |
| regexp             | ✅ OK           |                34 |               - |      |
| rel                | ✅ OK           |                17 |               - |      |
| riscv              | ✅ OK           |                36 |               - |      |
| rust               | ✅ OK           |                89 |               - |      |
| sas                | ✅ OK           |               101 |               - |      |
| sass               | ✅ OK           |                69 |               - |      |
| scala              | ✅ OK           |               112 |               - |      |
| scheme             | ✅ OK           |                34 |               - |      |
| scss               | ✅ OK           |               234 |               - |      |
| shaderlab          | ✅ OK           |                87 |               - |      |
| shellsession       | ✅ OK           |               150 |               - |      |
| solidity           | ✅ OK           |               102 |               - |      |
| soy                | ✅ OK           |               649 |               - |      |
| sparql             | ✅ OK           |                19 |               - |      |
| sql                | ✅ OK           |                67 |               - |      |
| ssh-config         | ✅ OK           |                12 |               - |      |
| stylus             | ✅ OK           |               107 |               - |      |
| svelte             | ✅ OK           |               636 |               - |      |
| system-verilog     | ✅ OK           |               102 |               - |      |
| systemd            | ✅ OK           |                32 |               - |      |
| tasl               | ✅ OK           |                23 |               - |      |
| tcl                | ✅ OK           |                34 |               - |      |
| templ              | ✅ OK           |               673 |               - |      |
| terraform          | ✅ OK           |                68 |               - |      |
| tex                | ✅ OK           |               106 |               - |      |
| toml               | ✅ OK           |                44 |               - |      |
| ts-tags            | ✅ OK           |               997 |               - |      |
| tsv                | ✅ OK           |                 1 |               - |      |
| tsx                | ✅ OK           |               376 |               - |      |
| turtle             | ✅ OK           |                15 |               - |      |
| twig               | ✅ OK           |              1984 |               - |      |
| typescript         | ✅ OK           |               363 |               - |      |
| typespec           | ✅ OK           |                80 |               - |      |
| typst              | ✅ OK           |                78 |               - |      |
| v                  | ✅ OK           |                80 |               - |      |
| vala               | ✅ OK           |                20 |               - |      |
| vb                 | ✅ OK           |                34 |               - |      |
| verilog            | ✅ OK           |                33 |               - |      |
| vhdl               | ✅ OK           |                82 |               - |      |
| viml               | ✅ OK           |                72 |               - |      |
| vue                | ✅ OK           |               692 |               - |      |
| vue-html           | ✅ OK           |               716 |               - |      |
| vyper              | ✅ OK           |               238 |               - |      |
| wasm               | ✅ OK           |                78 |               - |      |
| wenyan             | ✅ OK           |                18 |               - |      |
| wgsl               | ✅ OK           |                44 |               - |      |
| wikitext           | ✅ OK           |               104 |               - |      |
| xml                | ✅ OK           |               169 |               - |      |
| xsl                | ✅ OK           |               171 |               - |      |
| yaml               | ✅ OK           |                48 |               - |      |
| zenscript          | ✅ OK           |                21 |               - |      |
| zig                | ✅ OK           |                51 |               - |      |

###### Table Field Explanations

- **Highlight Match**: Highlight results match with the WASM engine with the [sample snippets](https://github.com/shikijs/textmate-grammars-themes/tree/main/samples).
- **Patterns Parsable**: Number of regex patterns that can be parsed by the JavaScript RegExp engine.
- **Patterns Failed**: Number of regex patterns that can't be parsed by the JavaScript RegExp engine (throws error).
- **Diff**: Length of characters that are different between the highlight result of two engines.

## Mismatched Languages

Languages that does not throw with the JavaScript RegExp engine, but will produce different result than the WASM engine. Please use with caution.

| Language      | Highlight Match                                                                    | Patterns Parsable | Patterns Failed | Diff |
| ------------- | :--------------------------------------------------------------------------------- | ----------------: | --------------: | ---: |
| angular-html  | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=angular-html)  |               670 |               - |  330 |
| bash          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=bash)          |               148 |               - |   56 |
| beancount     | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=beancount)     |                39 |               - |  171 |
| c             | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=c)             |               177 |               - |  209 |
| crystal       | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=crystal)       |              1067 |               - |   40 |
| elixir        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=elixir)        |               708 |               - |  179 |
| erlang        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=erlang)        |               147 |               - |  470 |
| glsl          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=glsl)          |               186 |               - |  306 |
| kusto         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=kusto)         |                60 |               - |   40 |
| latex         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=latex)         |               283 |               - |   25 |
| markdown      | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=markdown)      |               118 |               - |   78 |
| mermaid       | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=mermaid)       |               129 |               - |   38 |
| nginx         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=nginx)         |               378 |               - |    4 |
| objective-cpp | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=objective-cpp) |               309 |               - |  172 |
| php           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=php)           |              1131 |               - |  605 |
| po            | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=po)            |                23 |               - |  336 |
| pug           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=pug)           |               686 |               - |  164 |
| ruby          | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=ruby)          |              1307 |               - |    1 |
| shellscript   | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=shellscript)   |               148 |               - |   56 |
| smalltalk     | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=smalltalk)     |                35 |               - |   40 |
| splunk        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=splunk)        |                17 |               - |    8 |
| stata         | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=stata)         |               253 |               - |   32 |
| zsh           | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=zsh)           |               148 |               - |  117 |

## Unsupported Languages

Languages that throws with the JavaScript RegExp engine (contains syntaxes that we can't polyfill yet). If you need to use these languages, please use the Oniguruma engine.

| Language   | Highlight Match                                                            | Patterns Parsable | Patterns Failed | Diff |
| ---------- | :------------------------------------------------------------------------- | ----------------: | --------------: | ---: |
| ada        | ✅ OK                                                                      |               201 |               1 |      |
| blade      | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=blade) |              1124 |               2 |      |
| rst        | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=rst)   |              1835 |              22 |   62 |
| powershell | ❌ Error                                                                   |                87 |               1 |      |
| wolfram    | ❌ Error                                                                   |               500 |               1 |   12 |
| mdx        | ❌ Error                                                                   |               193 |               4 |      |
| swift      | ❌ Error                                                                   |               325 |               4 |   18 |
| kotlin     | ❌ Error                                                                   |                52 |               6 | 2986 |
| purescript | ❌ Error                                                                   |                67 |               6 | 1488 |
| apex       | ❌ Error                                                                   |               173 |              14 |  242 |
| haskell    | ❌ Error                                                                   |               136 |              21 |   12 |
| cpp        | ❌ Error                                                                   |               490 |              22 |   25 |
| julia      | ❌ Error                                                                   |              1141 |              27 |   49 |
| csharp     | ❌ Error                                                                   |               276 |              33 |  232 |
| razor      | ❌ Error                                                                   |               922 |              35 |   26 |
