export function traverseGrammarPatterns(a: any, callback: (pattern: string) => any | void): void {
  if (Array.isArray(a)) {
    a.forEach((j: any) => {
      traverseGrammarPatterns(j, callback)
    })
    return
  }
  if (!a || typeof a !== 'object')
    return

  if (a.foldingStartMarker) {
    const pattern = callback(a.foldingStartMarker)
    if (pattern != null)
      a.foldingStartMarker = pattern
  }
  if (a.foldingStopMarker) {
    const pattern = callback(a.foldingStopMarker)
    if (pattern != null)
      a.foldingStopMarker = pattern
  }
  if (a.firstLineMatch) {
    const pattern = callback(a.firstLineMatch)
    if (pattern != null)
      a.firstLineMatch = pattern
  }
  if (a.match) {
    const pattern = callback(a.match)
    if (pattern != null)
      a.match = pattern
  }
  if (a.begin) {
    const pattern = callback(a.begin)
    if (pattern != null)
      a.begin = pattern
  }
  if (a.end) {
    const pattern = callback(a.end)
    if (pattern != null)
      a.end = pattern
  }
  if (a.while) {
    const pattern = callback(a.while)
    if (pattern != null)
      a.while = pattern
  }
  if (a.patterns) {
    traverseGrammarPatterns(a.patterns, callback)
  }
  if (a.captures) {
    traverseGrammarPatterns(Object.values(a.captures), callback)
  }
  if (a.beginCaptures) {
    traverseGrammarPatterns(Object.values(a.beginCaptures), callback)
  }
  if (a.endCaptures) {
    traverseGrammarPatterns(Object.values(a.endCaptures), callback)
  }
  if (a.injections) {
    traverseGrammarPatterns(Object.values(a.injections), callback)
  }
  Object.values(a.repository || {}).forEach((j: any) => {
    traverseGrammarPatterns(j, callback)
  })
}
