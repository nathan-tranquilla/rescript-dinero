open ScaledAmount
open IsScaledAmount

/**
 * Extracts amount and scale from a value.
 *
 * @param value - The value to extract from.
 * @param zero - The zero value to use as default scale.
 *
 * @returns An object with amount and scale.
 */
let getAmountAndScale = (value: 'amount, zero: 'amount) => {
  // In ReScript, handling union types requires a different approach
  // This is a simplified implementation
  if isScaledAmount(value) {
    let scaledValue = %raw(`value`)
    {
      \"amount": scaledValue["amount"]->Option.getOr(0),
      \"scale": switch scaledValue["scale"] {
      | Some(scale) => scale
      | None => zero
      }
    }
  } else {
    {
      \"amount": value,
      \"scale": zero
    }
  }
}