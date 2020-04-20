export const maximumTests = [
  {
    description: 'maximum validation',
    schema: { maximum: 3.0 },
    tests: [
      {
        description: 'below the maximum is valid',
        data: 2.6,
        valid: true
      },
      {
        description: 'above the maximum is invalid',
        data: 3.5,
        valid: false
      },
      {
        description: 'ignores non-numbers',
        data: 'x',
        valid: true
      }
    ]
  },
  {
    description: 'exclusiveMaximum validation',
    schema: {
      maximum: 3.0,
      exclusiveMaximum: true
    },
    tests: [
      {
        description: 'below the maximum is still valid',
        data: 2.2,
        valid: true
      },
      {
        description: 'boundary point is invalid',
        data: 3.0,
        valid: false
      }
    ]
  }
]
