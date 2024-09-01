# JavaScript RegExp Engine Compatibility References

> Genreated on Sunday, September 1, 2024
>
> Version `1.15.2`
>
> Runtime: Node.js v20.12.2

## Report Summary

|                 |                             Count |
| :-------------- | --------------------------------: |
| Total Languages |                               213 |
| Fully Supported | [178](#fully-supported-languages) |
| Mismatched      |       [30](#mismatched-languages) |
| Unsupported     |       [5](#unsupported-languages) |

## Fully Supported Languages

Languages that works with the JavaScript RegExp engine, and will produce the same result as the WASM engine.

| Language           | Highlight Match | Patterns Parsable | Patterns Failed |
| ------------------ | :-------------- | ----------------: | --------------: |
| abap               | ✅ OK           |                49 |               - |
| actionscript-3     | ✅ OK           |                57 |               - |
| angular-ts         | ✅ OK           |               366 |               - |
| apache             | ✅ OK           |                60 |               - |
| apl                | ✅ OK           |               179 |               - |
| applescript        | ✅ OK           |               151 |               - |
| ara                | ✅ OK           |                54 |               - |
| asm                | ✅ OK           |               297 |               - |
| astro              | ✅ OK           |                59 |               - |
| awk                | ✅ OK           |                36 |               - |
| ballerina          | ✅ OK           |               231 |               - |
| bash               | ✅ OK           |               146 |               - |
| bat                | ✅ OK           |                58 |               - |
| berry              | ✅ OK           |                18 |               - |
| bibtex             | ✅ OK           |                19 |               - |
| bicep              | ✅ OK           |                28 |               - |
| c                  | ✅ OK           |               158 |               - |
| clarity            | ✅ OK           |                43 |               - |
| clj                | ✅ OK           |                38 |               - |
| clojure            | ✅ OK           |                38 |               - |
| cmake              | ✅ OK           |                23 |               - |
| cobol              | ✅ OK           |               138 |               - |
| codeowners         | ✅ OK           |                 4 |               - |
| codeql             | ✅ OK           |               150 |               - |
| coffee             | ✅ OK           |               120 |               - |
| common-lisp        | ✅ OK           |                57 |               - |
| cpp                | ✅ OK           |               220 |               - |
| crystal            | ✅ OK           |               140 |               - |
| css                | ✅ OK           |               141 |               - |
| csv                | ✅ OK           |                 1 |               - |
| d                  | ✅ OK           |               270 |               - |
| dart               | ✅ OK           |                71 |               - |
| dax                | ✅ OK           |                23 |               - |
| desktop            | ✅ OK           |                16 |               - |
| diff               | ✅ OK           |                16 |               - |
| docker             | ✅ OK           |                 7 |               - |
| dotenv             | ✅ OK           |                 9 |               - |
| dream-maker        | ✅ OK           |                55 |               - |
| edge               | ✅ OK           |                10 |               - |
| elixir             | ✅ OK           |               102 |               - |
| elm                | ✅ OK           |                68 |               - |
| emacs-lisp         | ✅ OK           |               151 |               - |
| erb                | ✅ OK           |                 6 |               - |
| erlang             | ✅ OK           |               147 |               - |
| fennel             | ✅ OK           |                31 |               - |
| fish               | ✅ OK           |                22 |               - |
| fluent             | ✅ OK           |                23 |               - |
| fortran-fixed-form | ✅ OK           |                 6 |               - |
| fortran-free-form  | ✅ OK           |               317 |               - |
| fsharp             | ✅ OK           |               120 |               - |
| fsl                | ✅ OK           |                30 |               - |
| gdresource         | ✅ OK           |                32 |               - |
| gdscript           | ✅ OK           |                93 |               - |
| gdshader           | ✅ OK           |                38 |               - |
| genie              | ✅ OK           |                20 |               - |
| gherkin            | ✅ OK           |                16 |               - |
| gleam              | ✅ OK           |                26 |               - |
| glimmer-js         | ✅ OK           |                74 |               - |
| glimmer-ts         | ✅ OK           |                74 |               - |
| glsl               | ✅ OK           |                 7 |               - |
| gnuplot            | ✅ OK           |                82 |               - |
| go                 | ✅ OK           |               115 |               - |
| graphql            | ✅ OK           |                63 |               - |
| groovy             | ✅ OK           |               134 |               - |
| hack               | ✅ OK           |               301 |               - |
| handlebars         | ✅ OK           |                64 |               - |
| haxe               | ✅ OK           |               175 |               - |
| hcl                | ✅ OK           |                61 |               - |
| hjson              | ✅ OK           |                55 |               - |
| hlsl               | ✅ OK           |                52 |               - |
| html               | ✅ OK           |               116 |               - |
| http               | ✅ OK           |                20 |               - |
| hxml               | ✅ OK           |                 6 |               - |
| hy                 | ✅ OK           |                 9 |               - |
| imba               | ✅ OK           |               242 |               - |
| ini                | ✅ OK           |                11 |               - |
| java               | ✅ OK           |               141 |               - |
| javascript         | ✅ OK           |               378 |               - |
| jinja              | ✅ OK           |                35 |               - |
| jison              | ✅ OK           |                57 |               - |
| json               | ✅ OK           |                19 |               - |
| json5              | ✅ OK           |                23 |               - |
| jsonc              | ✅ OK           |                19 |               - |
| jsonl              | ✅ OK           |                19 |               - |
| jsonnet            | ✅ OK           |                33 |               - |
| jssm               | ✅ OK           |                30 |               - |
| jsx                | ✅ OK           |               378 |               - |
| kotlin             | ✅ OK           |                58 |               - |
| lean               | ✅ OK           |                32 |               - |
| less               | ✅ OK           |               280 |               - |
| liquid             | ✅ OK           |                69 |               - |
| log                | ✅ OK           |                30 |               - |
| logo               | ✅ OK           |                 9 |               - |
| lua                | ✅ OK           |               113 |               - |
| luau               | ✅ OK           |                88 |               - |
| make               | ✅ OK           |                48 |               - |
| marko              | ✅ OK           |                81 |               - |
| matlab             | ✅ OK           |                77 |               - |
| mojo               | ✅ OK           |               213 |               - |
| move               | ✅ OK           |               117 |               - |
| narrat             | ✅ OK           |                34 |               - |
| nextflow           | ✅ OK           |                17 |               - |
| nim                | ✅ OK           |               114 |               - |
| nix                | ✅ OK           |                80 |               - |
| nushell            | ✅ OK           |                75 |               - |
| objective-c        | ✅ OK           |               217 |               - |
| objective-cpp      | ✅ OK           |               297 |               - |
| ocaml              | ✅ OK           |               178 |               - |
| pascal             | ✅ OK           |                23 |               - |
| perl               | ✅ OK           |               156 |               - |
| plsql              | ✅ OK           |                43 |               - |
| postcss            | ✅ OK           |                47 |               - |
| prisma             | ✅ OK           |                26 |               - |
| prolog             | ✅ OK           |                26 |               - |
| proto              | ✅ OK           |                33 |               - |
| puppet             | ✅ OK           |                59 |               - |
| python             | ✅ OK           |               218 |               - |
| qml                | ✅ OK           |                38 |               - |
| qmldir             | ✅ OK           |                 7 |               - |
| qss                | ✅ OK           |                31 |               - |
| r                  | ✅ OK           |                73 |               - |
| racket             | ✅ OK           |                68 |               - |
| raku               | ✅ OK           |                52 |               - |
| reg                | ✅ OK           |                 9 |               - |
| regexp             | ✅ OK           |                34 |               - |
| rel                | ✅ OK           |                17 |               - |
| riscv              | ✅ OK           |                36 |               - |
| ruby               | ✅ OK           |               154 |               - |
| rust               | ✅ OK           |                89 |               - |
| sas                | ✅ OK           |                32 |               - |
| sass               | ✅ OK           |                67 |               - |
| scala              | ✅ OK           |               108 |               - |
| scheme             | ✅ OK           |                34 |               - |
| scss               | ✅ OK           |               104 |               - |
| shaderlab          | ✅ OK           |                38 |               - |
| shellscript        | ✅ OK           |               146 |               - |
| shellsession       | ✅ OK           |                 2 |               - |
| smalltalk          | ✅ OK           |                31 |               - |
| solidity           | ✅ OK           |               102 |               - |
| soy                | ✅ OK           |                45 |               - |
| sparql             | ✅ OK           |                 4 |               - |
| sql                | ✅ OK           |                67 |               - |
| ssh-config         | ✅ OK           |                12 |               - |
| stylus             | ✅ OK           |               107 |               - |
| svelte             | ✅ OK           |                83 |               - |
| system-verilog     | ✅ OK           |               102 |               - |
| tasl               | ✅ OK           |                22 |               - |
| tcl                | ✅ OK           |                33 |               - |
| templ              | ✅ OK           |                74 |               - |
| terraform          | ✅ OK           |                62 |               - |
| toml               | ✅ OK           |                40 |               - |
| ts-tags            | ✅ OK           |                 - |               - |
| tsv                | ✅ OK           |                 1 |               - |
| tsx                | ✅ OK           |               378 |               - |
| turtle             | ✅ OK           |                15 |               - |
| twig               | ✅ OK           |                94 |               - |
| typescript         | ✅ OK           |               366 |               - |
| typespec           | ✅ OK           |                80 |               - |
| typst              | ✅ OK           |                78 |               - |
| v                  | ✅ OK           |                76 |               - |
| vala               | ✅ OK           |                20 |               - |
| vb                 | ✅ OK           |                34 |               - |
| verilog            | ✅ OK           |                33 |               - |
| vhdl               | ✅ OK           |                82 |               - |
| viml               | ✅ OK           |                72 |               - |
| vue                | ✅ OK           |                69 |               - |
| vue-html           | ✅ OK           |                36 |               - |
| vyper              | ✅ OK           |               238 |               - |
| wasm               | ✅ OK           |                78 |               - |
| wenyan             | ✅ OK           |                18 |               - |
| wgsl               | ✅ OK           |                44 |               - |
| wikitext           | ✅ OK           |               104 |               - |
| wolfram            | ✅ OK           |               501 |               - |
| xml                | ✅ OK           |                30 |               - |
| xsl                | ✅ OK           |                 5 |               - |
| zenscript          | ✅ OK           |                21 |               - |
| zig                | ✅ OK           |                51 |               - |
| zsh                | ✅ OK           |               146 |               - |

## Mismatched Languages

Languages that does not throw with the JavaScript RegExp engine, but will produce different result than the WASM engine. Please use with caution.

| Language     | Highlight Match | Patterns Parsable | Patterns Failed |
| ------------ | :-------------- | ----------------: | --------------: |
| angular-html | ⚠️ Mismatch     |                 2 |               - |
| apex         | ⚠️ Mismatch     |               189 |               - |
| asciidoc     | ⚠️ Mismatch     |               262 |               - |
| beancount    | ⚠️ Mismatch     |                39 |               - |
| blade        | ⚠️ Mismatch     |               330 |               - |
| cadence      | ⚠️ Mismatch     |                71 |               - |
| coq          | ⚠️ Mismatch     |                25 |               - |
| cue          | ⚠️ Mismatch     |                85 |               - |
| cypher       | ⚠️ Mismatch     |                39 |               - |
| haml         | ⚠️ Mismatch     |                64 |               - |
| haskell      | ⚠️ Mismatch     |               157 |               - |
| kusto        | ⚠️ Mismatch     |                60 |               - |
| latex        | ⚠️ Mismatch     |               183 |               - |
| markdown     | ⚠️ Mismatch     |               103 |               - |
| mdc          | ⚠️ Mismatch     |                27 |               - |
| mdx          | ⚠️ Mismatch     |               180 |               - |
| mermaid      | ⚠️ Mismatch     |               129 |               - |
| nginx        | ⚠️ Mismatch     |               102 |               - |
| php          | ⚠️ Mismatch     |               328 |               - |
| po           | ⚠️ Mismatch     |                23 |               - |
| powerquery   | ⚠️ Mismatch     |                30 |               - |
| powershell   | ⚠️ Mismatch     |                88 |               - |
| pug          | ⚠️ Mismatch     |                92 |               - |
| purescript   | ⚠️ Mismatch     |                72 |               - |
| rst          | ⚠️ Mismatch     |                61 |               - |
| splunk       | ⚠️ Mismatch     |                17 |               - |
| stata        | ⚠️ Mismatch     |               189 |               - |
| systemd      | ⚠️ Mismatch     |                32 |               - |
| tex          | ⚠️ Mismatch     |                38 |               - |
| yaml         | ⚠️ Mismatch     |                46 |               - |

## Unsupported Languages

Languages that throws with the JavaScript RegExp engine (contains syntaxes that we can't polyfill yet). If you need to use these languages, please use the Oniguruma engine.

| Language | Highlight Match | Patterns Parsable | Patterns Failed |
| -------- | :-------------- | ----------------: | --------------: |
| ada      | ✅ OK           |               199 |               1 |
| csharp   | ⚠️ Mismatch     |               298 |               1 |
| razor    | ⚠️ Mismatch     |                83 |               2 |
| swift    | ❌ Error        |               302 |               4 |
| julia    | ❌ Error        |                77 |              18 |
