open Calculator
open Dinero

type hasSubUnitsParams<'amount> = dinero<'amount>

let hasSubUnits = (calculator: calculator<'amount>) => {
  let equalFn = EqualUtil.equal(calculator)
  let computeBaseFn = ComputeBase.computeBase(calculator)
  
  (dineroObject: dinero<'amount>) => {
    let {amount, currency, scale} = dineroObject.toJSON()
    let base = computeBaseFn(currency.base)
    
    !equalFn(
      calculator.modulo(amount, calculator.power(base, scale)),
      calculator.zero()
    )
  }
}