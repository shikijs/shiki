async function go() {
  const palenightHtml = await (await fetch(
    '/palenight'
  )).text()
  document
    .getElementById('palenight')
    .innerHTML = palenightHtml

  const solarizedHtml = await (await fetch(
    '/solarized'
  )).text()
  document
    .getElementById('solarized')
    .innerHTML = solarizedHtml

  const svelteHtml = await (await fetch(
    '/svelte'
  )).text()
  document
    .getElementById('svelte')
    .innerHTML = svelteHtml
}
go()
