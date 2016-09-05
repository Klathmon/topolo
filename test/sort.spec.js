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
import sortTasks from '../src/sort'

describe('buildTaskDependencyGraph.js', function () {
  let testSetup
  beforeEach(() => testSetup = (launchTasks = []) => {
    const testConfigPath = resolve(__dirname, 'test.topolo.config.js')
    delete require.cache[require.resolve(testConfigPath)]
    const tasks = expandConfig(require(testConfigPath))
    const taskNameSet = buildRequiredTaskList(tasks, launchTasks)
    const taskDepGraph = buildTaskDependencyGraph(tasks, taskNameSet)
    return sortTasks(taskDepGraph, taskNameSet)
  })

  it('throws if a self-cyclical dependency is found', function () {
    expect(testSetup.bind(testSetup, ['cyclical1'])).to.throw('Cyclical')
  })
  it('throws if a general cyclical dependency is found', function () {
    expect(testSetup.bind(testSetup, ['cyclical2', 'cyclical3'])).to.throw('Cyclical')
  })
  it('sorts tasks correctly', function () {
    const sortedTasks = testSetup(['dependencies1', 'stringTask'])
    expect(sortedTasks).to.have.property(0).that.has.property('taskName').that.equals('stringTask')
    expect(sortedTasks).to.have.property(1).that.has.property('taskName').that.equals('dependencies1')
  })
})
