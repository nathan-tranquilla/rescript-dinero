open Calculator
open Equal

/**
 * Returns an isEven function.
 *
 * @param calculator - The calculator to use.
 *
 * @returns The isEven function.
 */
let isEven = (calculator: calculator<'amount>) => {
  let equalFn = equal(calculator)
  let zero = calculator.zero()
  let two = calculator.increment(calculator.increment(zero))

  (input: 'amount) => {
    equalFn(calculator.modulo(input, two), zero)
  }
}