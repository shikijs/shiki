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
