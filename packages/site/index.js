async function go() {
  const urlAndIds = [
    ['/palenight', 'palenight'],
    ['/mono', 'mono'],
    ['/rockstar', 'rockstar'],
    ['/文言', '文言'],
    ['/svg.svg', 'svg']
  ]

  for (let [url, id] of urlAndIds) {
    await getHtmlAndReplace(url, id)
  }
}

async function getHtmlAndReplace(url, elementId) {
  const targetHtml = await (await fetch(url)).text()
  document.getElementById(elementId).innerHTML = targetHtml
}

go()
