import { expect } from 'chai'
import {
  COMMAND_KEY,
  ENV_KEY,
  DEPENDENCIES_KEY,
  BEFORE_KEY,
  OPTIONAL_BEFORE_KEY,
  AFTER_KEY,
  OPTIONAL_AFTER_KEY,
  ANYTIME_KEY
} from '../src/configKeys'
import { SEP } from '../src/paramHelpers'
import expandConfig, { __RewireAPI__ as rewireAPI } from '../src/expandConfig'

describe('expandConfig.js', () => {
  it(`dies if any task key has a "${SEP}" character in it`, () => {
    expect(expandConfig.bind(expandConfig, {
      build: 'thing',
      'test:watch': 'thing'
    })).to.throw(Error)
  })
  describe('expandTask()', () => {
    let expandTask
    before(() => expandTask = rewireAPI.__get__('expandTask'))

    it('expands to sane defaults', () => {
      const task = expandTask({})
      expect(task).to.have.property(COMMAND_KEY).that.is.instanceof(Array)
      expect(task).to.have.property(ENV_KEY).that.is.instanceof(Object)
      expect(task).to.have.property(DEPENDENCIES_KEY).that.is.instanceof(Object)
      expect(task).to.have.property(DEPENDENCIES_KEY).that.has.property(BEFORE_KEY).that.is.instanceof(Array)
      expect(task).to.have.property(DEPENDENCIES_KEY).that.has.property(OPTIONAL_BEFORE_KEY).that.is.instanceof(Array)
      expect(task).to.have.property(DEPENDENCIES_KEY).that.has.property(AFTER_KEY).that.is.instanceof(Array)
      expect(task).to.have.property(DEPENDENCIES_KEY).that.has.property(OPTIONAL_AFTER_KEY).that.is.instanceof(Array)
      expect(task).to.have.property(DEPENDENCIES_KEY).that.has.property(ANYTIME_KEY).that.is.instanceof(Array)
    })
    it('expands a task that is a string', () => {
      const task = 'test'
      expect(expandTask(task)).to.have.property(COMMAND_KEY).that.equals(task)
    })
    it('expands a task that is a function', () => {
      const task = () => null
      expect(expandTask(task)).to.have.property(COMMAND_KEY).that.equals(task)
    })
    it('expands a task that is an array', () => {
      const task = ['test1', 'test2']
      expect(expandTask(task)).to.have.property(COMMAND_KEY).that.equals(task)
    })
  })
})
