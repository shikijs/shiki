async function go() {
  document.getElementById('palenight').innerHTML = (await (await fetch('/palenight')).text())
  document.getElementById('solarized').innerHTML = (await (await fetch('/solarized')).text())
}
go()
