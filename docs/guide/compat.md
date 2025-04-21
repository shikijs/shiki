---
outline: deep
---

# Compatibility Build

::: warning
This is a compatibility build for v0.x users. And this package is no longer maintained since v3. Please migrate to the latest version.
:::

To make deep migration easier, we provide a compatibility build that shimmed the breaking changes from v0.x. You can use it as a drop-in replacement for `shiki` and migrate step by step.

## Installations

<Badges name="@shikijs/compat" />

Set the alias to `shiki` in your `package.json`:

<!-- eslint-skip -->

```json
{
  "dependencies": {
    "shiki": "0.14.3", // [!code --]
    "shiki": "npm:@shikijs/compat@1.0" // [!code ++]
  }
}
```

Check the [breaking changes list](/guide/migrate#migrate-from-v0-14) to see if you need to migrate anything manually.
