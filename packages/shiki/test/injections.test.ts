import { codeToHtml, createHighlighterCore } from 'shiki'
import { expect, it } from 'vitest'
import angularHtml from '../src/langs/angular-html.mjs'
import angularTs from '../src/langs/angular-ts.mjs'
import html from '../src/langs/html.mjs'
import ts from '../src/langs/typescript.mjs'
import vue from '../src/langs/vue.mjs'
import vl from '../src/themes/vitesse-light.mjs'

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

  expect(`${await codeToHtml(code, { lang: 'vue', theme: 'vitesse-dark' })}<style>html{color-scheme:dark}</style>`)
    .toMatchFileSnapshot('./out/vue-injections.html')
})

it('injections-side-effects vue', async () => {
  const highlighter = await createHighlighterCore({
    themes: [
      vl,
    ],
    langs: [
      html,
    ],
  })

  const code = `<h1 v-if="count == 1 ? true : 'str'.toUpperCase()">{{ count * 2 }}</h1>`

  const before = highlighter.codeToHtml(code, { lang: 'html', theme: 'vitesse-light' })
  expect(before)
    .toMatchFileSnapshot('./out/injections-side-effects-vue-before.html')

  await highlighter.loadLanguage(vue)

  const after = highlighter.codeToHtml(code, { lang: 'vue', theme: 'vitesse-light' })
  expect(after)
    .toMatchFileSnapshot('./out/injections-side-effects-vue-after.html')

  expect(before).not.toEqual(after)
})

it('injections-side-effects angular-html', async () => {
  const highlighter = await createHighlighterCore({
    themes: [
      vl,
    ],
    langs: [
      html,
    ],
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
  expect(before)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-before.html')

  await expect(highlighter.getLoadedLanguages())
    .toMatchInlineSnapshot(`
      [
        "javascript",
        "css",
        "html",
        "js",
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
      ]
    `)

  expect(before).not.toEqual(after)
})

it('injections-side-effects angular-ts', async () => {
  const highlighter = await createHighlighterCore({
    themes: [
      vl,
    ],
    langs: [
      ts,
    ],
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
  expect(before)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-ts-before.html')

  await highlighter.loadLanguage(angularTs)

  const after = highlighter.codeToHtml(code, { lang: 'angular-ts', theme: 'vitesse-light' })
  expect(after)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-ts-after.html')

  expect(before).not.toEqual(after)
})
