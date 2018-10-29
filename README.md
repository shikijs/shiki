**shiki**

Experimental [Onigasm](https://github.com/NeekSandhu/onigasm) based Syntax Highlighter.

```js
const shiki = require('shiki')

async function go() {
  const themedTokenizer = await shiki.getCodeTokenizer('light_plus')
  const tokenizingInfo = themedTokenizer("console.log('foo');", 'javascript')
  const html = shiki.buildHTML(tokenizingInfo, 'JavaScript')

  console.log(html)
  console.log(JSON.stringify(tokenizingInfo, null, 2))
}

go()
```

`html`
```html
<pre class="shiki"><div class="language-id">JavaScript</div><code><span style="color: #267F99">console</span><span style="color: #000000">.</span><span style="color: #795E26">log</span><span style="color: #000000">(</span><span style="color: #A31515">'foo'</span><span style="color: #000000">);</span>
</code></pre>
```

`tokenizingInfo`
```json
[
  [
    {
      "content": "console",
      "color": "#267F99",
      "explanation": [
        {
          "content": "console",
          "scopes": [
            {
              "scopeName": "source.js",
              "themeMatches": []
            },
            {
              "scopeName": "support.class.console.js",
              "themeMatches": [
                {
                  "name": "Types declaration and references",
                  "scope": [
                    "meta.return-type",
                    "support.class",
                    "support.type",
                    "entity.name.type",
                    "entity.name.class",
                    "storage.type.cs",
                    "storage.type.generic.cs",
                    "storage.type.modifier.cs",
                    "storage.type.variable.cs",
                    "storage.type.annotation.java",
                    "storage.type.generic.java",
                    "storage.type.java",
                    "storage.type.object.array.java",
                    "storage.type.primitive.array.java",
                    "storage.type.primitive.java",
                    "storage.type.token.java",
                    "storage.type.groovy",
                    "storage.type.annotation.groovy",
                    "storage.type.parameters.groovy",
                    "storage.type.generic.groovy",
                    "storage.type.object.array.groovy",
                    "storage.type.primitive.array.groovy",
                    "storage.type.primitive.groovy"
                  ],
                  "settings": {
                    "foreground": "#267f99"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "content": ".",
      "color": "#000000",
      "explanation": [
        {
          "content": ".",
          "scopes": [
            {
              "scopeName": "source.js",
              "themeMatches": []
            },
            {
              "scopeName": "punctuation.accessor.js",
              "themeMatches": []
            }
          ]
        }
      ]
    },
    {
      "content": "log",
      "color": "#795E26",
      "explanation": [
        {
          "content": "log",
          "scopes": [
            {
              "scopeName": "source.js",
              "themeMatches": []
            },
            {
              "scopeName": "support.function.console.js",
              "themeMatches": [
                {
                  "name": "Function declarations",
                  "scope": [
                    "entity.name.function",
                    "support.function"
                  ],
                  "settings": {
                    "foreground": "#795E26"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "content": "(",
      "color": "#000000",
      "explanation": [
        {
          "content": "(",
          "scopes": [
            {
              "scopeName": "source.js",
              "themeMatches": []
            },
            {
              "scopeName": "meta.brace.round.js",
              "themeMatches": []
            }
          ]
        }
      ]
    },
    {
      "content": "'foo'",
      "color": "#A31515",
      "explanation": [
        {
          "content": "'",
          "scopes": [
            {
              "scopeName": "source.js",
              "themeMatches": []
            },
            {
              "scopeName": "string.quoted.single.js",
              "themeMatches": [
                {
                  "scope": "string",
                  "settings": {
                    "foreground": "#a31515"
                  }
                }
              ]
            },
            {
              "scopeName": "punctuation.definition.string.begin.js",
              "themeMatches": []
            }
          ]
        },
        {
          "content": "foo",
          "scopes": [
            {
              "scopeName": "source.js",
              "themeMatches": []
            },
            {
              "scopeName": "string.quoted.single.js",
              "themeMatches": [
                {
                  "scope": "string",
                  "settings": {
                    "foreground": "#a31515"
                  }
                }
              ]
            }
          ]
        },
        {
          "content": "'",
          "scopes": [
            {
              "scopeName": "source.js",
              "themeMatches": []
            },
            {
              "scopeName": "string.quoted.single.js",
              "themeMatches": [
                {
                  "scope": "string",
                  "settings": {
                    "foreground": "#a31515"
                  }
                }
              ]
            },
            {
              "scopeName": "punctuation.definition.string.end.js",
              "themeMatches": []
            }
          ]
        }
      ]
    },
    {
      "content": ");",
      "color": "#000000",
      "explanation": [
        {
          "content": ")",
          "scopes": [
            {
              "scopeName": "source.js",
              "themeMatches": []
            },
            {
              "scopeName": "meta.brace.round.js",
              "themeMatches": []
            }
          ]
        },
        {
          "content": ";",
          "scopes": [
            {
              "scopeName": "source.js",
              "themeMatches": []
            },
            {
              "scopeName": "punctuation.terminator.statement.js",
              "themeMatches": []
            }
          ]
        }
      ]
    }
  ]
]
```