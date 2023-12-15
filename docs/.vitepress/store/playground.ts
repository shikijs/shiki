/// <reference types="vite/client" />

import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BuiltinLanguage, BuiltinTheme } from 'shikiji'
import { useLocalStorage } from '@vueuse/core'
import { ref, watch } from 'vue'

export const usePlayground = defineStore('playground', () => {
  const lang = useLocalStorage<BuiltinLanguage>('shikiji-playground-lang', 'typescript')
  const theme = useLocalStorage<BuiltinTheme>('shikiji-playground-theme', 'vitesse-dark')
  const allThemes = ref<BuiltinTheme[]>([])
  const allLanguages = ref<BuiltinLanguage[]>([])
  const input = ref('console.log(\'Hello World\')')
  const output = ref('<pre></pre>')
  const preStyle = ref('')
  const isLoading = ref(true)

  if (typeof window !== 'undefined') {
    import('shikiji').then(async ({ getHighlighter, addClassToHast, bundledLanguages, bundledThemes }) => {
      const highlighter = await getHighlighter({
        themes: [theme.value],
        langs: ['typescript', 'javascript', 'json', 'html', 'css', 'markdown', lang.value as any],
      })

      const samples = Object.fromEntries(
        Array.from(
          Object.entries(import.meta.glob('../../node_modules/shiki/samples/*.sample', {
            exhaustive: true,
            as: 'raw',
          })),
        ).map(([path, load]) => [path.split(/\//).pop()!.split(/\./).shift()!, load]),
      )

      allThemes.value = Object.keys(bundledThemes) as any
      allLanguages.value = Object.keys(bundledLanguages) as any

      watch(input, run, { immediate: true })

      watch([lang, theme], async () => {
        isLoading.value = true
        await Promise.all([
          highlighter.loadTheme(theme.value),
          highlighter.loadLanguage(lang.value as any),
        ])
        const grammar = highlighter.getLangGrammar(lang.value) as any
        const sample = await samples[grammar?._grammar?.name || lang.value]?.()
        if (sample)
          input.value = sample.replace(/\n.*?From.*?$/im, '').trim()
        run()
      }, { immediate: true })

      function run() {
        output.value = highlighter.codeToHtml(input.value, {
          lang: lang.value,
          theme: theme.value,
          transformers: [
            {
              pre(node) {
                addClassToHast(node, 'vp-code')
                preStyle.value = node.properties?.style as string || ''
              },
            },
          ],
        })
        isLoading.value = false
      }
    })
  }

  return {
    lang,
    theme,
    allLanguages,
    allThemes,
    input,
    output,
    isLoading,
    preStyle,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayground, import.meta.hot))
