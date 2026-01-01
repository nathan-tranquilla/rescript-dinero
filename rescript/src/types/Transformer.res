// External currency type (placeholder for now)
type currency<'tAmount> = 'tAmount

type transformerOptions<'tAmount, 'tValue> = {
  value: 'tValue,
  currency: currency<'tAmount>,
}

type transformer<'tAmount, 'tOutput, 'tValue> = transformerOptions<'tAmount, 'tValue> => 'tOutput