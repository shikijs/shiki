/**
 * Example demonstrating how to handle embedded languages in fine-grained bundles
 * This addresses issue #1039: https://github.com/shikijs/shiki/issues/1039
 */

import { 
  createHighlighterCore, 
  createSingletonShorthands, 
  createdBundledHighlighter, 
  guessEmbeddedLanguages 
} from '@shikijs/core'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'

const markdownCode = `
# Markdown Example

\`\`\`javascript
console.log("Hello from JavaScript!")
\`\`\`

\`\`\`python
print("Hello from Python!")
\`\`\`

\`\`\`html
<div class="example">
  <h1>Hello from HTML!</h1>
</div>
\`\`\`
`

// ============================================================================
// Solution 1: Manually Load All Expected Languages
// ============================================================================
async function solution1_manualLoad() {
  console.log('\n=== Solution 1: Manually Load All Expected Languages ===\n')
  
  const highlighter = await createHighlighterCore({
    themes: [import('@shikijs/themes/nord')],
    langs: [
      // Load markdown AND all languages you expect to use in code blocks
      import('@shikijs/langs/markdown'),
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/python'),
      import('@shikijs/langs/html'),
    ],
    engine: createOnigurumaEngine(import('shiki/wasm'))
  })

  const html = highlighter.codeToHtml(markdownCode, {
    lang: 'markdown',
    theme: 'nord'
  })

  console.log('Loaded languages:', highlighter.getLoadedLanguages())
  console.log('HTML output length:', html.length)
  console.log('✓ All embedded languages are highlighted')
}

// ============================================================================
// Solution 2: Dynamically Detect and Load Embedded Languages
// ============================================================================
async function solution2_dynamicLoad() {
  console.log('\n=== Solution 2: Dynamically Detect and Load Embedded Languages ===\n')
  
  const highlighter = await createHighlighterCore({
    themes: [import('@shikijs/themes/nord')],
    langs: [
      // Initially only load markdown
      import('@shikijs/langs/markdown'),
    ],
    engine: createOnigurumaEngine(import('shiki/wasm'))
  })

  console.log('Initially loaded languages:', highlighter.getLoadedLanguages())

  // Detect which languages are used in the markdown
  const embeddedLangs = guessEmbeddedLanguages(markdownCode, 'markdown', highlighter)
  console.log('Detected embedded languages:', embeddedLangs)

  // Dynamically load only the languages that are actually used
  await Promise.all(
    embeddedLangs.map(lang => 
      highlighter.loadLanguage(import(`@shikijs/langs/${lang}`))
    )
  )

  console.log('After dynamic loading:', highlighter.getLoadedLanguages())

  const html = highlighter.codeToHtml(markdownCode, {
    lang: 'markdown',
    theme: 'nord'
  })

  console.log('HTML output length:', html.length)
  console.log('✓ Only used embedded languages are loaded dynamically')
}

// ============================================================================
// Solution 3: Create Custom Shorthands with Auto-Loading (Recommended)
// ============================================================================
async function solution3_customShorthands() {
  console.log('\n=== Solution 3: Custom Shorthands with Auto-Loading (Recommended) ===\n')
  
  // Define your custom bundle with the languages you want to support
  const bundledLanguages = {
    'javascript': () => import('@shikijs/langs/javascript'),
    'typescript': () => import('@shikijs/langs/typescript'),
    'python': () => import('@shikijs/langs/python'),
    'html': () => import('@shikijs/langs/html'),
    'css': () => import('@shikijs/langs/css'),
    'markdown': () => import('@shikijs/langs/markdown'),
    // Add more languages as needed
  }

  const bundledThemes = {
    'nord': () => import('@shikijs/themes/nord'),
    'vitesse-dark': () => import('@shikijs/themes/vitesse-dark'),
  }

  // Create a custom highlighter factory
  const createHighlighter = createdBundledHighlighter({
    langs: bundledLanguages,
    themes: bundledThemes,
    engine: () => createOnigurumaEngine(import('shiki/wasm'))
  })

  // Create shorthands with automatic embedded language detection
  const { codeToHtml, getSingletonHighlighter } = createSingletonShorthands(
    createHighlighter,
    { 
      // This is the key: pass guessEmbeddedLanguages to enable auto-loading
      guessEmbeddedLanguages 
    }
  )

  // Check initial state
  const initialHighlighter = await getSingletonHighlighter()
  console.log('Initially loaded languages:', initialHighlighter.getLoadedLanguages())

  // Now you can use codeToHtml like the bundle presets!
  // Embedded languages will be detected and loaded automatically
  const html = await codeToHtml(markdownCode, {
    lang: 'markdown',
    theme: 'nord'
  })

  // Check what was loaded
  const finalHighlighter = await getSingletonHighlighter()
  console.log('After codeToHtml:', finalHighlighter.getLoadedLanguages())
  console.log('HTML output length:', html.length)
  console.log('✓ Embedded languages auto-loaded seamlessly!')
}

// ============================================================================
// Run All Examples
// ============================================================================
async function main() {
  console.log('='.repeat(80))
  console.log('Demonstrating Solutions for Issue #1039')
  console.log('Sub-grammars for markdown not loaded in fine-grained bundles')
  console.log('='.repeat(80))

  try {
    await solution1_manualLoad()
    await solution2_dynamicLoad()
    await solution3_customShorthands()
    
    console.log('\n' + '='.repeat(80))
    console.log('All solutions demonstrated successfully!')
    console.log('='.repeat(80))
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
