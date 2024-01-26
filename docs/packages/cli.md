# shiki-cli

<Badges name="shiki-cli" />

Shiki in the command line.

## Usage

The Shiki CLI works like `cat` command, but with syntax highlighting.

```bash
npx shiki-cli README.md
```

## Install

You can also install it globally. Command aliases `shiki-cli`, `shiki`, `skat` are registered.

```bash
npm i -g shiki-cli

skat src/index.ts
```

## Options

### `--theme`

Specify the theme to use. Defaults to `vitesse-dark`.

```bash
npx shiki-cli README.md --theme=nord
```

### `--lang`

Language is auto-inferred from the file extension. You can override it with `--lang`.

```bash
npx shiki-cli src/index.js --lang=ts
```
