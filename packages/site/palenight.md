```html
<div id="palenight"></div>

<script>
async function go() {
  document.getElementById('palenight').innerHTML = (await (await fetch('/palenight')).text())
}
</script>
```