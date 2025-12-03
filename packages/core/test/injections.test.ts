import angularHtml from '@shikijs/langs/angular-html'
import angularTs from '@shikijs/langs/angular-ts'
import html from '@shikijs/langs/html'
import ts from '@shikijs/langs/typescript'
import vue from '@shikijs/langs/vue'
import vl from '@shikijs/themes/vitesse-light'
import { codeToHtml, createHighlighterCore, createJavaScriptRegexEngine } from 'shiki'
import { expect, it } from 'vitest'

// Basically we need to make sure that the syntax inside `v-if` and `{{}}` is highlighted correctly.
// This is done by a `vue-injections` patch that injects extra grammar into HTML.
it('vue-injections', async () => {
  const code = `
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div>
    <h1 v-if="count == 1 ? true : 'str'.toUpperCase()">{{ count * 2 }}</h1>
  </div>
</template>
`

  await expect(`${await codeToHtml(code, { lang: 'vue', theme: 'vitesse-dark' })}<style>html{color-scheme:dark}</style>`)
    .toMatchFileSnapshot('./out/vue-injections.html')
})

it('injections-side-effects vue', async () => {
  using highlighter = await createHighlighterCore({
    themes: [
      vl,
    ],
    langs: [
      html,
    ],
    engine: createJavaScriptRegexEngine(),
  })

  const code = `<h1 v-if="count == 1 ? true : 'str'.toUpperCase()">{{ count * 2 }}</h1>`

  const before = highlighter.codeToHtml(code, { lang: 'html', theme: 'vitesse-light' })
  await expect(before)
    .toMatchFileSnapshot('./out/injections-side-effects-vue-before.html')

  await highlighter.loadLanguage(vue)

  const after = highlighter.codeToHtml(code, { lang: 'vue', theme: 'vitesse-light' })
  await expect(after)
    .toMatchFileSnapshot('./out/injections-side-effects-vue-after.html')

  expect(before).not.toEqual(after)
})

it('injections-side-effects angular-html', async () => {
  using highlighter = await createHighlighterCore({
    themes: [
      vl,
    ],
    langs: [
      html,
    ],
    engine: createJavaScriptRegexEngine(),
  })

  const code = `<h2>Hero List</h2>

<p><em>Select a hero from the list to see details.</em></p>

@if (heroes.length > 0) {
  <ul>
    <li *ngFor="let hero of heroes">
      @let isSelected = hero === selectedHero;
      <button type="button" (click)="selectHero(hero)" [class.selected]="isSelected">
        {{hero.name}}
      </button>
    </li>
  </ul>
}

<app-hero-detail *ngIf="selectedHero" [hero]="selectedHero"></app-hero-detail>
`

  const before = highlighter.codeToHtml(code, { lang: 'html', theme: 'vitesse-light' })
  await expect(before)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-before.html')

  expect(highlighter.getLoadedLanguages())
    .toMatchInlineSnapshot(`
      [
        "javascript",
        "css",
        "html",
        "js",
        "cjs",
        "mjs",
      ]
    `)

  await highlighter.loadLanguage(angularHtml)

  const after = highlighter.codeToHtml(code, { lang: 'angular-html', theme: 'vitesse-light' })
  await expect(after)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-after.html')

  expect(highlighter.getLoadedLanguages())
    .toMatchInlineSnapshot(`
      [
        "javascript",
        "css",
        "html",
        "angular-expression",
        "angular-let-declaration",
        "angular-template",
        "angular-template-blocks",
        "angular-html",
        "js",
        "cjs",
        "mjs",
      ]
    `)

  expect(before).not.toEqual(after)
})

it('injections-side-effects angular-ts', async () => {
  using highlighter = await createHighlighterCore({
    themes: [
      vl,
    ],
    langs: [
      ts,
    ],
    engine: createJavaScriptRegexEngine(),
  })

  const code = `
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-button',
  standalone: true,
  imports: [RouterLink],
  template: \`
    <button
      type="button"
      [routerLink]="'/cart'"
    >
      @if (heroes.length > 0) {
        <ul>
          <li *ngFor="let hero of heroes">
            @let isSelected = hero === selectedHero;
            <button type="button" (click)="selectHero(hero)" [class.selected]="isSelected">
              {{hero.name}}
            </button>
          </li>
        </ul>
      }
      Cart
    </button>
  \`,
  styles: \`div {display: block;}\`,
})
export class CartButtonComponent {
  protected cartService = inject(CartService);
}
`

  const before = highlighter.codeToHtml(code, { lang: 'ts', theme: 'vitesse-light' })
  await expect(before)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-ts-before.html')

  await highlighter.loadLanguage(angularTs)

  const after = highlighter.codeToHtml(code, { lang: 'angular-ts', theme: 'vitesse-light' })
  await expect(after)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-ts-after.html')

  expect(before).not.toEqual(after)
})
