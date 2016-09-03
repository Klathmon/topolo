
module.exports = {
  build: {
    command: 'babel ./src --out-dir ./lib',
    env: {
      NODE_ENV: 'production'
    },
    dependencies: {
      before: 'clean',
      optionalBefore: 'test'
    }
  },
  test: {
    command: function (param) {
      return `nyc mocha ${(param === 'watch' ? '--watch' : '')} test/test.js`
    },
    env: {
      NODE_ENV: 'development'
    },
    dependencies: 'clean'
  },
  showCoverage: {
    command: 'http-server -p 8080 -c-1',
    dependencies: {
      before: 'opn',
      optionalBefore: 'test'
    }
  },
  clean: 'rimraf lib .nyc_output coverage',
  publish: 'echo "Not implemented yet..."',
  opn: 'opn http://localhost:8080'
}
