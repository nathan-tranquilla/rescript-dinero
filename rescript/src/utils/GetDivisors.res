open Calculator

/**
 * Gets divisors for bases array.
 *
 * @param calculator - The calculator to use.
 *
 * @returns The getDivisors function.
 */
let getDivisors = (calculator: calculator<'amount>) => {
  (bases: array<'amount>) => {
    Js.Array.mapi((_, i) => {
      let slice = Js.Array.sliceFrom(i, bases)
      Js.Array.reduce((acc, curr) => calculator.multiply(acc, curr), slice[0], slice)
    }, bases)
  }
}