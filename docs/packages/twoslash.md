---
outline: deep
---

# @shikijs/twoslash

<Badges name="@shikijs/twoslash" />

A Shiki transformer for [Twoslash](https://github.com/twoslashes/twoslash), provide inline type hover inside code blocks.

[TwoSlash Notation Reference](https://twoslash.netlify.app/refs/notations).

## Install

::: code-group

```sh [npm]
npm install -D @shikijs/twoslash
```

```sh [yarn]
yarn add -D @shikijs/twoslash
```

```sh [pnpm]
pnpm add -D @shikijs/twoslash
```

```sh [bun]
bun add -D @shikijs/twoslash
```

```sh [deno]
deno add npm:@shikijs/twoslash
```

:::

This package is **a transformer addon** to Shiki. This means that for every integration that supports passing Shiki transformers, you can use this package.

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"b436269721bc02aa6e2b87b8db32bd8f1713dc97017fd91b867735e43ccd0ba0","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808AKAQwBsBLZuASgAIAzAK5gAxmnYQwvNKWZg4/CKQC2ZACoB3CHFZd8jCFnGS4AfkS81s+YpXqtOvQEkwsWgHkjE+dwsBlfHYAa3YrOQUlVVIAHTB2ZSwlNGlrCLtSTW1dOHxKECgIEQREEAAxZjElDAFhMW9pCF4RUhhmGl5mXgDg9hTw2yiBJWkHbPxedjAaAHNZY3kAOjy4NGZSBkQARk2qVhgwabRcrYBOKlXSaZgN6lSB+yy9PI4wXC2qEXw1ippyRAAmAC+FHQ2DeBGIZDyNHoTDYnB4TRMyRE0BgaggAAk0MpWBZGKjYBYVqRJtMKLxDPM4BYAMJojGYrhoTzUgA8ACFhFA9lAADJyaaCZhXClc1y8tT4GCqAB8fAAvLLeAAFUgQZTsOAwNkksmy2LxRLrJGwRk41jLC4bADsAAZdvtDsdNg7qGsrjdCeisRbnpM3gAWD5fWRiKEA4GgnB4QgkcjnOhe5G8fAW4kyMlWtYbV3BkB7A5HJD5i6e2N+3YBpA2kPfcN/ABsUeoYNjkIT1CTcI4XD43vNuIJaIzpIOFKp3hpvHpZqxzNZU853N5AoOwtFvHFPJgUClMpg8osao1Wp1eoOBriCSSpp92Nx2fWSG2tYLTuLWzdZeueAHvsfKtXhrOsw1+F8ThbTAYxKOMoUTWESkYLB1RwdYMD4XQDgsaJqDgXCn1zQMznfItjlLD1fxKLDpn9YDEAADlAn4IyBEFWxgiF42hbskJQwwyEwPhZxgRcTD8Mk9n3VRlwlXdpMPBYjgPCwFIAJRgaYtRkNpvAAQTAaoAB8ukzA4+XYX42AAVTiSRZJ3PdpVUCkL2mWVCJfRsAGZHTIpAAFZzkom5lNUOi3hIz563AyN2Og8E4M7GEbmQ1DBIwyw7kiMgxMWHSbBy0gzH8QIQjCQr0mQABdXgTO5GB+ADKA8gKIo8AqtIojgIZSGkaUujK3osHYHAXhgJYqBWHMXwYpjSOdF9/mCy4qNufoioQIC3ldZiGyQNjo0SjseMQkAWF7RECq6h5HByAwvBMcwso29JMju/AXDcPKeFKnpOvuGJr2NZJrsB96xlawpijKH4qhqUR5gaJoWjaGAOkGno+kqwZbBGR4cgmKZNLmKdJpAabnwBO15sLRbThW8sSjBoqIaebaXx2EBorAiNA0BaqPjRPAjVvYBYl4bGboyUY9AoWJAQEdVlF4AByAABHIegAKzgAB6NBZZyVXDRvE1xakO9B1YeWwEV/hlbVrWQhNsBYlReRkjTXFeAVDoNGYSyrYA1hGAAAw9uAID2BZWAgaZGG4MOKQtyWaIsVW0DgVXbclsKYAzohLPgbUAFooDWIIc4lqXAenZAa7z7K3qN/RuApPW9d4NlS9L1MyBgRveE73gFjHmvBYV7g8lUVYkFAJN9jgbw8CzkBAUBIA="}
import {
  transformerTwoslash,
} from '@shikijs/twoslash'
import {
  codeToHtml,
} from 'shiki'

const html = await codeToHtml(`console.log()`, {
  lang: 'ts',
  theme: 'vitesse-dark',
  transformers: [
    transformerTwoslash(), // <-- here
    // ...
  ],
})
```

The default output is unstyled. You need to add some extra CSS to make them look good.

If you want to run Twoslash on browsers or workers, reference to the [CDN Usage](#cdn-usage) section.

## Renderers

Thanks to the flexibility of [`hast`](https://github.com/syntax-tree/hast), this transformer allows customizing how each piece of information is rendered in the output HTML with ASTs.

We provide two renderers built-in, and you can also create your own:

---

### `rendererRich`

[Source code](https://github.com/shikijs/shiki/blob/main/packages/twoslash/src/renderer-rich.ts)

::: tip
This is the default renderer since v0.10.0.
:::

This renderer provides a more explicit class name is prefixed with `twoslash-` for better scoping.
In addition, it runs syntax highlighting on the hover information.

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"9bafe2d835b3a768cc39f5a28647084c02c621d41bbebd6324dead19238c244e","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808AKAQwBsBLZuASgAIAzAK5gAxmnYQwvUjDCwZpAErsR+RhCzjJcAPyJei2fLLLVAeU0SwPfQBUA7hDisu+Q3LJkAOmHYBbLAhSNGkjTyUVfEoQKAgRBEQQAEEpNhpSMGZxElCPBV40fCzeLFJidnk4XgAjGDR0kpl+dloYKF4RFzgqzL94Ch97dkLeOAwwNGZaXnx2AHN8DgWQ/iCC/BhedjBVgro0ADpouEngpABOKlZZOcKkAEYAJipTubq8GTyTSOiOMFxEAAGKiqZikZhiMgXAC+FHQ2ABBGIUJe+yYbE4PAEwjEVgK4Osq1IfVIDicXTUGi01j0vFsBLgRJJZOcrgAkh5aBZqTZeABlWYAa3Y9OYhKCJJ8/kCwXxYsZErILIp0Vi8TwADEIWgghhsaJqQUIB0ZFlNsx+UL2HLxcSyAI1mhHKy4PgthMYHNwTyjlQTmCGIhHgBmK43O6Ie6Xahgt6B6gMplK50qq7bAHAkCg8GQ8hB4Ow+E4PCEEjkVH0dEcLh8NCJxWklOudSWbS00W25lN10c2Bc1vWbj6AXsYUdhV20hSgJBEJ1+VJxvk1yquIJEBasS6/W4yRGk0wM28C0j4U2ickh2kArdt3bGherJWOC+kD+s6IADs9zDYFuUUjaNXneRJ507ZNl1dX50yQZ4syKHN0iQQFC2oBES2RctqDRRJGFKDQyEwPhx0XZVXG5Z8Dk+YxSHbW93Bo3gAB9eGEWBmn+KBV3VRIAGFBBOCA/FyGiqh1XhYBECpNkIexeEPVR3V2V0IEEVh2lqETPC4v1TkDc4AFZf3/JAAA4XljECQGo8JoP+JBQ3gsFtShINUMwYtElLFFsMrXCMRrLSFFMSkB10fQGPCEKKO0Ic6XosIFGnGUQhs4KfioNV1xSY9WHSTJsk2NL7UKYp8KIaTSCqWp6ntUoYGaVp2k6LgemYPo4AGMAhhGMYJimGZ5kWIaVkdDYlONGh6Ffd9A3uQEjJAa4/wjJ4LNIOMPkS75VDsgFHOzFy8yeaEAF0QWgRFpVnXhgCCnb8Aoc9SNvXhoQEMphIAcgAAVdUd2AAKzgAB6J1IPwL6fB8MCLwgl01GAHxeHu0h9GKiJVEYPgQZB3gAB4AFpCZ8aFuGiPpJiQUB9lkOArDwNAEGhaEgA"}
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'

transformerTwoslash({
  renderer: rendererRich() // <--
})
```

Here are a few examples with the built-in [`style-rich.css`](https://github.com/shikijs/shiki/blob/main/packages/twoslash/style-rich.css):

<!-- eslint-skip -->

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"43c9a2581bdd8d8c26b6a00be668c361b400ca9c2034e576e137e282e9ec30ed","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808BLMG0gMwEMBjGAAgBVoESiDhoOpBogCMABioAbGGADmafEgAsVcaRUwpIQVGGLmuRPJBd8E7qyRyAvhXTYLBYmRE16eABRYpBA4khgAlAJCAHRojGhKiLxipMwqImISUtIAnIrKahqIAKw6EvqGcQm4ZmAW0lQ2dlwOiABMLm44eIQk5Dp0hlwQYGK8aEJJAEowHCZgChgAPMYQAHwZulKabfmq6lplegZ4EyYiCuaH1rak9t6IAGyd1O49Xv3Ug6fuvDNzI0WKzWvAAvLxgLxSLN5oteMgAAq8Zi8ADWMAwEDYAgAukl+IicQBuXhOEQmLgIRAgACyHHRvA4CgUvCCITIcXgyLAAihMMBGE2WS0AA49oUkGLqOUTtT/rDBbULNobs1WtIOq5Xt1qb1vAM/NTmKxODwoucqJlJEhigB2cUHRAq3QVPCrC5XJ2NW73cjtaQvTA6zx9HzfamBYKhTCRKqJZJoVKqIXWp55EBKfZFUrS46VeJKD11G3etUPTVdDwARwArmRFV9DSBI+ywrGCzAkik0impI905mJSUjq7qXGahnPTmmncWuXA29dR8w03/ABbAyEKCRADKibSsQgAFUsKEAMIcOAwfzhLv75NUClUkBnkZ9NBwRnM8b4PhMrC2AARgYjBcLwM6+p+KIcAmSYqOMEC8DWp5kFwl4wNEvaOLIViDo60gNLmo7UMeKGkBeV5FhY04+nOfoAMz0QuwZ6p8vhDCMYxnBA0z8gsyyrBslpbI40hSnhRTOjKlRCFRkqlrOrSyMxHhkMEnxWtkbT0Q62aNNAFhtMUmhWGwjCZhwG5MGAsC0LECBUIwUB4GpAC0Rkma50iaLarnFCuhgXmAkBoIycBwIwKg8hMvAAOTjrFvDAWhNZXsioWMJ+MHQnMrkCqyUYchgmH5CQCguaQ6lyYgUoQXRNoqe8oYGoYLbRhE4wdkkHBgA2mmONpuklkRsrUB21W1bRrTFI1S7NY2hhEBIvAAHI1muwGkEka0bWQr6jImNYtBAnxPngACCPIQIBABWMAtD+HChdCQTwMoH6MrwYDrZtvBYoyvVoswUDRLw53fgAUhwS07lwqRYKF327aQWXQrwjyaK5gHxLwbAKBAT1pK5WAQMaX0/WQcAlaIIkyCZQ1PCOo07Zt1VyApvpIMpWpBh4rEBQEG7qNAkQs3tnGHcdpDRFgEhXgAkiw/jdqod5wRQUJzIwtAAPxJEjm23uTyPkhAlJ4Pt76fudsFpAhAPcjQ+jSz4HAqFSyDICAst3GumxwWDtuqPbwxgO+juITBBtkJhOIUF7PuWSIdxQNrgdLQodZJQYADuMDKLwbQA1AvD0Y8j2hXAOBcIwZlcuofCAehf3Yg3xu/SiAAGKsqJ30QADpgPLrf4JljJ6Ot73Ip+IXJMhWCXDAUAaz3n45/E+Cfa9Zm0C3cWyLQiUSHwocRbA0Il7+tBzPdjBrkyA9gODLIQA3pBB+748n5xTlkEvvCwBrvfBQsc4402FHTe0GYCiOilC6UaPsFYsDZlYOqrRbSzWsBANcC8QIjCwnTcSMCiioOwbguInEkCoHAJZDwiCYAADF8ZPREKiYGeAhZblYcDGk0Ba6MEpngQBChj4ZBOmgfg4YQAERAC8MAtC8D0MVgwKgbCbIcM3NAbhNleGpzrijIR90RHQjEZISRTYZFyIUdSNkExebaOcjYwqYQHG6P4YI6kwjRGWnEeYwwliwHDBwUoChowETQh3oolBHN6o1ScIEgy1kTTcD4KsCEg9eCdWqGrNIg8nCD0HqfUK3FeIAn4isIQIJwTAAyVk+MsUAAiMAQl8GYPYRgJAkJXhRrFQ8J5zzoRvBQPJBSWAxHHGCOKAAJZp+NYqjLFtLJRStYoanorFDWchwijMybsvZ+zeAAHpDm1IOWc45IghYcCQKAQYygIr4LHAgJwTggA="}
// @errors: 2540
interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users'.toUpperCase(),
//  ^?
}

todo.title = 'Hello'

Number.parseInt('123', 10)
//      ^|

               //
               //
```

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"c6f2791b81c2170bb12e4d54f17b345c35c290fb6b3e803987a0875ad1778705","data":"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"}
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const highlighter = await createHighlighterCore({
  engine: createJavaScriptRegexEngine()
})

// @log: Custom log message
const a = 1
// @error: Custom error message
const b = 1
// @warn: Custom warning message
const c = 1
// @annotate: Custom annotation message
```

---

### `rendererClassic`

[Source code](https://github.com/shikijs/shiki/blob/main/packages/twoslash/src/renderer-classic.ts)

This renderer aligns with the output of legacy [`shiki-twoslash`](https://github.com/shikijs/twoslash).

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"be50298f5ea6976d501abea603d4b03abe8280f3bf0a7b10df97e47172449e7c","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808AKAQwBsBLZuASgAIAzAK5gAxmnYQwvUjDCwZpAMKsucdiMbdEvACoB3CHBVx8AJVnyyAHTDsAtlgik00i2TLLV6yiCgQRCIggOvgwvLD8zIKsLjJy7qS8bOwA5rZgKbx67Gj4vLlhTqnsYGy8AAYAAibsANbsAFZwAPRoBkZc+OW8EIJoWH0AdD5waMzOSACcVKyyKblIAIwArFRjpCkwDEFxlkrGaiI+HGC4iAAMVCL448xiZFMAvhTo2GcExA9rdNsgLBxcPhCUTiST5UjMMBwfhOOxkfSGYz4RgQLCgqEAfm0OghUJhpDhpARHRMAEl4rQAPJoiRQrS8ADK+Dq7BxkOhsOstgcThcaFxHIJ8PaSJ8fgCeAAYnc0E4MAJhGJafkILwRDJmDQkozmfVwez8YSBE58iLOrwSjQUhD0XBhlRRuNtgAmABsMzmC0Qi2m1HGm1+/INnKJZpMxxKZ0uIGut3u5EQbuerxweEIJHI33oTGSgP1eJDxKRKJpkjgWN0AsNwsRnXJsCppbp2iZLLZBaFpBs9kcznzgsJRc6Yv8gRA0rEcoVIOVsrVGq1zB1LP71cS+NNtZMFrAVpttLtI3W2wA7AAWD0ZL0+tb+rZ4IMdwdh/AR05IZ1XG4Q+NIc7J6g3jTT5M2oH4mCwUhUTITA+HbAcaxJfBqVtQZdgSCshxMcx4gUXgAB9eGECJIygEcJSCRRBFGCA7FcXCyDgFVwhgER2FgXhCD0XgYDuPIShhXgTF6VgoF4AAjMJ0JkMiHWPKYAA5L3mV9ECUv0NnvHY3AUN8zgAZi/OMaATZ0AMwVMgnTL4wOzIJ/k4Hh6L2Tw4EOTRsRfHC9m7Hk+2kjwDm8KhxTHEIwgiKIYmchIkg4NISkybJcnyUIelIYpSlYCpql1RoWjaLcuh6PoBjQe0QEdCZvXOdTZivVSVlvTTfgC/YvCOGZIyQQyY2/GUHm9MyAF0rmgd4e15XhgBihRXMOChV0LF9eEeAQoLogByXKWSaVoX02mwbEfBDQyKxhgBsXhZrIbQ2vm9RNF4Zpml4AAeABaD6bEebgfDhMYkFAH5ZDUSQHwQR5HiAA="}
import { rendererClassic, transformerTwoslash } from '@shikijs/twoslash'

transformerTwoslash({
  renderer: rendererClassic() // <--
})
```

You might need to reference `shiki-twoslash`'s CSS to make it look good. [Here](https://github.com/shikijs/shiki/blob/main/packages/twoslash/style-classic.css) we also copied the CSS from `shiki-twoslash` but it might need some cleanup.

### `rendererFloatingVue`

[Source code](https://github.com/shikijs/shiki/blob/main/packages/vitepress-twoslash/src/renderer-floating-vue.ts)

This renderer outputs Vue template syntax that using [Floating Vue](https://floating-vue.starpad.dev/) as the popup component (to render it outside the containers). This renderer is **NOT** directly usable but an internal renderer for the [VitePress integration](/packages/vitepress#twoslash). Listing it here for reference if you want to create your own renderer.

## Options

### Explicit Trigger

When integrating with `@shikijs/markdown-it` or `rehype-shiki`, we may not want Twoslash to run on every code block. In this case, we can set `explicitTrigger` to `true` to only run on code blocks with `twoslash` presented in the codeframe.

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"c33fc7b243f56e1595f93ca6e9e052fed95abb58a9edc5376b448c62984626f1","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808AKAQwBsBLZuASgAIAzAK5gAxmnYQwvNKWZg4/CKQC2ZACoB3CHFZd8jCFnGS4AfkS81s+YpXqtOvQEkwsWgHkjE+dwsBlfHYAa3YrOQUlVVIAHTB2ZSwlNGlrCLtSTW1dOHxKECgIEQREEAAxZjElDAFhMW9pCF4RUhhmGl5mXgDg9hTw2yiBJWkHbPxedjAaAHNZY3kAOjy4NGZSBkQATipWGDBptFzEAEZt6jXpmA3qVIH7LL08jjBcRAAGKhF8NYqaci2AL4UdDYV4EYhkPI0ehMNicHh9GyRe6OHIGLwmcyWW7IjKjZyuOieeY8fyBEJhJHpWLxRLrRFpKKZVG5KgFIp4cqVUjVISieYNJotNowDpdcm9GT9XFDUgjB45CZTGCzNreOBLKgrNYbACsAHYdnsDkdTlRVqRLtcpVSmfick9Jq8AEyfb6yMSQ95AkE4PCEEjkc10a6MLCkQxkTB8SmMlFjYnqhZ0LAcETsNBWdjTS6kLEAIwgEF2cl4AB9eAAlFUAUVoWHLvGEsH4TqgeXZxRA1YAjoJ2C04LwAAZoe34YeC/Oi8PwPY0KBK6T4UUiaCi/OsQpBXiqVaC5hYVPVQ7sIc2uNB87TYrIZD5GD8ZiCVgMKhP1hwXAAXW/WotGwABzHEa+yHEgxy6uaFxXHgKZphmWY5pCOxOkgADMbo/J6/zOgCf4gGusB4LSSS8MADJ3HiCrjACAgRsovAAOQAAI5D0ABWcAAPRjjRTGxLEF5UcyYyMMAsS8Lw8HsOmmakNmuYWDIgiitx3G8AAPAAtNpsQAtweR7swSCgCGexwN4eBoAgAIAkAA="}
import { transformerTwoslash } from '@shikijs/twoslash'

transformerTwoslash({
  explicitTrigger: true // <--
})
```

````md
In markdown, you can use the following syntax to trigger Twoslash:

```ts
// this is a normal code block
```

```ts twoslash
// this will run Twoslash
```
````

## Integrations

While you can set up Twoslash with Shiki on your own with the instructions above, you can also find high-level integrations with frameworks and tools here:

- [VitePress](/packages/vitepress#twoslash) - A plugin to enable Twoslash support in VitePress.
- [Nuxt](/packages/nuxt#twoslash-integration) - A module to enable Twoslash for Nuxt Content.
- [Vocs](https://vocs.dev/docs/guides/twoslash) - Vocs has TwoSlash support built-in.
- [Slidev](https://sli.dev/features/twoslash#twoslash-integration) - Slidev has TwoSlash support built-in.

## Recipes

### CDN Usage

By default [`twoslash`](https://github.com/twoslashes/twoslash/tree/main/packages/twoslash) runs on Node.js and relies on your local system to resolve TypeScript and types for the imports. Import it directly in non-Node.js environments would not work.

Luckily, Twoslash implemented a virtual file system, which allow you to provide your own files for TypeScript to resolve in memory. However, loading these files in the browser is still a challenge. Thanks to the work on the [TypeScript WebSite](https://github.com/microsoft/TypeScript-Website), the TypeScript team has provided some utilities to fetch types on demand through CDN, they call it [Automatic Type Acquisition (ATA)](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ata).

We make tiny wrappers around the building blocks and provide an easy-to-use API in [`twoslash-cdn`](https://twoslash.netlify.app/packages/cdn). For example:

```js
// FIXME: Replace with explicit versions in production
import { createTransformerFactory, rendererRich } from 'https://esm.sh/@shikijs/twoslash@latest/core'
import { codeToHtml } from 'https://esm.sh/shiki@latest'
import { createTwoslashFromCDN } from 'https://esm.sh/twoslash-cdn@latest'
import { createStorage } from 'https://esm.sh/unstorage@latest'
import indexedDbDriver from 'https://esm.sh/unstorage@latest/drivers/indexedb'

// ============= Initialization =============

// An example using unstorage with IndexedDB to cache the virtual file system
const storage = createStorage({
  driver: indexedDbDriver({ base: 'twoslash-cdn' }),
})

const twoslash = createTwoslashFromCDN({
  storage,
  compilerOptions: {
    lib: ['esnext', 'dom'],
  },
})

const transformerTwoslash = createTransformerFactory(twoslash.runSync)({
  renderer: rendererRich(),
})

// ============= Execution =============

const app = document.getElementById('app')

const source = `
import { ref } from 'vue'

console.log("Hi! Shiki + Twoslash on CDN :)")

const count = ref(0)
//     ^?
`.trim()

// Before rendering, we need to prepare the types, so that the rendering can happen synchronously
await twoslash.prepareTypes(source)

// Then we can render the code
app.innerHTML = await codeToHtml(source, {
  lang: 'ts',
  theme: 'vitesse-dark',
  transformers: [transformerTwoslash],
})
```
