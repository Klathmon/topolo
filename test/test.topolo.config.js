
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
  },
  paramDependencies: {
    command: 'echo "anytimeDependencies"',
    dependencies: {
      before: ['justSyncFunctionTest:param1'],
      after: ['justSyncFunctionTest:param2']
    }
  },
  cyclical1: {
    command: 'echo "cyclical1"',
    dependencies: {
      before: ['cyclical1']
    }
  },
  cyclical2: {
    command: 'echo "cyclical2"',
    dependencies: {
      before: ['cyclical3']
    }
  },
  cyclical3: {
    command: 'echo "cyclical3"',
    dependencies: {
      before: ['cyclical2']
    }
  }
}
