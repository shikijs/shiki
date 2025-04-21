# JavaScript RegExp Engine Compatibility References

Compatibility reference of all built-in grammars with the [JavaScript RegExp engine](/guide/regex-engines#javascript-regexp-engine).

> Generated on Tuesday, March 11, 2025
>
> Version `3.1.0`
>
> Runtime: Node.js v22.13.1

## Report Summary

|                 |                       Count |
| :-------------- | --------------------------: |
| Total Languages |                         221 |
| Supported       | [220](#supported-languages) |
| Mismatched      |  [0](#mismatched-languages) |
| Unsupported     | [1](#unsupported-languages) |

## Supported Languages

Languages that work with the JavaScript RegExp engine, and will produce the same result as the WASM engine (with the [sample snippets in the registry](https://github.com/shikijs/textmate-grammars-themes/tree/main/samples)).
In some edge cases, it's not guaranteed that the highlighting will be 100% the same. If that happens, please create an issue with the sample snippet.

| Language           | Highlight Match | Patterns Parsable | Patterns Failed | Diff |
| ------------------ | :-------------- | ----------------: | --------------: | ---: |
| abap               | ✅ OK           |                52 |               - |      |
| actionscript-3     | ✅ OK           |                57 |               - |      |
| ada                | ✅ OK           |               201 |               - |      |
| angular-html       | ✅ OK           |               665 |               - |      |
| angular-ts         | ✅ OK           |               772 |               - |      |
| apache             | ✅ OK           |                60 |               - |      |
| apex               | ✅ OK           |               186 |               - |      |
| apl                | ✅ OK           |               912 |               - |      |
| applescript        | ✅ OK           |               152 |               - |      |
| ara                | ✅ OK           |                54 |               - |      |
| asciidoc           | ✅ OK           |               262 |               - |      |
| asm                | ✅ OK           |               297 |               - |      |
| astro              | ✅ OK           |               610 |               - |      |
| awk                | ✅ OK           |                36 |               - |      |
| ballerina          | ✅ OK           |               223 |               - |      |
| bash               | ✅ OK           |               148 |               - |      |
| bat                | ✅ OK           |                58 |               - |      |
| beancount          | ✅ OK           |                39 |               - |      |
| berry              | ✅ OK           |                18 |               - |      |
| bibtex             | ✅ OK           |                19 |               - |      |
| bicep              | ✅ OK           |                27 |               - |      |
| blade              | ✅ OK           |              1121 |               - |      |
| bsl                | ✅ OK           |                96 |               - |      |
| c                  | ✅ OK           |               176 |               - |      |
| cadence            | ✅ OK           |                71 |               - |      |
| cairo              | ✅ OK           |               236 |               - |      |
| clarity            | ✅ OK           |                43 |               - |      |
| clj                | ✅ OK           |                38 |               - |      |
| clojure            | ✅ OK           |                38 |               - |      |
| cmake              | ✅ OK           |                23 |               - |      |
| cobol              | ✅ OK           |               858 |               - |      |
| codeowners         | ✅ OK           |                 4 |               - |      |
| codeql             | ✅ OK           |               148 |               - |      |
| coffee             | ✅ OK           |               467 |               - |      |
| common-lisp        | ✅ OK           |                60 |               - |      |
| coq                | ✅ OK           |                26 |               - |      |
| cpp                | ✅ OK           |               505 |               - |      |
| crystal            | ✅ OK           |              1056 |               - |      |
| csharp             | ✅ OK           |               302 |               - |      |
| css                | ✅ OK           |               141 |               - |      |
| csv                | ✅ OK           |                 1 |               - |      |
| cue                | ✅ OK           |                85 |               - |      |
| cypher             | ✅ OK           |                39 |               - |      |
| d                  | ✅ OK           |               272 |               - |      |
| dart               | ✅ OK           |                75 |               - |      |
| dax                | ✅ OK           |                23 |               - |      |
| desktop            | ✅ OK           |                16 |               - |      |
| diff               | ✅ OK           |                16 |               - |      |
| docker             | ✅ OK           |                 7 |               - |      |
| dotenv             | ✅ OK           |                 9 |               - |      |
| dream-maker        | ✅ OK           |                56 |               - |      |
| edge               | ✅ OK           |               629 |               - |      |
| elixir             | ✅ OK           |               704 |               - |      |
| elm                | ✅ OK           |               241 |               - |      |
| emacs-lisp         | ✅ OK           |               153 |               - |   22 |
| erb                | ✅ OK           |              1767 |               - |      |
| erlang             | ✅ OK           |               144 |               - |      |
| fennel             | ✅ OK           |                31 |               - |      |
| fish               | ✅ OK           |                25 |               - |      |
| fluent             | ✅ OK           |                23 |               - |      |
| fortran-fixed-form | ✅ OK           |               331 |               - |      |
| fortran-free-form  | ✅ OK           |               327 |               - |      |
| fsharp             | ✅ OK           |               238 |               - |      |
| fsl                | ✅ OK           |                30 |               - |      |
| gdresource         | ✅ OK           |               158 |               - |      |
| gdscript           | ✅ OK           |                95 |               - |      |
| gdshader           | ✅ OK           |                39 |               - |      |
| genie              | ✅ OK           |                20 |               - |      |
| gherkin            | ✅ OK           |                19 |               - |      |
| gleam              | ✅ OK           |                26 |               - |      |
| glimmer-js         | ✅ OK           |               673 |               - |      |
| glimmer-ts         | ✅ OK           |               673 |               - |      |
| glsl               | ✅ OK           |               185 |               - |      |
| gnuplot            | ✅ OK           |                82 |               - |      |
| go                 | ✅ OK           |               123 |               - |      |
| graphql            | ✅ OK           |               445 |               - |      |
| groovy             | ✅ OK           |               130 |               - |      |
| hack               | ✅ OK           |               943 |               - |      |
| haml               | ✅ OK           |               559 |               - |      |
| handlebars         | ✅ OK           |               696 |               - |      |
| haskell            | ✅ OK           |               163 |               - |      |
| haxe               | ✅ OK           |               173 |               - |      |
| hcl                | ✅ OK           |                67 |               - |      |
| hjson              | ✅ OK           |                57 |               - |      |
| hlsl               | ✅ OK           |                52 |               - |      |
| html               | ✅ OK           |               608 |               - |      |
| http               | ✅ OK           |               747 |               - |      |
| hxml               | ✅ OK           |               181 |               - |      |
| hy                 | ✅ OK           |                12 |               - |      |
| imba               | ✅ OK           |               239 |               - |      |
| ini                | ✅ OK           |                11 |               - |      |
| java               | ✅ OK           |               141 |               - |      |
| javascript         | ✅ OK           |               375 |               - |      |
| jinja              | ✅ OK           |               639 |               - |      |
| jison              | ✅ OK           |               431 |               - |      |
| json               | ✅ OK           |                19 |               - |      |
| json5              | ✅ OK           |                23 |               - |      |
| jsonc              | ✅ OK           |                19 |               - |      |
| jsonl              | ✅ OK           |                19 |               - |      |
| jsonnet            | ✅ OK           |                33 |               - |      |
| jssm               | ✅ OK           |                30 |               - |      |
| jsx                | ✅ OK           |               375 |               - |      |
| julia              | ✅ OK           |              1159 |               - |      |
| kotlin             | ✅ OK           |                58 |               - |      |
| kusto              | ✅ OK           |                60 |               - |      |
| latex              | ✅ OK           |               286 |               - |      |
| lean               | ✅ OK           |                32 |               - |      |
| less               | ✅ OK           |               279 |               - |      |
| liquid             | ✅ OK           |               689 |               - |      |
| llvm               | ✅ OK           |                25 |               - |      |
| log                | ✅ OK           |                31 |               - |      |
| logo               | ✅ OK           |                 9 |               - |      |
| lua                | ✅ OK           |               277 |               - |      |
| luau               | ✅ OK           |                88 |               - |      |
| make               | ✅ OK           |                51 |               - |      |
| markdown           | ✅ OK           |               118 |               - |      |
| marko              | ✅ OK           |               915 |               - |      |
| matlab             | ✅ OK           |                88 |               - |      |
| mdc                | ✅ OK           |               780 |               - |      |
| mdx                | ✅ OK           |               197 |               - |      |
| mermaid            | ✅ OK           |               134 |               - |      |
| mipsasm            | ✅ OK           |                17 |               - |      |
| mojo               | ✅ OK           |               213 |               - |      |
| move               | ✅ OK           |               118 |               - |      |
| narrat             | ✅ OK           |                34 |               - |      |
| nextflow           | ✅ OK           |                32 |               - |      |
| nginx              | ✅ OK           |               376 |               - |      |
| nim                | ✅ OK           |              1118 |               - |      |
| nix                | ✅ OK           |                80 |               - |      |
| nushell            | ✅ OK           |                81 |               - |      |
| objective-c        | ✅ OK           |               222 |               - |      |
| objective-cpp      | ✅ OK           |               307 |               - |      |
| ocaml              | ✅ OK           |               178 |               - |      |
| pascal             | ✅ OK           |                23 |               - |      |
| perl               | ✅ OK           |               936 |               - |      |
| php                | ✅ OK           |              1125 |               - |      |
| plsql              | ✅ OK           |                45 |               - |      |
| po                 | ✅ OK           |                23 |               - |      |
| polar              | ✅ OK           |                31 |               - |      |
| postcss            | ✅ OK           |                49 |               - |      |
| powerquery         | ✅ OK           |                30 |               - |      |
| powershell         | ✅ OK           |                88 |               - |      |
| prisma             | ✅ OK           |                28 |               - |      |
| prolog             | ✅ OK           |                26 |               - |      |
| proto              | ✅ OK           |                33 |               - |      |
| pug                | ✅ OK           |               683 |               - |      |
| puppet             | ✅ OK           |                60 |               - |      |
| purescript         | ✅ OK           |                84 |               - |      |
| python             | ✅ OK           |               218 |               - |      |
| qml                | ✅ OK           |               407 |               - |      |
| qmldir             | ✅ OK           |                 7 |               - |      |
| qss                | ✅ OK           |                31 |               - |      |
| r                  | ✅ OK           |                71 |               - |      |
| racket             | ✅ OK           |                69 |               - |      |
| raku               | ✅ OK           |                52 |               - |      |
| razor              | ✅ OK           |               943 |               - |      |
| reg                | ✅ OK           |                 9 |               - |      |
| regexp             | ✅ OK           |                34 |               - |      |
| rel                | ✅ OK           |                17 |               - |      |
| riscv              | ✅ OK           |                36 |               - |      |
| rst                | ✅ OK           |              2008 |               - |      |
| ruby               | ✅ OK           |              1759 |               - |      |
| rust               | ✅ OK           |                89 |               - |      |
| sas                | ✅ OK           |                99 |               - |      |
| sass               | ✅ OK           |                69 |               - |      |
| scala              | ✅ OK           |               116 |               - |      |
| scheme             | ✅ OK           |                34 |               - |      |
| scss               | ✅ OK           |               233 |               - |      |
| sdbl               | ✅ OK           |                23 |               - |      |
| shaderlab          | ✅ OK           |                87 |               - |      |
| shellscript        | ✅ OK           |               148 |               - |      |
| shellsession       | ✅ OK           |               150 |               - |      |
| smalltalk          | ✅ OK           |                35 |               - |      |
| solidity           | ✅ OK           |               102 |               - |      |
| soy                | ✅ OK           |               646 |               - |      |
| sparql             | ✅ OK           |                19 |               - |      |
| splunk             | ✅ OK           |                17 |               - |      |
| sql                | ✅ OK           |                67 |               - |      |
| ssh-config         | ✅ OK           |                12 |               - |      |
| stata              | ✅ OK           |               253 |               - |      |
| stylus             | ✅ OK           |               106 |               - |      |
| svelte             | ✅ OK           |               636 |               - |      |
| system-verilog     | ✅ OK           |               102 |               - |      |
| systemd            | ✅ OK           |                32 |               - |      |
| talonscript        | ✅ OK           |                45 |               - |      |
| tasl               | ✅ OK           |                23 |               - |      |
| tcl                | ✅ OK           |                34 |               - |      |
| templ              | ✅ OK           |               671 |               - |      |
| terraform          | ✅ OK           |                68 |               - |      |
| tex                | ✅ OK           |               106 |               - |      |
| toml               | ✅ OK           |                44 |               - |      |
| ts-tags            | ✅ OK           |               990 |               - |      |
| tsv                | ✅ OK           |                 1 |               - |      |
| tsx                | ✅ OK           |               375 |               - |      |
| turtle             | ✅ OK           |                15 |               - |      |
| twig               | ✅ OK           |              2397 |               - |      |
| typescript         | ✅ OK           |               362 |               - |      |
| typespec           | ✅ OK           |                73 |               - |      |
| typst              | ✅ OK           |                78 |               - |      |
| v                  | ✅ OK           |                78 |               - |      |
| vala               | ✅ OK           |                20 |               - |      |
| vb                 | ✅ OK           |                34 |               - |      |
| verilog            | ✅ OK           |                33 |               - |      |
| vhdl               | ✅ OK           |                81 |               - |      |
| viml               | ✅ OK           |                72 |               - |      |
| vue                | ✅ OK           |               690 |               - |      |
| vue-html           | ✅ OK           |               714 |               - |      |
| vyper              | ✅ OK           |               238 |               - |      |
| wasm               | ✅ OK           |                78 |               - |      |
| wenyan             | ✅ OK           |                18 |               - |      |
| wgsl               | ✅ OK           |                44 |               - |      |
| wikitext           | ✅ OK           |               104 |               - |      |
| wit                | ✅ OK           |                81 |               - |      |
| wolfram            | ✅ OK           |               501 |               - |      |
| xml                | ✅ OK           |               168 |               - |      |
| xsl                | ✅ OK           |               170 |               - |      |
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

Languages that do not throw with the JavaScript RegExp engine, but will produce different results than the WASM engine.

| Language | Highlight Match | Patterns Parsable | Patterns Failed | Diff |
| -------- | :-------------- | ----------------: | --------------: | ---: |

## Unsupported Languages

Languages that throw with the JavaScript RegExp engine, either because they contain syntax we can't polyfill yet or because the grammar contains an invalid Oniguruma regex (that would also fail when using the WASM engine, but silently). You can try these languages with the `forgiving` option to skip errors.

| Language | Highlight Match | Patterns Parsable | Patterns Failed | Diff |
| -------- | :-------------- | ----------------: | --------------: | ---: |
| swift    | ❌ Error        |               330 |               1 |      |
