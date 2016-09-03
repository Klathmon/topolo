
module.exports = {
  stringTask: 'echo "stringTask"',
  justCommandTask: {
    command: 'echo "justCommandTask"'
  },
  justSyncFunctionTest: {
    command: (param1) => `echo "justSyncFunctionTest ${param1}"`
  },
  justAsyncFunctionTest: {
    command: (param1) => Promise.resolve(`echo "justAsyncFunctionTest ${param1}"`)
  },
  dependencies1: {
    command: 'echo "dependencies1"',
    dependencies: 'stringTask'
  },
  beforeAndAfter1: {
    command: 'echo "dependencies1"',
    dependencies: {
      before: 'stringTask',
      after: 'justCommandTask'
    }
  },
  optDependencies1: {
    command: 'echo "optDependencies1"',
    dependencies: {
      optionalBefore: 'stringTask',
      optionalAfter: 'justCommandTask'
    }
  },
  anytimeDependencies: {
    command: 'echo "anytimeDependencies"',
    dependencies: {
      anytime: 'stringTask'
    }
  }
}
