/**
 *
 * @param {Array<string>} [strings=["()"]] - description
 *        Y     P      PY Y        P BB PY @colors
 * note: the colored () inside the string in the default bracket
 * there is not enough context from the scopes to do otherwise
 * this matches VSCode behavior
 * @returns {string[]}
 *          Y      PPY @colors
 */
function reverse(strings: string[]) {
  //            Y               PPY Y @colors
  return strings.reverse();
  //                    PP @colors
}
// @colors 0=Y
