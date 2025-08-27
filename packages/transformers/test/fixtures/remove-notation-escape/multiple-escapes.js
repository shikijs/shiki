// [\!code highlight:1-5]
// [\!code focus:3]
// [\!code error-level:error]
export function complexFunction() {
  const result = "This line should be focused"

  // [\!code word:result]
  console.log(result)

  // [\!code diff:add]
  return result + " (modified)"
}
