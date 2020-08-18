import { measureMonospaceTypeface } from '../measureMonospaceTypeface'

test('Can measure typeface accurately', async () => {
  const measurement = await measureMonospaceTypeface('Courier', 16)

  // width should be roughly 9.6
  expect(measurement.width > 9 && measurement.width < 10).toBeTruthy()

  // height should be roughly 13.8
  expect(measurement.height > 13 && measurement.height < 14).toBeTruthy()
})
