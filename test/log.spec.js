import { expect } from 'chai'
import { stub } from 'sinon'
import { startCommand, __RewireAPI__ as rewireAPI } from '../src/log'

describe('Log module', function () {
  let consoleStub
  beforeEach(function () {
    consoleStub = stub()
    rewireAPI.__set__('localConsoleLog', consoleStub)
  })
  afterEach(function () {
    rewireAPI.__ResetDependency__('localConsoleLog')
  })

  describe('startCommand()', function () {
    it('should print a starting line', function () {
      startCommand('test')
      expect(consoleStub).to.be.calledOnce
      expect(consoleStub.firstCall.args[0]).to.include('Starting')
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
})
