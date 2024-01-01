export function separateContinuousSpaces(inputs: string[]) {
  const result: string[] = []
  let current = ''

  function bump() {
    if (current.length)
      result.push(current)
    current = ''
  }

  inputs.forEach((part, idx) => {
    if (isTab(part)) {
      bump()
      result.push(part)
    }
    else if (isSpace(part) && (isSpace(inputs[idx - 1]) || isSpace(inputs[idx + 1]))) {
      bump()
      result.push(part)
    }
    else {
      current += part
    }
  })

  bump()

  return result
}

export function isTab(part: string) {
  return part === '\t'
}

export function isSpace(part: string) {
  return part === ' ' || part === '\t'
}

export function splitSpaces(
  parts: string[],
  type: 'all' | 'boundary' | 'trailing',
  renderContinuousSpaces = true,
) {
  if (type === 'all')
    return parts
  let leftCount = 0
  let rightCount = 0
  if (type === 'boundary') {
    for (let i = 0; i < parts.length; i++) {
      if (isSpace(parts[i]))
        leftCount++
      else
        break
    }
  }
  if (type === 'boundary' || type === 'trailing') {
    for (let i = parts.length - 1; i >= 0; i--) {
      if (isSpace(parts[i]))
        rightCount++
      else
        break
    }
  }

  const middle = parts.slice(leftCount, parts.length - rightCount)

  return [
    ...parts.slice(0, leftCount),
    ...(renderContinuousSpaces
      ? separateContinuousSpaces(middle)
      : [middle.join('')]),
    ...parts.slice(parts.length - rightCount),
  ]
}
