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
}
go()