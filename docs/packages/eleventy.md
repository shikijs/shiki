# Eleventy (11ty) integration

## 1) Add Shiki to your project

<Badges name="shiki" />

```sh [npm]
npm install -D shiki
```

## 2) Shiki configuration

Create a Javascript file to configure Shiki for your project, for example, at `src/libs/shiki.js`:

```javascript
module.exports = (eleventyConfig, options) => {
  // empty call to notify 11ty that we use this feature
  // eslint-disable-next-line no-empty-function
  eleventyConfig.amendLibrary('md', () => { });

  eleventyConfig.on('eleventy.before', async () => {
    const shiki = await import('shiki');

    // highlighter config
    const highlighter = await shiki.createHighlighter(
    {
      themes: ["light-plus", "dark-plus"],
      langs: [
        'shell', 'html', 'yaml',
        'sql', 'xml', 'javascript'
      ]
    });

    eleventyConfig.amendLibrary('md', (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => {
          return highlighter.codeToHtml(code,
          {
            lang: lang,
            themes: {
              light: "light-plus",
              dark: "dark-plus"
            }
          });
        }
      })
    );
  });
};
```

## 3) Call Shiki configuration in `.eleventy.js`

```javascript
module.exports = function(eleventyConfig) {
  ...

  // IMPORTANT!
  // remove 11ty syntax highlighter plugin, if present:
  // eleventyConfig.addPlugin(syntaxHighlight)

  // Add:
  eleventyConfig.addPlugin(require("./src/libs/shiki.js"), { });

  ...
}
```

## 4) (Bonus) Using Shiki in conjunction with Mermaid

If you want to use Shiki and also want to render [Mermaid diagrams](https://mermaid.js.org/), you need to change to Shiki setup to render Mermaid code blocks as HTML divs, instead of code highlights.

### 4.1) Add htmlencode to your project

```sh [npm]
npm install -D htmlencode
```

### 4.2) Modify Shiki configuration

```javascript
const htmlencode = require('htmlencode'); // [!code ++]

module.exports = (eleventyConfig, options) => {
  // empty call to notify 11ty that we use this feature
  // eslint-disable-next-line no-empty-function
  eleventyConfig.amendLibrary('md', () => { });

  eleventyConfig.on('eleventy.before', async () => {
    const shiki = await import('shiki');

    // highlighter config
    const highlighter = await shiki.createHighlighter(
    {
      themes: ["light-plus", "dark-plus"],
      langs: [
        'shell', 'html', 'yaml',
        'sql', 'xml', 'javascript'
      ]
    });

    eleventyConfig.amendLibrary('md', (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => {
          if (lang === "mermaid") { // [!code ++]
            const extra_classes = options?.extra_classes ? ' ' + options.extra_classes : ''; // [!code ++]
            return `<div class="mermaid${extra_classes}">${htmlencode.htmlEncode(code)}</div>`; // [!code ++]
          } // [!code ++]
          else { // [!code ++]
            return highlighter.codeToHtml(code,
            {
              lang: lang,
              themes: {
                light: "light-plus",
                dark: "dark-plus"
              }
            });
          } // [!code ++]
        }
      })
    );
  });
};
```

### 4.3) Mermaid configuration

Create a Javascript file to configure Mermaid for your project, for example, at `src/libs/mermaid.js`:

```javascript
module.exports = (eleventyConfig, options) => {
  let mermaid_config = {
    startOnLoad: false,
    theme: "default",
    loadOnSave: true
  };
  let src = options?.mermaid_js_src || "https://unpkg.com/mermaid/dist/mermaid.esm.min.mjs";

  eleventyConfig.addShortcode("mermaid_js_scripts", () => {
    return `<script type="module" async>
              import mermaid from "${src}";
              const config = ${JSON.stringify(mermaid_config)};
              mermaid.initialize(config);
              await mermaid.run({
                querySelector: '.mermaid'
              });
            </script>`
  });
  return {}
};
```

### 4.4) Call Mermaid configuration in `.eleventy.js`

```javascript
module.exports = function(eleventyConfig) {
  ...

  eleventyConfig.addPlugin(require("./src/libs/shiki.js"), { });
  // Add:
  eleventyConfig.addPlugin(require("./src/libs/mermaid.js"), { }); // [!code ++]

  ...
}
```

### 4.5) Add Mermaid script shortcode

Add the `mermaid_js_scripts` shortcode (declared in 4.3) to pages and templates that will have Mermaid diagrams:

```
{% mermaid_js_scripts %}
```

## Full working example

https://github.com/alexandrehtrb/alexandrehtrb.github.io
