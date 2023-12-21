<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlayground } from '../store/playground'

const play = usePlayground()
const showModel = ref(false)

function preview(id: string) {
  play.lang = id
  showModel.value = true
}

const bundle = ref('all')

const langs = computed(() => {
  if (bundle.value === 'web')
    return play.bundledLangsWeb
  return play.bundledLangsFull
})
</script>

<template>
  <div>
    <div flex="~ gap-0.5 items-center">
      <input id="radio-all" v-model="bundle" type="radio" name="lang" value="all">
      <label for="radio-all">Full Bundle</label>
      <div mx2 />
      <input id="radio-web" v-model="bundle" type="radio" name="lang" value="web">
      <label for="radio-web">Web Bundle</label>
      <div mx2 />
      <a href="/guide/bundles">?</a>
    </div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Alias</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="l in langs" :key="l.id">
          <td>{{ l.name }}</td>
          <td><code>{{ l.id }}</code></td>
          <td>
            <code v-for="alias in l.aliases" :key="alias">{{ alias }}</code>
          </td>
          <td>
            <div flex>
              <button
                title="Preview Example"
                ma text-lg
                @click="preview(l.id)"
              >
                <div i-carbon:code />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showModel" fixed inset-0 z-100 flex items-center justify-center>
      <div bg-black:50 absolute inset-0 backdrop-blur-sm @click="showModel = false" />
      <ShikijiMiniPlayground max-h-80vh w-full md:w-150 lg:w-200 />
    </div>
  </div>
</template>
