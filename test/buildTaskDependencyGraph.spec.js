import { resolve } from 'path'
import { expect } from 'chai'
import {
  DEPENDENCIES_KEY,
  BEFORE_KEY,
  OPTIONAL_BEFORE_KEY,
  AFTER_KEY,
  OPTIONAL_AFTER_KEY,
  ANYTIME_KEY
} from '../src/configKeys'
import expandConfig from '../src/expandConfig'
import buildRequiredTaskList from '../src/buildRequiredTaskList'
import buildTaskDependencyGraph from '../src/buildTaskDependencyGraph'

describe('buildTaskDependencyGraph.js', function () {
  let tasks
  beforeEach(function () {
    const testConfigPath = resolve(__dirname, 'test.topolo.config.js')
    delete require.cache[require.resolve(testConfigPath)]
    tasks = expandConfig(require(testConfigPath))
  })

  it(`hoists all ${BEFORE_KEY}/${AFTER_KEY} dependencies to the "${DEPENDENCIES_KEY}" key`, function () {
    const taskNameSet = buildRequiredTaskList(tasks, ['beforeAndAfter1'])
    const taskDepGraph = buildTaskDependencyGraph(tasks, taskNameSet)
    expect(Object.keys(taskDepGraph)).to.have.length(3)
    expect(taskDepGraph)
      .to.have.property('justCommandTask')
      .that.has.property(DEPENDENCIES_KEY)
      .that.has.property('0')
      .that.equals('beforeAndAfter1')
    expect(taskDepGraph)
      .to.have.property('beforeAndAfter1')
      .that.has.property(DEPENDENCIES_KEY)
      .that.has.property('0')
      .that.equals('stringTask')
  })
  it(`hoists all ${OPTIONAL_BEFORE_KEY}/${OPTIONAL_AFTER_KEY} dependencies to the "${DEPENDENCIES_KEY}" key if they are required`, function () {
    const taskNameSet = buildRequiredTaskList(tasks, ['optDependencies1', 'stringTask', 'justCommandTask'])
    const taskDepGraph = buildTaskDependencyGraph(tasks, taskNameSet)
    expect(Object.keys(taskDepGraph)).to.have.length(3)
    expect(taskDepGraph)
      .to.have.property('justCommandTask')
      .that.has.property(DEPENDENCIES_KEY)
      .that.has.property('0')
      .that.equals('optDependencies1')
    expect(taskDepGraph)
      .to.have.property('optDependencies1')
      .that.has.property(DEPENDENCIES_KEY)
      .that.has.property('0')
      .that.equals('stringTask')
  })
  it(`doesn\'t hoist ${ANYTIME_KEY} dependencies anywhere`, function () {
    const taskNameSet = buildRequiredTaskList(tasks, ['anytimeDependencies'])
    const taskDepGraph = buildTaskDependencyGraph(tasks, taskNameSet)
    expect(Object.keys(taskDepGraph)).to.have.length(2)
    expect(taskDepGraph)
      .to.have.property('anytimeDependencies')
      .that.has.property(DEPENDENCIES_KEY)
      .that.has.length(0)
    expect(taskDepGraph)
      .to.have.property('stringTask')
      .that.has.property(DEPENDENCIES_KEY)
      .that.has.length(0)
  })
  it(`hoists dependencies with params correctly`, function () {
    const taskNameSet = buildRequiredTaskList(tasks, ['paramDependencies', 'justSyncFunctionTest'])
    const taskDepGraph = buildTaskDependencyGraph(tasks, taskNameSet)
    // console.log(taskDepGraph)
    expect(Object.keys(taskDepGraph)).to.have.length(4)
    expect(taskDepGraph)
      .to.have.property('paramDependencies')
      .that.has.property(DEPENDENCIES_KEY)
      .that.has.property('0')
      .that.equals('justSyncFunctionTest:param1')
    expect(taskDepGraph)
      .to.have.property('justSyncFunctionTest:param2')
      .that.has.property(DEPENDENCIES_KEY)
      .that.has.property('0')
      .that.equals('paramDependencies')
    expect(taskDepGraph)
      .to.have.property('justSyncFunctionTest')
      .that.has.property(DEPENDENCIES_KEY)
      .that.has.length(0)
  })
})
