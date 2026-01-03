open ScaledAmount

/**
 * Checks if a value is a ScaledAmount.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a ScaledAmount.
 */
let isScaledAmount = (value: 'amount) => {
  // In ReScript, we need to handle this type checking differently
  // This is a simplified version - the actual implementation would depend on the runtime representation
  switch Js.Types.classify(value) {
  | Js.Types.JSObject(_) => 
    %raw(`value && typeof value === 'object' && 'amount' in value`)
  | _ => false
  }
}