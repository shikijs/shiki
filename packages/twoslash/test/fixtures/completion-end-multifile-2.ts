// @noErrors
// @filename: foo.ts
const foo = "foo"
export { foo }

// @filename: index.ts
// ---cut---
import { foo } from './foo'

console.e 
//       ^|