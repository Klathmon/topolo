import { expect } from 'chai'
import { stub } from 'sinon'
import {
  startCommand,
  logError,
  logVerbose,
  __RewireAPI__ as rewireAPI
} from '../src/log'

describe('Log module', function () {
  let consoleStub
  after(function () { rewireAPI.__ResetDependency__('localConsoleLog') })
  beforeEach(function () {
    consoleStub = stub()
    rewireAPI.__set__('localConsoleLog', consoleStub)
  })

  describe('startCommand() and endCommand()', function () {
    it('should print a starting line', function () {
      startCommand('test')
      expect(consoleStub).to.be.calledOnce
      expect(consoleStub.firstCall.args[0]).to.include('Starting')
      expect(consoleStub.firstCall.args[0]).to.include('test')
    })
    it('should return an end function', function () {
      const retval = startCommand('test')
      expect(retval).to.be.a('function')
    })
    it('should print an end message and a sane time', function (done) {
      const retval = startCommand('test')
      setTimeout(() => {
        retval()
        expect(consoleStub).to.be.calledTwice
        expect(consoleStub.secondCall.args[0]).to.include('Finished')
        expect(consoleStub.secondCall.args[0]).to.include(' ms')
        done()
      }, 10)
    })
  })

  describe('logError()', function () {
    it('throws the correct error when given a string', function () {
      expect(logError.bind(undefined, 'test error')).to.throw('test error')
    })
    it('throws the correct error when given an error object', function () {
      expect(logError.bind(undefined, new Error('test error'))).to.throw('test error')
    })
    it('prints the error to the output', function () {
      try {
        logError('test error')
      } catch (err) {
        expect(consoleStub).to.be.called
        expect(consoleStub.firstCall.args[0]).to.include('ERROR')
        expect(consoleStub.firstCall.args[0]).to.include('test error')
      }
    })
  })

  describe('logVerbose()', function () {
    after(function () { rewireAPI.__ResetDependency__('localVerboseMode') })
    beforeEach(function () { rewireAPI.__set__('localVerboseMode', true) })

    it('does nothing if verbose is not set', function () {
      rewireAPI.__set__('localVerboseMode', false)
      logVerbose('test')
      expect(consoleStub).to.not.be.called
    })

    it('outputs VERBOSE if enabled', function () {
      logVerbose('test')
      expect(consoleStub).to.be.calledOnce
      expect(consoleStub.firstCall.args[0]).to.include('VERBOSE')
    })

    it('prints the given string', function () {
      logVerbose('test')
      expect(consoleStub.firstCall.args[0]).to.include('test')
    })

    it('prints the given object all pretty like', function () {
      logVerbose({
        'is this a test': 'yes',
        'are you sure?': 'yes'
      })
      expect(consoleStub.firstCall.args[0]).to.include('is this a test')
      expect(consoleStub.firstCall.args[0]).to.include('{')
      expect((consoleStub.firstCall.args[0].match(/\n/gm) || []).length).to.be.above(1)
    })
  })
})
