# Design

From user's pov:

- code -> tokenizer + | grammars | -> tokens -> | themes | -> themed tokens
- themed tokens + | renderer | -> HTML

## Choices

- grammar: custom registration of grammars
  - Q: embedded grammar? double embed, such as graphql in Vue's JS?
- themes: custom choice of themes
- renderers: custom choice of how to render themed tokens

### Where does Polacode fit?

Polacode generate themed tokens as Shiki does.

Rendering should take two parts:

- HTML renderer: same as Shiki, this should be customizable
- HTML to IMG: no options

## Repos

Find a way to auto generate these repos from upstream:

- grammars
- themes

### Core

- tokenizer (Onigasm, tokenize all lines)
- themer
- resolver
  - resolve extension to grammar
  - resolve embedded grammars
  - tokens -> themed tokens
- renderer