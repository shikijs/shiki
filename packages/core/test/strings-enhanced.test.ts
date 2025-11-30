import { describe, expect, it } from 'vitest'
import { guessEmbeddedLanguages, splitLines } from '../src/utils'

describe('enhanced string utils', () => {
  describe('splitLines edge cases', () => {
    it('handles empty string', () => {
      const result = splitLines('', false)
      expect(result).toEqual([['', 0]])

      const resultWithEnding = splitLines('', true)
      expect(resultWithEnding).toEqual([['', 0]])
    })

    it('handles single line without newline', () => {
      const result = splitLines('hello world', false)
      expect(result).toEqual([['hello world', 0]])
    })

    it('handles different line endings', () => {
      // Unix style \n
      const unix = splitLines('line1\nline2', true)
      expect(unix).toEqual([
        ['line1\n', 0],
        ['line2', 6],
      ])

      // Windows style \r\n
      const windows = splitLines('line1\r\nline2', true)
      expect(windows).toEqual([
        ['line1\r\n', 0],
        ['line2', 7],
      ])
    })

    it('preserves offsets correctly for multiline code', () => {
      const code = 'abc\ndef\nghi'
      const result = splitLines(code, false)
      expect(result[0][1]).toBe(0) // 'abc' starts at 0
      expect(result[1][1]).toBe(4) // 'def' starts at 4 (after 'abc\n')
      expect(result[2][1]).toBe(8) // 'ghi' starts at 8 (after 'abc\ndef\n')
    })
  })

  describe('guessEmbeddedLanguages enhanced', () => {
    it('detects languages from Vue SFC with double quotes', () => {
      const code = '<template lang="pug"></template><script lang="typescript"></script>'
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('pug')
      expect(langs).toContain('typescript')
    })

    it('detects languages from Vue SFC with single quotes', () => {
      const code = '<template lang=\'pug\'></template><script lang=\'ts\'></script>'
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('pug')
      expect(langs).toContain('ts')
    })

    it('detects languages with colon prefix (Vue v-bind)', () => {
      const code = '<component :lang="javascript"></component>'
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('javascript')
    })

    it('detects languages from markdown code blocks', () => {
      const code = '```typescript\nconst x = 1\n```\n\n~~~python\nprint("hi")\n~~~'
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('typescript')
      expect(langs).toContain('python')
    })

    it('detects languages from LaTeX environments', () => {
      const code = '\\begin{equation}\\end{equation}\\begin{align}\\end{align}'
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('equation')
      expect(langs).toContain('align')
    })

    it('detects languages from script type attribute', () => {
      const code = '<script type="text/javascript">alert("hi")</script>'
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('javascript')
    })

    it('detects languages from script type with application/ prefix', () => {
      const code = '<script type="application/typescript">const x = 1</script>'
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('typescript')
    })

    it('normalizes languages to lowercase', () => {
      const code = '<script lang="TypeScript"></script>```JavaScript\ncode\n```'
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('typescript')
      expect(langs).toContain('javascript')
    })

    it('handles empty code', () => {
      const langs = guessEmbeddedLanguages('', undefined)
      expect(langs).toEqual([])
    })

    it('returns unique languages only', () => {
      const code = '```js\n```\n```js\n```\n```javascript\n```'
      const langs = guessEmbeddedLanguages(code, undefined)
      const jsCount = langs.filter(l => l === 'js').length
      const javascriptCount = langs.filter(l => l === 'javascript').length
      // Should only appear once each
      expect(jsCount).toBe(1)
      expect(javascriptCount).toBe(1)
    })

    it('handles mixed case and whitespace', () => {
      const code = '<script lang="  TypeScript  "></script>'
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('typescript')
    })

    it('handles complex Vue SFC', () => {
      const code = `
        <template lang="pug">
          div Hello
        </template>
        <script lang="ts">
          const x = 1
        </script>
        <style lang="scss">
          .test { color: red; }
        </style>
      `
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('pug')
      expect(langs).toContain('ts')
      expect(langs).toContain('scss')
    })

    it('handles markdown with multiple code blocks', () => {
      const code = `
# Title

\`\`\`typescript
const foo = 'bar'
\`\`\`

\`\`\`javascript  
const baz = 'qux'
\`\`\`

~~~python
print("hello")
~~~
      `
      const langs = guessEmbeddedLanguages(code, undefined)
      expect(langs).toContain('typescript')
      expect(langs).toContain('javascript')
      expect(langs).toContain('python')
    })
  })
})
