<script setup lang="ts">
import { computed } from 'vue'
import { usePlayground } from '../store/playground'

const play = usePlayground()
const currentThemeType = computed(() => play.allThemes.find(i => i.id === play.theme)?.type || 'inherit')
</script>

<template>
  <div class="language-ts vp-adaptive-theme mini-playground" shadow :style="[play.preStyle, { colorScheme: currentThemeType }]">
    <div absolute z-10 p2 px3 pl5 flex="~ gap-1 items-center" left-0 top-0 right-0 border="b-solid gray/5">
      <div i-carbon:chevron-down op50 />
      <select v-model="play.lang" font-mono :style="play.preStyle">
        <option v-for="lang in play.allLanguages" :key="lang.id" :value="lang.id">
          {{ lang.name }}
        </option>
      </select>
      <div i-carbon:chevron-down op50 />
      <select v-model="play.theme" font-mono :style="play.preStyle">
        <option v-for="theme in play.allThemes.filter(i => i.type === 'light')" :key="theme.id" :value="theme.id">
          {{ theme.name }}
        </option>
        <option disabled>
          ──────────
        </option>
        <option v-for="theme in play.allThemes.filter(i => i.type === 'dark')" :key="theme.id" :value="theme.id">
          {{ theme.name }}
        </option>
      </select>
      <div flex-auto />
      <div v-if="play.isLoading" svg-spinners:270-ring />
      <div op50 text-xs mr-2>
        Playground
      </div>
      <button title="Randomize" hover="bg-gray/10" p1 rounded @click="play.randomize">
        <div i-carbon:shuffle op50 />
      </button>
    </div>
    <span v-html="play.output" />
  </div>
</template>

<style>
.mini-playground pre {
  padding-top: 3.5em !important;
  min-height: 20em !important;
}
.mini-playground select {
  background: transparent;
  color: inherit;
  min-width: 8em;
  padding: 0 !important;
  position: relative;
}
.mini-playground select:focus {
  outline: none;
}

.mini-playground select:before {
  content: '';
  position: absolute;
  width: 1em;
  height: 1em;
  background: red;
}
</style>
