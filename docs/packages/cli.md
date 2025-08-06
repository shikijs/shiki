# @shikijs/cli

<Badges name="@shikijs/cli" />

Shiki in the command line.

## Usage

The Shiki CLI works like `cat` command, but with syntax highlighting.

```bash
npx @shikijs/cli README.md
```

## Install

You can also install it globally. Command aliases `@shikijs/cli`, `shiki`, `skat` are registered.

::: code-group

```sh [npm]
npm i -g @shikijs/cli
```

```sh [yarn]
yarn global add @shikijs/cli
```

```sh [pnpm]
pnpm add -g @shikijs/cli
```

```sh [bun]
bun add -g @shikijs/cli
```

```sh [deno]
deno install -gREn skat npm:@shikijs/cli
```

:::

```sh
skat src/index.ts
```

## Options

### `--theme`

Specify the theme to use. Defaults to `vitesse-dark`.

```bash
npx @shikijs/cli README.md --theme=nord
```

### `--lang`

Language is auto-inferred from the file extension. You can override it with `--lang`.

```bash
npx @shikijs/cli src/index.js --lang=ts
```

## Node.js API

The `@shikijs/cli` package also provides a Node.js API.

::: code-group

```sh [npm]
npm i @shikijs/cli
```

```sh [yarn]
yarn add @shikijs/cli
```

```sh [pnpm]
pnpm add @shikijs/cli
```

```sh [bun]
bun add @shikijs/cli
```

```sh [deno]
deno add npm:@shikijs/cli
```

:::

### `codeToANSI`

The asynchronous `codeToANSI` function allows you to convert code to ANSI escape codes for terminal output.
This is useful for rendering syntax-highlighted code in the terminal.

```ts
import { codeToANSI } from '@shikijs/cli'

const highlighted = await codeToANSI(source, 'typescript', 'nord')

console.log(highlighted)
```

`codeToANSI` takes three required parameters:

1. `code: string`
2. `lang: BundledLanguage`
3. `theme: BundledTheme`
