
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
    command: (subtask) => `nyc mocha ${(subtask === 'watch' ? '--watch' : '')} test/test.js`,
    env: {
      BABEL_ENV: 'development',
      NODE_ENV: 'testing'
    },
    dependencies: 'clean'
  },
  showCoverage: {
    command: 'http-server ./coverage -p 8080 -c-1',
    dependencies: {
      before: 'opn:8080',
      optionalBefore: 'test'
    }
  },
  clean: 'rimraf lib .nyc_output coverage',
  publish: 'echo "Not implemented yet..."',
  opn: {
    command: (portNumber = 8080) => `opn http://localhost:${portNumber}`,
    dependencies: {
      optionalBefore: 'test'
    }
  }
}
