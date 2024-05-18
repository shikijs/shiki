import { expect, it } from 'vitest'
import { measureFont } from '../src/measureFont'

globalThis.__BROWSER__ = false

it('measureFont with fontSize', async () => {
  const measurement = await measureFont(
    20,
    '"Lucida Console", Courier, monospace',
  )
  expect(measurement.width).toBeGreaterThan(0)
  expect(measurement.height).toBeGreaterThan(0)
  const measurement2 = await measureFont(
    -1,
    '"Lucida Console", Courier, monospace',
  )
  expect(measurement2.width).toBeGreaterThan(0)
  expect(measurement2.height).toBeGreaterThan(0)
})
