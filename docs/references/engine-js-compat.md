# JavaScript RegExp Engine Compatibility References

> Genreated on Thursday, September 5, 2024
>
> Version `1.16.2`
>
> Runtime: Node.js v20.12.2

## Report Summary

|                 |                            Count |
| :-------------- | -------------------------------: |
| Total Languages |                              213 |
| Fully Supported | [37](#fully-supported-languages) |
| Mismatched      |       [2](#mismatched-languages) |
| Unsupported     |    [174](#unsupported-languages) |

## Fully Supported Languages

Languages that works with the JavaScript RegExp engine, and will produce the same result as the WASM engine.

| Language   | Highlight Match | Patterns Parsable | Patterns Failed |
| ---------- | :-------------- | ----------------: | --------------: |
| apache     | ✅ OK           |                60 |               - |
| bat        | ✅ OK           |                58 |               - |
| bibtex     | ✅ OK           |                19 |               - |
| codeowners | ✅ OK           |                 4 |               - |
| coq        | ✅ OK           |                25 |               - |
| csv        | ✅ OK           |                 1 |               - |
| cue        | ✅ OK           |                85 |               - |
| diff       | ✅ OK           |                16 |               - |
| docker     | ✅ OK           |                 7 |               - |
| dotenv     | ✅ OK           |                 9 |               - |
| genie      | ✅ OK           |                20 |               - |
| gherkin    | ✅ OK           |                16 |               - |
| gleam      | ✅ OK           |                26 |               - |
| hlsl       | ✅ OK           |                52 |               - |
| json       | ✅ OK           |                19 |               - |
| json5      | ✅ OK           |                23 |               - |
| jsonc      | ✅ OK           |                19 |               - |
| jsonl      | ✅ OK           |                19 |               - |
| jsonnet    | ✅ OK           |                33 |               - |
| lean       | ✅ OK           |                32 |               - |
| ocaml      | ✅ OK           |               178 |               - |
| plsql      | ✅ OK           |                43 |               - |
| prolog     | ✅ OK           |                26 |               - |
| qmldir     | ✅ OK           |                 7 |               - |
| qss        | ✅ OK           |                31 |               - |
| reg        | ✅ OK           |                 9 |               - |
| sas        | ✅ OK           |                32 |               - |
| shaderlab  | ✅ OK           |                38 |               - |
| sparql     | ✅ OK           |                 4 |               - |
| tsv        | ✅ OK           |                 1 |               - |
| turtle     | ✅ OK           |                15 |               - |
| vala       | ✅ OK           |                20 |               - |
| wasm       | ✅ OK           |                78 |               - |
| wenyan     | ✅ OK           |                18 |               - |
| wgsl       | ✅ OK           |                44 |               - |
| xsl        | ✅ OK           |                 5 |               - |
| zenscript  | ✅ OK           |                21 |               - |

## Mismatched Languages

Languages that does not throw with the JavaScript RegExp engine, but will produce different result than the WASM engine. Please use with caution.

| Language  | Highlight Match                                                                | Patterns Parsable | Patterns Failed |
| --------- | :----------------------------------------------------------------------------- | ----------------: | --------------: |
| kusto     | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=kusto)     |                60 |               - |
| smalltalk | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=smalltalk) |                31 |               - |

## Unsupported Languages

Languages that throws with the JavaScript RegExp engine (contains syntaxes that we can't polyfill yet). If you need to use these languages, please use the Oniguruma engine.

| Language           | Highlight Match | Patterns Parsable | Patterns Failed |
| ------------------ | :-------------- | ----------------: | --------------: |
| cmake              | ✅ OK           |                22 |               1 |
| fish               | ✅ OK           |                21 |               1 |
| xml                | ✅ OK           |                29 |               1 |
| abap               | ✅ OK           |                47 |               2 |
| regexp             | ✅ OK           |                32 |               2 |
| angular-html       | ❌ Error        |                 2 |               - |
| applescript        | ❌ Error        |               151 |               - |
| cadence            | ❌ Error        |                71 |               - |
| erb                | ❌ Error        |                 6 |               - |
| fortran-fixed-form | ❌ Error        |                 6 |               - |
| glsl               | ❌ Error        |                 7 |               - |
| hxml               | ❌ Error        |                 6 |               - |
| ini                | ❌ Error        |                11 |               - |
| jison              | ❌ Error        |                57 |               - |
| logo               | ❌ Error        |                 9 |               - |
| po                 | ❌ Error        |                23 |               - |
| qml                | ❌ Error        |                38 |               - |
| shellsession       | ❌ Error        |                 2 |               - |
| sql                | ❌ Error        |                67 |               - |
| ssh-config         | ❌ Error        |                12 |               - |
| systemd            | ❌ Error        |                32 |               - |
| ts-tags            | ❌ Error        |                 - |               - |
| verilog            | ❌ Error        |                33 |               - |
| ara                | ❌ Error        |                53 |               1 |
| awk                | ❌ Error        |                35 |               1 |
| clarity            | ❌ Error        |                42 |               1 |
| codeql             | ❌ Error        |               149 |               1 |
| desktop            | ❌ Error        |                15 |               1 |
| fennel             | ❌ Error        |                30 |               1 |
| gdshader           | ❌ Error        |                37 |               1 |
| hjson              | ❌ Error        |                54 |               1 |
| html               | ❌ Error        |               115 |               1 |
| pascal             | ❌ Error        |                22 |               1 |
| powerquery         | ❌ Error        |                29 |               1 |
| proto              | ❌ Error        |                32 |               1 |
| rel                | ❌ Error        |                16 |               1 |
| riscv              | ❌ Error        |                35 |               1 |
| tex                | ❌ Error        |                37 |               1 |
| typespec           | ❌ Error        |                79 |               1 |
| vb                 | ❌ Error        |                33 |               1 |
| viml               | ❌ Error        |                71 |               1 |
| vue-html           | ❌ Error        |                35 |               1 |
| zig                | ❌ Error        |                50 |               1 |
| actionscript-3     | ❌ Error        |                55 |               2 |
| apl                | ❌ Error        |               177 |               2 |
| cobol              | ❌ Error        |               136 |               2 |
| dart               | ❌ Error        |                69 |               2 |
| dax                | ❌ Error        |                21 |               2 |
| elm                | ❌ Error        |                65 |               2 |
| gdresource         | ❌ Error        |                30 |               2 |
| gnuplot            | ❌ Error        |                80 |               2 |
| handlebars         | ❌ Error        |                62 |               2 |
| hy                 | ❌ Error        |                 7 |               2 |
| luau               | ❌ Error        |                86 |               2 |
| narrat             | ❌ Error        |                32 |               2 |
| rust               | ❌ Error        |                87 |               2 |
| scheme             | ❌ Error        |                32 |               2 |
| tasl               | ❌ Error        |                20 |               2 |
| tcl                | ❌ Error        |                31 |               2 |
| toml               | ❌ Error        |                38 |               2 |
| vhdl               | ❌ Error        |                80 |               2 |
| vue                | ❌ Error        |                67 |               2 |
| wikitext           | ❌ Error        |               102 |               2 |
| wolfram            | ❌ Error        |               499 |               2 |
| berry              | ❌ Error        |                15 |               3 |
| clj                | ❌ Error        |                35 |               3 |
| clojure            | ❌ Error        |                35 |               3 |
| elixir             | ❌ Error        |                99 |               3 |
| erlang             | ❌ Error        |               144 |               3 |
| fortran-free-form  | ❌ Error        |               314 |               3 |
| fsharp             | ❌ Error        |               117 |               3 |
| haxe               | ❌ Error        |               172 |               3 |
| nginx              | ❌ Error        |                99 |               3 |
| nushell            | ❌ Error        |                72 |               3 |
| powershell         | ❌ Error        |                85 |               3 |
| prisma             | ❌ Error        |                23 |               3 |
| scala              | ❌ Error        |               105 |               3 |
| splunk             | ❌ Error        |                14 |               3 |
| ada                | ❌ Error        |               196 |               4 |
| asm                | ❌ Error        |               293 |               4 |
| cypher             | ❌ Error        |                35 |               4 |
| dream-maker        | ❌ Error        |                51 |               4 |
| emacs-lisp         | ❌ Error        |               147 |               4 |
| fluent             | ❌ Error        |                19 |               4 |
| fsl                | ❌ Error        |                26 |               4 |
| jssm               | ❌ Error        |                26 |               4 |
| move               | ❌ Error        |               113 |               4 |
| nextflow           | ❌ Error        |                13 |               4 |
| nim                | ❌ Error        |               110 |               4 |
| system-verilog     | ❌ Error        |                98 |               4 |
| asciidoc           | ❌ Error        |               257 |               5 |
| log                | ❌ Error        |                25 |               5 |
| matlab             | ❌ Error        |                72 |               5 |
| mdc                | ❌ Error        |                22 |               5 |
| pug                | ❌ Error        |                87 |               5 |
| rst                | ❌ Error        |                56 |               5 |
| solidity           | ❌ Error        |                97 |               5 |
| stylus             | ❌ Error        |               102 |               5 |
| bicep              | ❌ Error        |                22 |               6 |
| d                  | ❌ Error        |               264 |               6 |
| http               | ❌ Error        |                14 |               6 |
| raku               | ❌ Error        |                46 |               6 |
| typst              | ❌ Error        |                72 |               6 |
| beancount          | ❌ Error        |                32 |               7 |
| c                  | ❌ Error        |               151 |               7 |
| edge               | ❌ Error        |                 3 |               7 |
| gdscript           | ❌ Error        |                86 |               7 |
| hcl                | ❌ Error        |                54 |               7 |
| kotlin             | ❌ Error        |                51 |               7 |
| lua                | ❌ Error        |               106 |               7 |
| r                  | ❌ Error        |                66 |               7 |
| ruby               | ❌ Error        |               147 |               7 |
| hack               | ❌ Error        |               293 |               8 |
| julia              | ❌ Error        |                87 |               8 |
| latex              | ❌ Error        |               175 |               8 |
| mdx                | ❌ Error        |               173 |               8 |
| objective-c        | ❌ Error        |               209 |               8 |
| terraform          | ❌ Error        |                54 |               8 |
| graphql            | ❌ Error        |                54 |               9 |
| swift              | ❌ Error        |               297 |               9 |
| yaml               | ❌ Error        |                37 |               9 |
| coffee             | ❌ Error        |               110 |              10 |
| haml               | ❌ Error        |                54 |              10 |
| jinja              | ❌ Error        |                25 |              10 |
| make               | ❌ Error        |                38 |              10 |
| sass               | ❌ Error        |                57 |              10 |
| css                | ❌ Error        |               130 |              11 |
| markdown           | ❌ Error        |                92 |              11 |
| marko              | ❌ Error        |                70 |              11 |
| objective-cpp      | ❌ Error        |               286 |              11 |
| puppet             | ❌ Error        |                48 |              11 |
| razor              | ❌ Error        |                74 |              11 |
| v                  | ❌ Error        |                65 |              11 |
| groovy             | ❌ Error        |               120 |              13 |
| postcss            | ❌ Error        |                34 |              13 |
| purescript         | ❌ Error        |                59 |              13 |
| twig               | ❌ Error        |                81 |              13 |
| astro              | ❌ Error        |                45 |              14 |
| crystal            | ❌ Error        |               126 |              14 |
| glimmer-js         | ❌ Error        |                60 |              14 |
| glimmer-ts         | ❌ Error        |                60 |              14 |
| java               | ❌ Error        |               126 |              15 |
| perl               | ❌ Error        |               140 |              15 |
| scss               | ❌ Error        |                87 |              17 |
| svelte             | ❌ Error        |                66 |              17 |
| bash               | ❌ Error        |               128 |              18 |
| less               | ❌ Error        |               262 |              18 |
| shellscript        | ❌ Error        |               128 |              18 |
| zsh                | ❌ Error        |               128 |              18 |
| nix                | ❌ Error        |                61 |              19 |
| soy                | ❌ Error        |                20 |              25 |
| templ              | ❌ Error        |                48 |              26 |
| stata              | ❌ Error        |               162 |              27 |
| php                | ❌ Error        |               300 |              28 |
| racket             | ❌ Error        |                40 |              28 |
| apex               | ❌ Error        |               157 |              30 |
| go                 | ❌ Error        |                85 |              30 |
| common-lisp        | ❌ Error        |                26 |              31 |
| blade              | ❌ Error        |               298 |              32 |
| mermaid            | ❌ Error        |                95 |              34 |
| liquid             | ❌ Error        |                33 |              36 |
| mojo               | ❌ Error        |               177 |              36 |
| python             | ❌ Error        |               177 |              41 |
| vyper              | ❌ Error        |               197 |              41 |
| ballerina          | ❌ Error        |               184 |              46 |
| haskell            | ❌ Error        |               105 |              52 |
| csharp             | ❌ Error        |               238 |              57 |
| imba               | ❌ Error        |               184 |              57 |
| angular-ts         | ❌ Error        |               300 |              63 |
| javascript         | ❌ Error        |               313 |              63 |
| jsx                | ❌ Error        |               313 |              63 |
| tsx                | ❌ Error        |               313 |              63 |
| typescript         | ❌ Error        |               300 |              63 |
| cpp                | ❌ Error        |               124 |              96 |
