# Comparison with other libraries

Shiki is often compared to other popular syntax highlighting libraries like [Prism.js](https://prismjs.com/) and [Highlight.js](https://highlightjs.org/).

## Summary

| Feature | Shiki | Prism.js / Highlight.js |
| --- | --- | --- |
| **Engine** | TextMate Grammar (Oniguruma) | Regex |
| **Accuracy** | High (Same as VS Code) | Good |
| **Themes** | VS Code Themes | CSS |
| **Languages** | VS Code Languages | Built-in / Plugins |
| **Output** | HTML with inline styles | HTML with classes |
| **Runtime** | Node.js / Modern Browsers (WASM) | Browser / Node.js |
| **Bundle Size** | Heavy (WASM + Grammars) | Light |

## Why Shiki?

### Accuracy

Shiki uses the same engine as VS Code (TextMate grammars), which means the highlighting is exactly the same as what you see in VS Code. It handles complex language features that regex-based highlighters often struggle with.

### Zero CSS

Shiki generates HTML with inline styles. You don't need to include any extra CSS files to make the code look good. It just works.

### Ecosystem

Since Shiki uses VS Code themes and languages, you can easily use any of the thousands of themes and languages available in the VS Code marketplace.

## When NOT to use Shiki?

### Runtime Performance

Shiki relies on Oniguruma (WASM) which is heavier and slower to initialize than regex-based solutions. If you need to highlight code on the client-side in a performance-critical application, Prism.js or Highlight.js might be better choices.

However, for static site generation (SSG) or server-side rendering (SSR), the performance difference is usually negligible, and the better highlighting quality is worth it.
