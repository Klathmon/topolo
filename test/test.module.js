module.exports = {
  'showCoverage': {
    'command': 'simplehttpserver coverage',
    'before': [
      'opn'
    ],
    'optionalBefore': [
      'test'
    ]
  },
  'test': {
    'command': 'nyc mocha $1 test/test.js',
    'defaultValues': [
      ''
    ],
    'env': {
      'NODE_ENV': 'test'
    },
    'before': [
      'clean'
    ],
    'optionalAfter': [
      'opn'
    ]
  },
  'build': {
    'command': 'webpack',
    'env': {
      'NODE_ENV': 'production'
    },
    'before': [
      'clean'
    ]
  },
  'publish': {
    'command': 'np $1',
    'defaultValues': [
      'patch'
    ],
    'before': [
      'clean'
    ]
  },
  'clean': {
    'command': 'rimraf dist .nyc_output coverage'
  },
  'opn': {
    'command': 'opn http://localhost:8000'
  }
}
