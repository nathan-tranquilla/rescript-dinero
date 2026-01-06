open Calculator
open IsArray

/**
 * Represents either a single value or an array of values
 */
type maybeArray<'a> = Single('a) | Array(array<'a>)

/**
 * Computes the base value from either a single amount or array of amounts.
 *
 * @param calculator - The calculator to use.
 *
 * @returns The computeBase function.
 */
let computeBase = (calculator: calculator<'amount>) => {
  (base: maybeArray<'amount>) => {
    switch base {
    | Single(value) => value
    | Array(baseArray) => {
        switch baseArray[0] {
        | Some(first) => {
            let rest = Js.Array.sliceFrom(1, baseArray)
            Js.Array.reduce((acc, curr) => calculator.multiply(acc, curr), first, rest)
          }
        | None => JsError.throwWithMessage("baseArray is empty")
        }
      }
    }
  }
}

/**
 * Helper function to create MaybeArray from a value that could be single or array
 * This handles the dynamic typing from JavaScript values
 */
let fromValue = (value: 'a): maybeArray<'b> => {
  if isArray(value) {
    Array((Obj.magic(value): array<'b>))
  } else {
    Single((Obj.magic(value): 'b))
  }
}