# Release Workflow

- [Update changelog](../scripts/changelog/README.md)
- `npx lerna version`
- `git push` the tags
- `npx lerna publish from-git`
- [Create a release](https://github.com/shikijs/shiki/releases/new)
