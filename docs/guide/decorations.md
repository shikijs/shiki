# Decorations

We provide a decorations API allowing you to wrap custom classes and attributes around ranges of your code.

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"ad050f718f888f34bc2e29d3975e0a0637dd197e8c39b6f65c54ee8d925fa178","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808AKAQwBsBLZuASgAIBjCGDhoB0GABUIACTQBbVol6NBsJSNLswAcwq8IWNOyFwlAYXFTpXNAHlDx4QB4AQgFcwUVjCgAZZjpuzNoweu6e3lAS+DByMAB8fAC88bwACqQQcuxwME4aWtrxADpg7HJYEKSiqpIy8qyUICLM1UgAnFTeOmj4SACMAAxUaK0hDIggtVYNTRxguIjDU/itzPw05IjtAL4U6NiLBMRkTTT0eILCNeLqaJo6TS1tiAAsAExdMD19byNjMAmU3Ecy0i0+KzWG1OiAAbHsDjg8IQSOQRnQgYw4r1oHwAMr3QoAOkJckY3DuD20TSgEH4CEmACVYic4LxejBeN5mFBCrwAlB2aRmOx5tpeAB3fDsGi8OBYdacgVcsHssjZMDMNBVASrYXQ0hsgBmmTk/LlhJ0RKeoxeAA5+l8fkhXv9SOM8KTQQskABWKj8PXrTZId4I6iHZEnNHUDGXEyifANSmFG2tCbtf0gbraXout0eyZJhTexYAdgDQYNSHh+wjSKL0bOccmLA4XD403qChUtwtVL0BiMJnMlhkNnsw+c4S8Pn8gWCoV4M8i0ViCQp6VNOTyBR0JTKFSqN1gMxLVGeEyGdqdud+QwLgPjp+7jS6YKQFch+pDiH6uzrTAG2OVFmwuSYrhEMQ1H7VML1tK9/1vPM/moAEgVqUtP0rKFfwAZkGcMgKOFFTnRcCQEYLBMhwaoMD4CxYEnRw4DxQpvDXOJXA8WcohiOJ4hJfiYCUTiYGZbQcnuLVHAAQTADBeAAH14AkqV8GUyDYABVMohG4iIfDEvQ9yKNMXn6d5Omzb47z9R8gQ5OIsMQG9v2DGEw0AyNG1A8jMWogwyEwPhWACbQlGKag4Ci8yr19LMcxQ100PdJ9JjCx53x9bYcJ/TyiJ8kCyNjCiqJo4L6N4AARGBBGFKdmJMIlYHqmSTAAfiUWq2qnABJGg5GQABdZTeB4mAjTBKAaTpBkQDMNwRCyXhWqqdrhHZCBJWFLBeGlbR8A4Q6aEFbUAGtvjZCUZXwa14PTAZYWspL70dVLCxANaGpYlyH3c6tEC8xESKbfymEC2iQpqur1v6waiUvJRbCNI1cjsUg0ggOAZUcWb6TwAl030VH0f0UheEqHGpxJ9kYlW2GfqEe7mgQ0NfRS177I+9LWce7LFn6PC8o8rZaxBqM/NKgKKrovgsepxwiXmETeDANw5AAIxKy9Q1hYWbOdVDbU+lW/oNwNcJhfpfUK4DSJjc4ZaCuX0mx3Hmct/LSCUdWtZ1tmgbLCEudynmMKrEMBYGC3I88147dBqWnYh2XoZ6uHHAG2IiW+KBkdJwFbEx92p3x+aAFFPBJtHAXJynS8cWmOQZ3qlbi0N2k52yUINk3ebzv6Uq90Wa0TyWSpT1tIcq+XG+ZlXfY17WY11xACPe0OUv7oEzejv9h7jrYhfH3zJ5bSiZ9dhWPbAIkR4NJf/dXwO8P+0PrJ3y4j6HkXAfeYG9Yk7nzKlfdOjMNrZzkESMB7B4BdS3C7Iw8AxoTSmgsGaVBaQE0mBkJBcC2QQCNHTTkMBvBxDAKIbUAhSAwC1DAFma88LMOQveZYX9JiwPgH9LMD9fziyARPR2F9ypIKqvwMKcBTCwSynzF4eFXhflDlmDhUxJEIH3jbP+v53iEWGgGEEkxyiVGqLwYA0E6iyAULwHYvATQrQAORwGlOddgDjSilEgieTkSReAAANPEJl4LQXgvihiBOEBAbwysIDaEYLQbgpQ/Ekk0GSRJYAIlQWLKwUJ/IJQim8WeVgvZYB6GAKUXgJC4hKAcUQTSUiYAAFpjpJgcRQCpXJwo1LQHANpHTvobWkcgXgAB6EZvBkAAEJaj7UUHaYaHTKnlLAJU1Zozxkq35NXPhZB+S0N4IMRpWhYC0B8Is1ZSMzEqgWEoR0uorY+wOTY9pKy1m8Dzkocxi9eB3J2Y8/o/RnnnMqVw6R5iJFcGkQ4g6R12AnR8I0iUVQoAOJsecnYHSFlgB2NwJo2JmBIFABiK6eNJg9JADsHYQA=="}
import { codeToHtml } from 'shiki'

const code = `
const x = 10
console.log(x)
`.trim()

const html = await codeToHtml(code, {
  theme: 'vitesse-light',
  lang: 'ts',
  decorations: [ // [!code hl:8]
    {
      // line and character are 0-indexed
      start: { line: 1, character: 0 },
      end: { line: 1, character: 11 },
      properties: { class: 'highlighted-word' }
    }
  ]
})
```

The result will be (styled with CSS in this example):

```ts
// @decorations:[{"start":{"line":1,"character":0},"end":{"line":1,"character":11},"properties":{"class":"highlighted-word"}}]
const x = 10
console.log(x)
```

The positions can also be 0-indexed offsets relative to the code:

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"47fd17de08b4473e25bec5efb46f7c9a87fe8015e912d6600f80379a8aa88210","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808BjCMONAAnzQFsAbRdm1IBLMAHNKINgENSDRADYqvGOLT4kAFippZYmPII9ek3qNyIADFUb5Z0xjXKKAvhXTYLBYmUk16eAAU0mbScACU7MywACoQABLGgdEwAkKiYhTsEFhowixwAgDC0DBx8WFoAPK5+awAPABCAK5gUCpQADLS4s3S+lktbR0x+DDcMAB84QIACqQQ3MJwMPXp4pMAOmDC3FgQclGl5caSMnJIAIwAnMqqYupX1tR6BkzHCafK5kjPtvaOXyIG5uDw4PCEEjkHR0QzMVgcFJpNAicRnXQXRAAZmeKjUGkQ2hepH0cNKph+VhsdlIDicSBxoOonghPmh1FhQSwCxwcgwkRKsBqeQKAGUMipRuNVkN2jAoFKJpMAHTqaUCRUwABKMDEyxR0hFYAAgmAMOwAD7sUUojKdYROEIAVR2LCarTlCrGEyy6zEk3Rsnkmlx90eiAArDpXoY1RMKWALJdqQD6YgAExMzDgxDeKF+Tm5wLcnJkTCRXg9MQCTbUOC1wOYhRKEB4h4EokY0l4Sto76JpDplO0wHOTPuZk5vO+GEBIsl3nl9gAERgzFpRuFdTgytg68N24A/AJV/ujQBJGjcZAAXUt7A9MAAZuYoJIoBBGAhc0VmmxFuwe4HAeBTsGgEDsAA7rSWCcMIYj4GYCE0FAYEQAA1qocBQQ6+DKo28gAByhviVzJsS3a5kBG7bgmFhYsOdJAuOYJeJCM4cnOIDFjyZb8iua7AReV7KucaACFUT5Pis1SkLMEBwA6dTvp+34gDaQbZFJMnZKQ7D7IpRpaWBYyAYJNEsPhVBiVc6YMa2YYElGFFvLmNn9hYzn/COaYKFmLK5ux7L+IYPGlnykSnkJdSXuMyqqFAEnaQYVRyQpSksCpX54AAom0WnSQYun6elRkQE+JkwGZZ51FZUgYvIlwhncpHYtGJKuSACV0UgLbeUxzh+RO2ZsWyBZcWFi78VFFlgLF3DKguZbCPAx7sPM4V5PA96Pi+iZvlQH7ZbmG2Lit2HlZV7AwCoExgBw4FRKQMCGjAdU2cCEbOW24aXM8XadUtcjnT1iAAOyMaOvX+VOQXjaFQNLowlZwIUgi2n29VBlcCi3A5rXOQDcIowgHlIBDID9VDGaWC4N42OSubwmwnDGOwAC87DSJB0gOkcsSfHwySlFkwDbOwlUTAIADkRAOvAKwALRIVw0sUOL7C9tW7DS2gcBqxr1EgawAjIOwAD05vsMgACEKScPwYM3hrEti2AEse+jQYCOmyYux7CU+9o/sS4j50CMAUQkzL+DwYhccoYrkEHFA0vsC4/sZ+77DO2ALjhJIEy6EgoCwlhym5nrIAuC4QA=="}
import { codeToHtml } from 'shiki'

const code = `
const x = 10
console.log(x)
`.trim()
// ---cut---
const html = await codeToHtml(code, {
  theme: 'vitesse-light',
  lang: 'ts',
  decorations: [ // [!code hl:7]
    {
      start: 21,
      end: 24,
      properties: { class: 'highlighted-word' }
    }
  ]
})
```

It renders:

```ts
// @decorations:[{"start":21,"end":24,"properties":{"class":"highlighted-word"}}]
const x = 10
console.log(x)
```

Negative character positions denote characters from the end of a line, starting with the line end:

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"f445be6013dcc1515a5189fe0a44669ee748465f55a6563c00cc29cd14e82b74","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808BjCMONAAgEsaBbRdgCIxmpAIZpOLAJK9KINqNINEANioAbGGADmafEgAsVNIu0xlIbjB5z1nMLkQAGKo3yLRjGuVUBfCujYjgTEZHI09HgAFKJ2onAAlFxg3gBmnjCCwhBiEtK8ADpgnDxYORxCIuKSYDLWcgpKSACMAEwaWrr6iM1G1KbmeJU51fn1GvaOLiBuHl5hPa3+gTh4hCTkxnQWUVikEDhKGEnDuTV1PAB0jWj8APKpqXDmd6QAChBw3DVyUBCMCEQIAAyiYlOwII9nhwcuwyl88mAIal2HpMrAqojLg0wcoAMx4jo6PRIACsxgGFhutkmLVc7jE8x8SwC1CCa1Cm2o22iewOZEwSQ+CJqlzsDn4YAArjwAEZhKjUxAGdogTTE7p9MFmCzi3ATBx0mYMzzeFrNZZs1ZA9YK7mRIG7faHQXsYXfFiXWaM7ySmXyrlK0nNIldJAATgppB1TBNTJphp69LmZsQrSclsw1pCG3CPMdfJdxyymPOvEuWig9yhL3enw9YF+/0BIAAomAoMinuYIaQ4fXEcjUfh0dkzp6cYplCpI2rOiTEIT+tHBkDKwnHKrvaaFiyVsFbVyIjtCwLi+6sXq/XK7UqAOxqOcawxRmNAvUbpBbuOp8OZ9k2pyeYOiATr8kcQoDqK25MteAaTk0iAABzkk+YaILO2qrsaKZ2h+abJj6CzNEh/7ZoewEns6Z4nGOoy1OWp5KJw8AAPz8G81HMfA7AAD7sFKHYwKkkxQE2AJ4Jx4ESDxkLDpkMCaDwWgcGgEDsIwpAwOIMDYoquItE4fTquhzTTFhFhMTJCAGo4S4wame5WgeQFbCBYFFkkjDqPEcD8GwpD2NoCHKM0JGhguqEWUwPlwDZaq0ouhE7j4zQqL4AC6rjQMEzCsBwVh8CWIyIhc7AALzsMARTsOwNz8MA7BXuwLgaT+ZD8E47D+DV7CVg1TWTJ1FBtbhpD8AAtM03UUL1VksX5VUabFi0AOT4Jw2j4HYW00FAE0AO45FAq3dUUvhyMpJhIKA2xaF8LB4GgCC+L4QA="}
import { DecorationItem } from 'shiki'
// ---cut---
const item: DecorationItem = {
  start: { line: 0, character: 0 },
  end: { line: 0, character: -1 },
  properties: { class: 'highlighted-word' }
}
```

This highlights the entire first line:

```ts
// @decorations:[{"start":{"line":0,"character":0},"end":{"line":0,"character":-1},"properties":{"class":"highlighted-word"}}]
const x = 10
console.log(x)
```

## Use Decorations in Transformers

For advanced use cases, you can use the [Transformers API](./transformers.md) to have full access to the tokens and the HAST tree.

Meanwhile, if you want to append decorations within a transformer, you can do that with:

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"168dce1d7598844e087d729942232d5910c63363a3eb6408ae7bc5c39ff399c8","data":"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"}
import { DecorationItem } from 'shiki'

function doSomethingWithCode(code: string): DecorationItem[] {
  return []
}
const code: string = ''

// ---cut---
import { codeToHtml, ShikiTransformer } from 'shiki'

const myTransformer: ShikiTransformer = {
  name: 'my-transformer',
  preprocess(code, options) {
    // Generate the decorations somehow
    const decorations = doSomethingWithCode(code)

    // Make sure the decorations array exists
    options.decorations ||= []
    // Append the decorations
    options.decorations.push(...decorations)
  }
}

const html = await codeToHtml(code, {
  theme: 'vitesse-light',
  lang: 'ts',
  transformers: [
    myTransformer
  ]
})
```

Note that you can only provide decorations in or before the `preprocess` hook. In later hooks, changes to the decorations array will be ignored.
