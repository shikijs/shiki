# Contributing Guide

Thanks for lending a hand 👋

Here are a few ways to contribute:

- [Add a theme](../docs/themes.md#adding-theme)
- [Add a language grammar](../docs/languages.md#adding-grammar)
- Fix a bug

## Development

This repository contains a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to `vscode-textmate`. By default `git clone` does not clone submodules. To clone this repository and its submodules, use:

```bash
git clone --recursive https://github.com/shikijs/shiki
```

Or if you have already cloned it, use:

```bash
git submodule update --init --recursive
```

Learn more at this [StackOverflow thread](https://stackoverflow.com/a/4438292).

## Coding conventions

- We use ESLint to lint and format the codebase. Before you commit, all files will be formatted automatically.
- We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Please use a prefix. If your PR has multiple commits and some of them don't follow the Conventional Commits rule, we'll do a squash merge.
  - If adding a language, use `feat(lang)`
  - If adding a theme, use `feat(theme)`

## Fix a bug

- Reference the bug you are fixing in the PR
- Add a test if possible
