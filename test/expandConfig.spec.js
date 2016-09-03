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
  it('returns an expanded config correctly', () => {
    const config = expandConfig({
      build: 'stuff',
      test: 'things'
    })
    expect(config).to.have.property('build').that.has.property(COMMAND_KEY).that.equals('stuff')
    expect(config).to.have.property('test').that.has.property(COMMAND_KEY).that.equals('things')
  })

  describe('wrapInArray()', () => {
    let wrapInArray
    before(() => wrapInArray = rewireAPI.__get__('wrapInArray'))

    it('wraps a string in an array', () => {
      const thing = 'test'
      expect(wrapInArray(thing)).to.be.instanceof(Array).that.has.length(1)
    })
    it('doesn\'t touch an array that is passed in', () => {
      const thing = ['test1', 'test2']
      expect(wrapInArray(thing)).to.be.instanceof(Array).that.has.length(2)
    })
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
    it('expands a simple command that is a string', () => {
      const task = 'test'
      expect(expandTask(task)).to.have.property(COMMAND_KEY).that.equals(task)
    })
    it('expands a simple command that is a function', () => {
      const task = () => null
      expect(expandTask(task)).to.have.property(COMMAND_KEY).that.equals(task)
    })
    it('expands a simple command that is an array', () => {
      const task = ['test1', 'test2']
      expect(expandTask(task)).to.have.property(COMMAND_KEY).that.equals(task)
    })
    for (let [type, val] of [['a string', 'test'], ['an array', ['test1', 'test2']]]) {
      it(`expands a bare "${DEPENDENCIES_KEY}" key that is ${type}`, () => {
        expect(expandTask({ [DEPENDENCIES_KEY]: val }))
          .to.have.property(DEPENDENCIES_KEY)
          .that.has.property(BEFORE_KEY)
          .that.is.instanceof(Array)
          .that.has.length.above(0)
      })
    }
    for (let property of [BEFORE_KEY, OPTIONAL_BEFORE_KEY, AFTER_KEY, OPTIONAL_AFTER_KEY, ANYTIME_KEY]) {
      for (let [type, val] of [['a string', 'test'], ['an array', ['test1', 'test2']]]) {
        it(`expands the "${property}" key that is ${type}`, () => {
          expect(expandTask({ [DEPENDENCIES_KEY]: { [property]: val } }))
            .to.have.property(DEPENDENCIES_KEY)
            .that.has.property(property)
            .that.is.instanceof(Array)
            .that.has.length.above(0)
        })
      }
    }
  })
})
