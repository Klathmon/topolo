import { resolve } from 'path'
import { expect } from 'chai'

import expandConfig from '../src/expandConfig'
import buildRequiredTaskList from '../src/buildRequiredTaskList'

describe('buildRequiredTaskList.js', function () {
  let expandedConfig
  before(function () {
    const testConfigPath = resolve(__dirname, 'test.topolo.config.js')
    delete require.cache[require.resolve(testConfigPath)]
    expandedConfig = expandConfig(require(testConfigPath))
  })

  it('throws if a launch task isn\'t found', function () {
    expect(buildRequiredTaskList.bind(this, expandedConfig, ['notarealtask'])).to.throw(Error)
  })
  it('builds an empty list if no launch tasks are given', function () {
    expect(buildRequiredTaskList(expandedConfig, []))
      .to.be.instanceof(Set)
      .that.has.property('size')
      .that.equals(0)
  })
  it('builds a single-item list for a zero-dependency task', function () {
    expect(buildRequiredTaskList(expandedConfig, ['stringTask']))
      .to.be.instanceof(Set)
      .that.has.property('size')
      .that.equals(1)
  })
  it('includes before and after dependencies correctly', function () {
    expect(buildRequiredTaskList(expandedConfig, ['beforeAndAfter1']))
      .to.be.instanceof(Set)
      .that.has.property('size')
      .that.equals(3)
  })
  it('does not include optional dependencies if they were not required by the launch tasks', function () {
    expect(buildRequiredTaskList(expandedConfig, ['optDependencies1']))
      .to.be.instanceof(Set)
      .that.has.property('size')
      .that.equals(1)
  })
  it('includes anytime dependencies', function () {
    expect(buildRequiredTaskList(expandedConfig, ['anytimeDependencies']))
      .to.be.instanceof(Set)
      .that.has.property('size')
      .that.equals(2)
  })
  it('includes the same task with multiple parameter versions correctly', function () {
    expect(buildRequiredTaskList(expandedConfig, ['justSyncFunctionTest:first', 'justSyncFunctionTest:second']))
      .to.be.instanceof(Set)
      .that.has.property('size')
      .that.equals(2)
  })
})
