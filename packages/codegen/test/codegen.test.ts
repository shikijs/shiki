import { expect, it } from 'vitest'
import { codegen } from '../src'

it('should work', async () => {
  const langs = ['javascript', 'ts', 'tsx'] as const
  const themes = ['nord', 'vitesse-dark'] as const

  await expect((await codegen({
    langs,
    themes,
    engine: 'oniguruma',
  })).code)
    .toMatchFileSnapshot('./__snapshots__/basic-oniguruma.ts')

  await expect((await codegen({
    langs,
    themes,
    typescript: false,
    engine: 'oniguruma',
  })).code)
    .toMatchFileSnapshot('./__snapshots__/basic-oniguruma-js.js')

  await expect((await codegen({
    langs,
    themes,
    engine: 'javascript-raw',
    precompiled: true,
    shorthands: false,
  })).code)
    .toMatchFileSnapshot('./__snapshots__/basic-precompiled.ts')

  const webWorker = await codegen({
    langs,
    themes,
    engine: 'javascript-raw',
    precompiled: true,
    worker: 'web',
    workerPath: './web.worker.ts',
  })
  await expect(webWorker.code)
    .toMatchFileSnapshot('./__snapshots__/web.worker.ts')
  await expect(webWorker.host)
    .toMatchFileSnapshot('./__snapshots__/web.host.ts')

  const nodeWorker = await codegen({
    langs,
    themes,
    typescript: false,
    engine: 'javascript-raw',
    precompiled: true,
    worker: 'node',
    workerPath: './node.worker.js',
  })
  await expect(nodeWorker.code)
    .toMatchFileSnapshot('./__snapshots__/node.worker.js')
  await expect(nodeWorker.host)
    .toMatchFileSnapshot('./__snapshots__/node.host.js')
})
