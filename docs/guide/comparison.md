# Comparison with Other Syntax Highlighters

This page compares Shiki with other popular syntax highlighting libraries to help you choose the right tool for your project.

## Overview

| Feature | Shiki | Prism.js | Highlight.js |
|---------|-------|----------|--------------|
| **Highlighting Engine** | TextMate grammars (VS Code) | Custom RegExp patterns | Custom language definitions |
| **Accuracy** | Very high (same as VS Code) | Good | Good |
| **Bundle Size (Core)** | ~6MB (with all languages) | ~2KB core + languages | ~7KB core + languages |
| **Language Support** | 200+ languages | 290+ languages | 190+ languages |
| **Theme Support** | 30+ themes (VS Code themes) | 8 official themes | 250+ themes |
| **Output Format** | HTML with inline styles | HTML with CSS classes | HTML with CSS classes |
| **Runtime** | Any modern JS runtime | Browser/Node.js | Browser/Node.js |
| **Setup Complexity** | Medium | Low | Low |

## Shiki

**Strengths:**
- Uses the same syntax highlighting engine as VS Code, providing extremely accurate highlighting
- No need to maintain custom RegExp patterns or CSS for each language
- Themes and language support automatically evolve with VS Code
- Produces HTML with inline styles, no CSS dependencies required
- Platform agnostic - works in Node.js, browsers, and edge runtimes
- Fine-grained bundle control with lazy loading support

**Considerations:**
- Larger bundle size when including multiple languages (though async chunks help)
- Requires async initialization due to WASM dependency
- Inline styles can result in larger HTML output
- Cannot dynamically change themes without re-rendering (use dual themes instead)

**Best For:**
- Projects that need VS Code-level syntax highlighting accuracy
- Static site generators and documentation sites
- Environments where you can lazy-load languages
- When you want themes to automatically stay in sync with VS Code

## Prism.js

**Strengths:**
- Very lightweight core library (~2KB)
- Simple to set up and use
- Extensive plugin ecosystem
- Works well for client-side highlighting
- Good language support with many community plugins
- Can dynamically load languages

**Considerations:**
- Uses custom RegExp patterns that need maintenance
- Requires separate CSS file for styling
- Less accurate highlighting compared to TextMate grammars
- CSS class-based approach requires additional stylesheet loading

**Best For:**
- Projects where bundle size is critical
- Simple websites with basic syntax highlighting needs
- When you need extensive plugin support
- Client-side highlighting of user-provided code

## Highlight.js

**Strengths:**
- Automatic language detection
- Easy to set up with zero configuration
- Large selection of themes (250+)
- Works well for blogs and content sites
- No need to specify language manually

**Considerations:**
- Uses custom language definitions
- Requires separate CSS file for styling
- Automatic detection can sometimes be inaccurate
- Less precise highlighting than TextMate-based solutions

**Best For:**
- Content-heavy websites and blogs
- When automatic language detection is needed
- Projects that want many theme choices
- Quick prototyping and simple use cases

## Detailed Comparison

### Highlighting Accuracy

**Shiki** provides the most accurate syntax highlighting because it uses TextMate grammars - the same engine that powers VS Code. This means if your code looks correct in VS Code, it will look correct with Shiki.

**Prism.js** and **Highlight.js** use custom RegExp patterns and language definitions. While they work well for most cases, they may not handle complex syntax edge cases as accurately as TextMate grammars.

### Performance

**At Build Time:**
- **Shiki**: Excellent for SSG (Static Site Generation) - highlight once at build time
- **Prism.js**: Good for SSG, also works well client-side
- **Highlight.js**: Primarily designed for client-side highlighting

**At Runtime:**
- **Shiki**: Best used at build time; can work at runtime but needs WASM initialization
- **Prism.js**: Fast client-side highlighting, synchronous operation
- **Highlight.js**: Automatic detection adds overhead but still performant

### Bundle Size Considerations

**Shiki:**
- Core + WASM: ~600KB
- Each language: ~5-50KB
- Each theme: ~10-20KB
- Supports fine-grained bundling and lazy loading
- Total with all languages: ~6MB (but only loads what you use)

**Prism.js:**
- Core: ~2KB
- Each language: ~1-5KB
- Each theme: ~1-2KB
- Plugin ecosystem adds to size as needed

**Highlight.js:**
- Core with common languages: ~100KB
- Each additional language: ~2-10KB
- Each theme: ~1-2KB

### Theme System

**Shiki:**
- Uses VS Code themes (TextMate format)
- Inline styles in HTML (no CSS file needed)
- Supports dual themes (light/dark) natively
- Themes include all token color definitions
- Automatically stays in sync with VS Code theme updates

**Prism.js:**
- CSS class-based theming
- Requires separate CSS file
- Theme switching done via CSS file swap
- Easier to customize with CSS

**Highlight.js:**
- CSS class-based theming  
- 250+ themes available
- Requires separate CSS file
- Theme switching via CSS file swap
- Large theme ecosystem

### Language Support

All three libraries support most popular languages. Shiki's language support comes from TextMate grammars used in VS Code, meaning it gets updated as VS Code's language support improves.

### Use in Different Environments

**Static Site Generators (Astro, Next.js, Docusaurus):**
- **Shiki**: ⭐ Excellent choice - highlight at build time for optimal performance
- **Prism.js**: ✅ Good - works well but less accurate
- **Highlight.js**: ✅ Good - works well for blogs

**Client-Side Highlighting:**
- **Shiki**: ⚠️ Possible but requires WASM initialization
- **Prism.js**: ⭐ Excellent - designed for this
- **Highlight.js**: ⭐ Excellent - designed for this with auto-detection

**Server-Side Rendering:**
- **Shiki**: ⭐ Excellent - works in any modern runtime
- **Prism.js**: ✅ Good - Node.js compatible
- **Highlight.js**: ✅ Good - Node.js compatible

**Edge Functions (Cloudflare Workers, Vercel Edge):**
- **Shiki**: ✅ Good - but needs special WASM handling
- **Prism.js**: ⭐ Excellent - no special requirements
- **Highlight.js**: ⭐ Excellent - no special requirements

## Migration Guide

### From Prism.js to Shiki

```js
// Before (Prism.js)
import Prism from 'prismjs'
const html = Prism.highlight(code, Prism.languages.javascript, 'javascript')

// After (Shiki)
import { codeToHtml } from 'shiki'
const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'github-dark'
})
```

**Key Differences:**
- Shiki is async (returns Promise)
- No need to import language grammars separately
- Inline styles instead of CSS classes
- No separate CSS file needed

### From Highlight.js to Shiki

```js
// Before (Highlight.js)
import hljs from 'highlight.js'
const result = hljs.highlightAuto(code)
const html = result.value

// After (Shiki)
import { codeToHtml } from 'shiki'
const html = await codeToHtml(code, {
  lang: 'javascript', // language must be specified
  theme: 'nord'
})
```

**Key Differences:**
- Must specify language explicitly (no auto-detection)
- Async operation
- Inline styles instead of CSS classes
- More accurate highlighting

## Choosing the Right Library

**Choose Shiki if:**
- ✅ You want VS Code-level highlighting accuracy
- ✅ You're building a static site or documentation
- ✅ You can highlight at build time
- ✅ You want themes to stay in sync with VS Code
- ✅ You prefer not maintaining separate CSS files

**Choose Prism.js if:**
- ✅ Bundle size is critical
- ✅ You need client-side highlighting
- ✅ You want a simple, lightweight solution
- ✅ You need extensive plugins
- ✅ You prefer CSS-based theming

**Choose Highlight.js if:**
- ✅ You need automatic language detection
- ✅ You want 250+ theme choices
- ✅ You're building a blog or content site
- ✅ You need zero-config setup
- ✅ You prefer CSS-based theming

## Conclusion

All three libraries are excellent choices for syntax highlighting, each with its own strengths:

- **Shiki** excels in accuracy and is perfect for static sites and documentation where build-time highlighting is possible
- **Prism.js** shines in bundle size and client-side flexibility, ideal for interactive applications
- **Highlight.js** is unmatched for ease of use and automatic language detection, great for content-heavy sites

Choose based on your project's specific requirements around accuracy, bundle size, runtime environment, and ease of use.