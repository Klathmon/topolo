import { resolve } from 'path'
import { expect } from 'chai'
import { stub } from 'sinon'
import {
  COMMAND_KEY,
  ENV_KEY
} from '../src/configKeys'
import expandConfig from '../src/expandConfig'
import buildRequiredTaskList from '../src/buildRequiredTaskList'
import buildTaskDependencyGraph from '../src/buildTaskDependencyGraph'
import sortTasks from '../src/sort'
import runTasks, { __RewireAPI__ as rewireAPI } from '../src/runner'

describe('buildTaskDependencyGraph.js', function () {
  let runCommandStub
  after(() => rewireAPI.__ResetDependency__('startTask'))
  beforeEach(() => {
    runCommandStub = stub()
    rewireAPI.__set__('runCommand', runCommandStub)
  })
  describe('runTasks()', function () {
    let testSetup
    beforeEach(() => testSetup = async function (launchTasks = []) {
      const testConfigPath = resolve(__dirname, 'test.topolo.config.js')
      delete require.cache[require.resolve(testConfigPath)]
      const tasks = expandConfig(require(testConfigPath))
      const taskNameSet = buildRequiredTaskList(tasks, launchTasks)
      const taskDepGraph = buildTaskDependencyGraph(tasks, taskNameSet)
      const sortedTasks = sortTasks(taskDepGraph, taskNameSet)
      return runTasks(sortedTasks)
    })

    it('runs all commands correctly', async function () {
      runCommandStub.returns(Promise.resolve())
      await testSetup(['dependencies1', 'beforeAndAfter1'])
      expect(runCommandStub).to.have.callCount(4)
    })
  })

  describe('handleTask()', function () {
    const emptyTask = {
      taskName: 'test',
      [COMMAND_KEY]: '',
      [ENV_KEY]: {}
    }
    let handleTask, startTaskStub
    beforeEach(function () {
      startTaskStub = stub().returns(() => () => null)
      rewireAPI.__set__('startTask', startTaskStub)
    })
    before(() => handleTask = rewireAPI.__get__('handleTask'))
    after(() => rewireAPI.__ResetDependency__('startTask'))

    it('does nothing but log for an empty command', async function () {
      runCommandStub.returns(Promise.resolve())
      await handleTask({ ...emptyTask })
      expect(runCommandStub).to.have.not.been.called
      expect(startTaskStub).to.have.been.called.once
    })
    it('throws if a command fails', async function () {
      runCommandStub.throws('Error')
      await expect(handleTask({
        ...emptyTask,
        [COMMAND_KEY]: 'echo "testCommand"'
      })).to.be.rejected
      expect(runCommandStub).to.have.been.calledWith('echo "testCommand"')
    })
    it('handles a string command correctly', async function () {
      runCommandStub.returns(Promise.resolve())
      await handleTask({
        ...emptyTask,
        [COMMAND_KEY]: 'echo "testCommand"'
      })
      expect(runCommandStub).to.have.been.calledWith('echo "testCommand"')
      expect(startTaskStub).to.have.been.called.once
    })
    it('handles an array of commands correctly', async function () {
      runCommandStub.returns(Promise.resolve())
      await handleTask({
        ...emptyTask,
        [COMMAND_KEY]: ['echo "testCommand1"', 'echo "testCommand2"']
      })
      expect(runCommandStub.getCall(0).args[0]).to.equal('echo "testCommand1"')
      expect(runCommandStub.getCall(1).args[0]).to.equal('echo "testCommand2"')
      expect(startTaskStub).to.have.been.called.twice
    })
    it('throws if a function command returns something invalid', async function () {
      runCommandStub.throws('Error')
      await expect(handleTask({
        ...emptyTask,
        [COMMAND_KEY]: () => ({ test: 123 })
      })).to.be.rejected
      expect(runCommandStub).to.have.not.been.called
    })
    it('handles a syncronous function command correctly', async function () {
      runCommandStub.returns(Promise.resolve())
      await handleTask({
        ...emptyTask,
        [COMMAND_KEY]: () => 'echo "testCommand"'
      })
      expect(runCommandStub).to.have.been.calledWith('echo "testCommand"')
      expect(startTaskStub).to.have.been.called.once
    })
    it('handles an async function command correctly', async function () {
      runCommandStub.returns(Promise.resolve())
      await handleTask({
        ...emptyTask,
        [COMMAND_KEY]: () => new Promise((resolve) => setTimeout(() => resolve('echo "testCommand"'), 1))
      })
      expect(runCommandStub).to.have.been.calledWith('echo "testCommand"')
      expect(startTaskStub).to.have.been.called.once
    })
    it('passes given params to the command function correctly', async function () {
      runCommandStub.returns(Promise.resolve())
      const commandFunctionStub = stub().returns('echo "testCommand"')
      await handleTask({
        ...emptyTask,
        taskName: 'test:param1:param2',
        [COMMAND_KEY]: commandFunctionStub
      })
      expect(runCommandStub).to.have.been.calledWith('echo "testCommand"')
      expect(startTaskStub).to.have.been.called.once
      expect(commandFunctionStub).to.have.been.calledWith('param1', 'param2')
    })
  })
})
