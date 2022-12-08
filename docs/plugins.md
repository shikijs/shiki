# shiki-plugins

Plugins provide an opinionated way to extend the functionality of Shiki. They can be used to alter the HTML output of the Shiki [renderer](../packages/shiki/src/renderer.ts).

## Using a plugin

Plugins are passed to the `highlighter` via the `usePlugin` method.

```js
const shiki = require('shiki')
const coolPlugin = require('shiki-cool-plugin')

shiki
  .getHighlighter({
    theme: 'nord'
  })
  .then(highlighter => {
    highlighter.usePlugin(coolPlugin) // usePlugin() adds the plugin to the highlighter
    console.log(highlighter.codeToHtml(`console.log('shiki');`, { lang: 'js' }))
  })
```

You can also chain multiple plugins. The order of the plugins is important, as they are applied in the order they are passed to `usePlugin()`.

> Note: After invoking `codeToHtml()` the plugins in the highlighter will be reset, so you will need to call `usePlugin()` again if you want to use the plugins again.

```js
const shiki = require('shiki')
const coolPlugin = require('shiki-cool-plugin')
const localPlugin = require('./plugins/localPlugin')

const highlighter = await shiki.getHighlighter({
  theme: 'nord'
})

const output = await highlighter
  .usePlugin(coolPlugin)
  .usePlugin(localPlugin)
  .codeToHtml(`console.log('shiki');`, {
    lang: 'js'
  })
```

## Creating a plugin

A plugin provides its functionality as object or as a function that returns an object. The object can contain the following properties:

```js
{
  // The name of the plugin, i. e. 'cool-plugin'
  name: string
  config?: {
    // Whether the plugin requests details about the tokenization
    requestExplanation?: boolean
    // Wether the plugin requests details about the theme
    requestTheme?: boolean
  }
  // The tags that can be modified, which are direct
  // associations to the underlying HTML structure
  tags: {
    pre?: ElementOptions    // represents the `pre` tag
    code?: ElementOptions   // represents the `code` tag
    line?: ElementOptions   // represents the `span` tag that holds a line of tokens
    token?: ElementOptions  // represents the `span` tag that holds a single token
  }
  // The tags that can be modified, which are direct
  // associations to the underlying HTML structure
  hooks?: {
    before?: ElementOptions    // represents a hook where you can alter the tokenized elements before any rendering happens
    after?: ElementOptions   // represents a hook where you can alter the HTML output of the renderer (for every tag type)
  }
}
```

For most use cases it should be sufficient to just use the `tags` option.

You can apply specific modifications:

- Add new attributes (i. e. `data-my-thing="13"`)
- Add CSS classses
- Add CSS inline styles

To set those modifications you can set one of the following keys, either as object or as function.

```js
{
  // Set HTML attributes directly on the tag
  attributes?: context => {
      return Record<string, string>
    }
  // Add CSS classes to the tag
  classNames?: string[]
  // Add inline CSS to the tag
  styles?: Record<string, string>
}
```

> Note: On the `code` tag you can only add new attributes, but not modify CSS classes or inline styles.

Plugins have access to the plugin `context`, which you can see in the above example. The context provides additional information about the current plugin invocation and can be utilised within custom logic in a plugin.

Depending on the context the following properties are available:

// markdown table with 4 columns
| Property | Type | Available where?| Description
| --- | --- | --- |--- |
| `language` | `string` | All tags and hooks | The specified code language. |
| `theme` | `string` | All tags and hooks | If `requestTheme` in the config is set to `true` this will hold the full theme, otherwise the theme name. |
| `index` | `number` | tags -> line| The zero-based index of the current line. |
| `line` | `string[]` | tags -> line| All tokens of the current line, read-only. |
| `lines` | `string[]` | tags -> line| All lines, read-only. |
| `token` |`string[]` | tags -> token| All lines, read-only .|
| `tokens` |`string[]` | tags -> token| All tokens, read-only. |
| `tokens` |`string[]` | hooks -> before| All tokens. Writeable.|
| `elementType` |`string` | hooks -> after| Tag name of the rendered element (i. e. `pre`) |
| `html` |`string` | hooks -> after| The rendered HTML of the current element. Writeable. |

In addition to that you can utilize the `state` property on the context, which is a simple object that can be used to store data between plugin invocations.

### Example

The first example is a simple plugin that adds:

- a new class to the `pre` tag
- a data attribute to the `code` tag, and
- inline CSS to the `token` tag.

```js
module.exports = {
  name: 'simple',
  tags: {
    pre: {
      classNames: ['add-me']
    },
    code: {
      attributes: {'data-selector', 'custom'}
    },
    line: {
      styles: context => {
        return { color: context.theme === 'nord' ? 'red' : 'blue' }
      }
    }
  }
}
```

This second example removes the default `shiki` class from the `<pre>` tag after the tag has been rendered.

```js
module.exports = config => {
  return {
    name: 'pluginHookAfter',
    hooks: {
      after: context => {
        return context.elementType === 'pre'
          ? { html: context.html.replace(/class="shiki/, 'class="highlighter') }
          : { html: context.html }
      }
    }
  }
}
```

You can find more examples in the [plugins test folder](../packages/shiki/src/__tests__/plugins).
