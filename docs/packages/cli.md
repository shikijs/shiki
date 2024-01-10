# shikiji-cli

<Badges name="shikiji-cli" />

Shikiji in the command line.

## Usage

The Shikiji CLI works like `cat` command, but with syntax highlighting.

```bash
npx shikiji-cli README.md
```

## Install

You can also install it globally. Command aliases `shikiji-cli`, `shikiji`, `skat` are registered.

```bash
npm i -g shikiji-cli

skat src/index.ts
```

## Options

### `--theme`

Specify the theme to use. Defaults to `vitesse-dark`.

```bash
npx shikiji-cli README.md --theme=nord
```

### `--lang`

Language is auto-inferred from the file extension. You can override it with `--lang`.

```bash
npx shikiji-cli src/index.js --lang=ts
```
