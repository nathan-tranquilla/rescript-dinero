type comparisonOperator = 
  | LT // -1
  | EQ // 0  
  | GT // 1

type calculator<'tInput> = {
  add: ('tInput, 'tInput) => 'tInput,
  compare: ('tInput, 'tInput) => comparisonOperator,
  decrement: 'tInput => 'tInput,
  integerDivide: ('tInput, 'tInput) => 'tInput,
  increment: 'tInput => 'tInput,
  modulo: ('tInput, 'tInput) => 'tInput,
  multiply: ('tInput, 'tInput) => 'tInput,
  power: ('tInput, 'tInput) => 'tInput,
  subtract: ('tInput, 'tInput) => 'tInput,
  zero: unit => 'tInput,
}