open Calculator
open IsArray

/**
 * Computes the base value from either a single amount or array of amounts.
 *
 * @param calculator - The calculator to use.
 *
 * @returns The computeBase function.
 */
let computeBase = (calculator: calculator<'amount>) => {
  (base: 'amount) => {
    // In ReScript, we need to handle this differently since we don't have union types
    // This function signature assumes base is always a single amount
    // If we need array support, we'd need a separate function
    base
  }
}

/**
 * Computes the base value from an array of amounts.
 *
 * @param calculator - The calculator to use.
 *
 * @returns The computeBaseArray function.
 */
let computeBaseArray = (calculator: calculator<'amount>) => {
  (baseArray: array<'amount>): 'amount => {
    switch baseArray[0] {
      | Some(first) => Js.Array.reduce((acc, curr) => calculator.multiply(acc, curr), first, baseArray)
      | None => JsError.throwWithMessage("baseArray is empty")
    }
    
  }
}