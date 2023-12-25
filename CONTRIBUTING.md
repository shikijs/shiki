Please refer to https://github.com/antfu/contribute

---

## Additional Notes

This repository contains a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to `vscode-textmate`. By default `git clone` does not clone submodules. To clone this repository and its submodules, use:

```bash
git clone --recursive https://github.com/antfu/shikiji
```

Or if you have already cloned it, use:

```bash
git submodule update --init --recursive
```

Learn more at this [StackOverflow thread](https://stackoverflow.com/a/4438292).
