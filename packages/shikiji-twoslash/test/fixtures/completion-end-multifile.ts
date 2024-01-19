// @noErrors
// @filename: foo.ts
const foo = "foo"
export { foo }
 
// @filename: index.ts
// ---cut---
import { foo } from './foo'
 
type Example = {
  name: 'foo' | 'bar' | 'baz'
}
 
const example: Example = { name: 'foo' }
example.name === '   
//                ^|
