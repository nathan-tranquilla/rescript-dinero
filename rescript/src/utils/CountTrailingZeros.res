open Calculator
open Equal

/**
 * Counts trailing zeros in a number with the given base.
 *
 * @param calculator - The calculator to use.
 *
 * @returns The countTrailingZeros function.
 */
let countTrailingZeros = (calculator: calculator<'amount>) => {
  let equalFn = equal(calculator)

  (input: 'amount, base: 'amount) => {
    let zero = calculator.zero()

    if equalFn(zero, input) {
      calculator.zero()
    } else {
      let rec loop = (temp: 'amount, i: 'amount) => {
        if equalFn(calculator.modulo(temp, base), zero) {
          loop(calculator.integerDivide(temp, base), calculator.increment(i))
        } else {
          i
        }
      }
      loop(input, zero)
    }
  }
}