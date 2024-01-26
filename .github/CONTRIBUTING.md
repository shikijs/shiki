# Contributing Guide

Thanks for lending a hand 👋

## Development

### Clone

This repository contains a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to `vscode-textmate`. By default `git clone` does not clone submodules. To clone this repository and its submodules, use:

```bash
git clone --recursive https://github.com/shikijs/shiki
```

Or if you have already cloned it, use:

```bash
git submodule update --init --recursive
```

Learn more at this [StackOverflow thread](https://stackoverflow.com/a/4438292).

### Setup

- We use [pnpm](https://pnpm.js.org/) to manage dependencies. Install it with `npm i -g pnpm`.
- Install dependencies with `pnpm i`.
- Build all packages with `pnpm build`.

### Testting

- We use [Vitest](https://vitest.dev) to test the codebase. Run `pnpm test` to start the test runner.
- We have quite some [Snapshot Tests](https://vitest.dev/guide/snapshot.html) to ensure the output is consistent. If you are making changes to the output, run `pnpm test -u` to update the snapshots.

### Coding conventions

- We use ESLint to lint and format the codebase. Before you commit, all files will be formatted automatically.
- We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Please use a prefix. If your PR has multiple commits and some of them don't follow the Conventional Commits rule, we'll do a squash merge.
