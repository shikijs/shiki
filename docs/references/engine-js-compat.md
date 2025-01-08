# JavaScript RegExp Engine Compatibility References

Compatibility reference of all built-in grammars with the [JavaScript RegExp engine](/guide/regex-engines#javascript-regexp-engine).

> Generated on Wednesday, January 8, 2025
>
> Version `1.26.1`
>
> Runtime: Node.js v22.11.0

## Report Summary

|                 |                       Count |
| :-------------- | --------------------------: |
| Total Languages |                         219 |
| Supported       | [212](#supported-languages) |
| Mismatched      |  [1](#mismatched-languages) |
| Unsupported     | [6](#unsupported-languages) |

## Supported Languages

Languages that work with the JavaScript RegExp engine, and will produce the same result as the WASM engine (with the [sample snippets in the registry](https://github.com/shikijs/textmate-grammars-themes/tree/main/samples)).
In some edge cases, it's not guaranteed that the highlighting will be 100% the same. If that happens, please create an issue with the sample snippet.

| Language           | Highlight Match | Patterns Parsable | Patterns Failed | Diff |
| ------------------ | :-------------- | ----------------: | --------------: | ---: |
| abap               | ✅ OK           |                52 |               - |      |
| actionscript-3     | ✅ OK           |                57 |               - |      |
| ada                | ✅ OK           |               201 |               - |      |
| angular-html       | ✅ OK           |               670 |               - |      |
| angular-ts         | ✅ OK           |               779 |               - |      |
| apache             | ✅ OK           |                60 |               - |      |
| apex               | ✅ OK           |               187 |               - |      |
| apl                | ✅ OK           |               917 |               - |      |
| applescript        | ✅ OK           |               152 |               - |      |
| ara                | ✅ OK           |                54 |               - |      |
| asciidoc           | ✅ OK           |               262 |               - |      |
| asm                | ✅ OK           |               297 |               - |      |
| astro              | ✅ OK           |               613 |               - |      |
| awk                | ✅ OK           |                36 |               - |      |
| ballerina          | ✅ OK           |               230 |               - |      |
| bash               | ✅ OK           |               148 |               - |      |
| bat                | ✅ OK           |                58 |               - |      |
| beancount          | ✅ OK           |                39 |               - |      |
| berry              | ✅ OK           |                18 |               - |      |
| bibtex             | ✅ OK           |                19 |               - |      |
| bicep              | ✅ OK           |                27 |               - |      |
| blade              | ✅ OK           |              1126 |               - |      |
| bsl                | ✅ OK           |                96 |               - |      |
| c                  | ✅ OK           |               177 |               - |      |
| cadence            | ✅ OK           |                71 |               - |      |
| cairo              | ✅ OK           |               236 |               - |      |
| clarity            | ✅ OK           |                43 |               - |      |
| clj                | ✅ OK           |                38 |               - |      |
| clojure            | ✅ OK           |                38 |               - |      |
| cmake              | ✅ OK           |                23 |               - |      |
| cobol              | ✅ OK           |               863 |               - |      |
| codeowners         | ✅ OK           |                 4 |               - |      |
| coffee             | ✅ OK           |               469 |               - |      |
| common-lisp        | ✅ OK           |                60 |               - |      |
| coq                | ✅ OK           |                26 |               - |      |
| cpp                | ✅ OK           |               512 |               - |      |
| crystal            | ✅ OK           |              1067 |               - |      |
| css                | ✅ OK           |               141 |               - |      |
| csv                | ✅ OK           |                 1 |               - |      |
| cue                | ✅ OK           |                85 |               - |      |
| cypher             | ✅ OK           |                39 |               - |      |
| d                  | ✅ OK           |               270 |               - |      |
| dart               | ✅ OK           |                76 |               - |      |
| dax                | ✅ OK           |                23 |               - |      |
| desktop            | ✅ OK           |                16 |               - |      |
| diff               | ✅ OK           |                16 |               - |      |
| docker             | ✅ OK           |                 7 |               - |      |
| dotenv             | ✅ OK           |                 9 |               - |      |
| dream-maker        | ✅ OK           |                56 |               - |      |
| edge               | ✅ OK           |               632 |               - |      |
| elixir             | ✅ OK           |               708 |               - |      |
| elm                | ✅ OK           |               244 |               - |      |
| emacs-lisp         | ✅ OK           |               153 |               - |   22 |
| erb                | ✅ OK           |              1786 |               - |      |
| erlang             | ✅ OK           |               147 |               - |      |
| fennel             | ✅ OK           |                31 |               - |      |
| fish               | ✅ OK           |                25 |               - |      |
| fluent             | ✅ OK           |                23 |               - |      |
| fortran-fixed-form | ✅ OK           |               332 |               - |      |
| fortran-free-form  | ✅ OK           |               328 |               - |      |
| fsharp             | ✅ OK           |               239 |               - |      |
| fsl                | ✅ OK           |                30 |               - |      |
| gdresource         | ✅ OK           |               158 |               - |      |
| gdscript           | ✅ OK           |                94 |               - |      |
| gdshader           | ✅ OK           |                39 |               - |      |
| genie              | ✅ OK           |                20 |               - |      |
| gherkin            | ✅ OK           |                19 |               - |      |
| gleam              | ✅ OK           |                26 |               - |      |
| glimmer-js         | ✅ OK           |               676 |               - |      |
| glimmer-ts         | ✅ OK           |               676 |               - |      |
| glsl               | ✅ OK           |               186 |               - |      |
| gnuplot            | ✅ OK           |                82 |               - |      |
| go                 | ✅ OK           |               125 |               - |      |
| graphql            | ✅ OK           |               448 |               - |      |
| groovy             | ✅ OK           |               133 |               - |      |
| haml               | ✅ OK           |               562 |               - |      |
| handlebars         | ✅ OK           |               699 |               - |      |
| haskell            | ✅ OK           |               157 |               - |      |
| haxe               | ✅ OK           |               174 |               - |      |
| hcl                | ✅ OK           |                67 |               - |      |
| hjson              | ✅ OK           |                57 |               - |      |
| hlsl               | ✅ OK           |                52 |               - |      |
| html               | ✅ OK           |               611 |               - |      |
| http               | ✅ OK           |               753 |               - |      |
| hxml               | ✅ OK           |               182 |               - |      |
| hy                 | ✅ OK           |                12 |               - |      |
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
| julia              | ✅ OK           |              1168 |               - |      |
| kotlin             | ✅ OK           |                58 |               - |      |
| kusto              | ✅ OK           |                60 |               - |      |
| latex              | ✅ OK           |               283 |               - |      |
| lean               | ✅ OK           |                32 |               - |      |
| less               | ✅ OK           |               280 |               - |      |
| liquid             | ✅ OK           |               689 |               - |      |
| log                | ✅ OK           |                31 |               - |      |
| logo               | ✅ OK           |                 9 |               - |      |
| lua                | ✅ OK           |               278 |               - |      |
| luau               | ✅ OK           |                88 |               - |      |
| make               | ✅ OK           |                51 |               - |      |
| markdown           | ✅ OK           |               118 |               - |      |
| marko              | ✅ OK           |               926 |               - |      |
| matlab             | ✅ OK           |                88 |               - |      |
| mdc                | ✅ OK           |               783 |               - |      |
| mdx                | ✅ OK           |               197 |               - |      |
| mermaid            | ✅ OK           |               134 |               - |      |
| mipsasm            | ✅ OK           |                17 |               - |      |
| mojo               | ✅ OK           |               213 |               - |      |
| move               | ✅ OK           |               120 |               - |      |
| narrat             | ✅ OK           |                34 |               - |      |
| nextflow           | ✅ OK           |                32 |               - |      |
| nim                | ✅ OK           |              1126 |               - |      |
| nix                | ✅ OK           |                80 |               - |      |
| nushell            | ✅ OK           |                81 |               - |      |
| objective-c        | ✅ OK           |               223 |               - |      |
| objective-cpp      | ✅ OK           |               309 |               - |      |
| ocaml              | ✅ OK           |               178 |               - |      |
| pascal             | ✅ OK           |                23 |               - |      |
| perl               | ✅ OK           |               941 |               - |      |
| php                | ✅ OK           |              1131 |               - |      |
| plsql              | ✅ OK           |                45 |               - |      |
| po                 | ✅ OK           |                23 |               - |      |
| polar              | ✅ OK           |                30 |               - |      |
| postcss            | ✅ OK           |                49 |               - |      |
| powerquery         | ✅ OK           |                30 |               - |      |
| powershell         | ✅ OK           |                88 |               - |      |
| prisma             | ✅ OK           |                28 |               - |      |
| prolog             | ✅ OK           |                26 |               - |      |
| proto              | ✅ OK           |                33 |               - |      |
| pug                | ✅ OK           |               686 |               - |      |
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
| rst                | ✅ OK           |              2031 |               - |      |
| ruby               | ✅ OK           |              1781 |               - |      |
| rust               | ✅ OK           |                89 |               - |      |
| sas                | ✅ OK           |               101 |               - |      |
| sass               | ✅ OK           |                69 |               - |      |
| scala              | ✅ OK           |               117 |               - |      |
| scheme             | ✅ OK           |                34 |               - |      |
| scss               | ✅ OK           |               234 |               - |      |
| sdbl               | ✅ OK           |                23 |               - |      |
| shaderlab          | ✅ OK           |                87 |               - |      |
| shellscript        | ✅ OK           |               148 |               - |      |
| shellsession       | ✅ OK           |               150 |               - |      |
| smalltalk          | ✅ OK           |                35 |               - |      |
| solidity           | ✅ OK           |               102 |               - |      |
| soy                | ✅ OK           |               649 |               - |      |
| sparql             | ✅ OK           |                19 |               - |      |
| splunk             | ✅ OK           |                17 |               - |      |
| sql                | ✅ OK           |                67 |               - |      |
| ssh-config         | ✅ OK           |                12 |               - |      |
| stata              | ✅ OK           |               253 |               - |      |
| stylus             | ✅ OK           |               107 |               - |      |
| svelte             | ✅ OK           |               637 |               - |      |
| system-verilog     | ✅ OK           |               102 |               - |      |
| systemd            | ✅ OK           |                32 |               - |      |
| talonscript        | ✅ OK           |                44 |               - |      |
| tasl               | ✅ OK           |                23 |               - |      |
| tcl                | ✅ OK           |                34 |               - |      |
| templ              | ✅ OK           |               675 |               - |      |
| terraform          | ✅ OK           |                68 |               - |      |
| tex                | ✅ OK           |               106 |               - |      |
| toml               | ✅ OK           |                44 |               - |      |
| ts-tags            | ✅ OK           |               997 |               - |      |
| tsv                | ✅ OK           |                 1 |               - |      |
| tsx                | ✅ OK           |               376 |               - |      |
| turtle             | ✅ OK           |                15 |               - |      |
| twig               | ✅ OK           |              2426 |               - |      |
| typescript         | ✅ OK           |               363 |               - |      |
| typespec           | ✅ OK           |                80 |               - |      |
| typst              | ✅ OK           |                78 |               - |      |
| v                  | ✅ OK           |                80 |               - |      |
| vala               | ✅ OK           |                20 |               - |      |
| vb                 | ✅ OK           |                34 |               - |      |
| verilog            | ✅ OK           |                33 |               - |      |
| vhdl               | ✅ OK           |                82 |               - |      |
| viml               | ✅ OK           |                72 |               - |      |
| vue                | ✅ OK           |               694 |               - |      |
| vue-html           | ✅ OK           |               718 |               - |      |
| vyper              | ✅ OK           |               238 |               - |      |
| wasm               | ✅ OK           |                78 |               - |      |
| wenyan             | ✅ OK           |                18 |               - |      |
| wgsl               | ✅ OK           |                44 |               - |      |
| wikitext           | ✅ OK           |               104 |               - |      |
| wolfram            | ✅ OK           |               501 |               - |      |
| xml                | ✅ OK           |               169 |               - |      |
| xsl                | ✅ OK           |               171 |               - |      |
| yaml               | ✅ OK           |                48 |               - |      |
| zenscript          | ✅ OK           |                21 |               - |      |
| zig                | ✅ OK           |                51 |               - |      |
| zsh                | ✅ OK           |               148 |               - |      |

###### Table Field Explanations

- **Highlight Match**: Whether the highlighting results matched with the WASM engine for the [sample snippet](https://github.com/shikijs/textmate-grammars-themes/tree/main/samples).
- **Patterns Parsable**: Number of regex patterns that can be parsed by the JavaScript RegExp engine.
- **Patterns Failed**: Number of regex patterns that can't be parsed by the JavaScript RegExp engine (throws error).
- **Diff**: Length of characters that are different between the highlighting results of the two engines.

## Mismatched Languages

Languages that do not throw with the JavaScript RegExp engine, but will produce different results than the WASM engine. Please use with caution.

| Language | Highlight Match                                                            | Patterns Parsable | Patterns Failed | Diff |
| -------- | :------------------------------------------------------------------------- | ----------------: | --------------: | ---: |
| nginx    | [🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=nginx) |               378 |               - |  122 |

## Unsupported Languages

Languages that throw with the JavaScript RegExp engine, either because they contain syntax we can't polyfill yet or because the grammar contains an invalid Oniguruma regex (that would also fail when using the WASM engine, but silently). You can try these languages with the `forgiving` option to skip errors.

| Language   | Highlight Match | Patterns Parsable | Patterns Failed | Diff |
| ---------- | :-------------- | ----------------: | --------------: | ---: |
| codeql     | ✅ OK           |               150 |               1 |      |
| hack       | ❌ Error        |               947 |               1 |  114 |
| purescript | ❌ Error        |                72 |               1 |      |
| csharp     | ❌ Error        |               306 |               3 |  137 |
| swift      | ❌ Error        |               326 |               3 |    8 |
| razor      | ❌ Error        |               952 |               5 |      |
