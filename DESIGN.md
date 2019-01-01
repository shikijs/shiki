# Design

From user's pov:

- code -> tokenizer + | grammars | & | themes | -> tokens
- tokens + | renderer | -> HTML

## Choices

- grammar: custom registration of grammars
  - Q: embedded grammar? double embed, such as graphql in Vue's JS?
- themes: custom choice of themes
- renderers: custom choice of how to render themed tokens

### Where does Polacode fit?

Polacode generate tokens as Shiki does.

Rendering should take two parts:

- HTML renderer: same as Shiki, this should be customizable
- HTML to IMG

---

Polacode has access to Webview, can measure glyph width -> can export to SVG.
Make Shiki renderer more focused on HTML.
Make Polacode export sketch/svg/etc.

