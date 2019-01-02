export { getTheme, loadTheme } from 'shiki-themes'

export { getHighlighter } from './highlighter';
export { renderToHtml } from './renderer';
export { IThemedToken } from './themedTokenizer';

const shiki = require('shiki')

shiki.getHighlighter({
  theme: 'nord'
}).then(highlighter => {
  console.log(highlighter.codeToHtml(`console.log('shiki');`, 'js'))
})

// <pre class="shiki" style="background-color: #2e3440"><code>
//   <!-- Highlighted Code -->
// </code></pre