import { expect } from 'chai'
import { stub } from 'sinon'
import { resolve } from 'path'
import readConfig, { __RewireAPI__ as rewireAPI } from '../src/readConfig'

const standaloneConfig = JSON.stringify({
  'build': {
    'command': 'webpack',
    'env': {
      'NODE_ENV': 'production'
    }
  }
})
const packageJson = JSON.stringify({
  'topolo': JSON.parse(standaloneConfig)
})

describe('readConfig module', function () {
  afterEach(function () {
    rewireAPI.__ResetDependency__('readFileAsync')
  })
  describe('readConfig()', function () {
    it('expands the config path correctly', async function () {
      const readFileAsyncStub = stub().returns(packageJson)
      rewireAPI.__set__('readFileAsync', readFileAsyncStub)

      const configPath = resolve(__dirname, '..', 'package.json')
      readConfig(configPath)
      expect(readFileAsyncStub).to.be.calledOnce
      expect(readFileAsyncStub.firstCall.args[0]).to.equal(configPath)
    })
    it('parses a package.json correctly', async function () {
      const readFileAsyncStub = stub().returns(packageJson)
      rewireAPI.__set__('readFileAsync', readFileAsyncStub)

      const config = await readConfig('')

      expect(config).to.have.property('build')
    })
    it('parses a standalone config correctly', async function () {
      const readFileAsyncStub = stub().returns(standaloneConfig)
      rewireAPI.__set__('readFileAsync', readFileAsyncStub)

      const config = await readConfig('')

      expect(config).to.have.property('build')
    })
    it('adds sensable default values', async function () {
      const readFileAsyncStub = stub().returns(standaloneConfig)
      rewireAPI.__set__('readFileAsync', readFileAsyncStub)

      const config = await readConfig('')

      expect(config).to.have.property('build').that.has.property('defaultValues').that.has.length(0)
    })
    it('never overwrites a given value with a default', async function () {
      const readFileAsyncStub = stub().returns(standaloneConfig)
      rewireAPI.__set__('readFileAsync', readFileAsyncStub)

      const config = await readConfig('')

      expect(config).to.have.property('build').that.has.property('command').that.is.not.null
    })
  })
})