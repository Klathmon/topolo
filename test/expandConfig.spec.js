import { expect } from 'chai'
import { stub } from 'sinon'
import { SEP } from '../src/paramHelpers'
import expandConfig from '../src/expandConfig'

describe('expandConfig.js', () => {
  it(`dies if any task key has a "${SEP}" character in it`, () => {
    expect(expandConfig.bind(expandConfig, {
      build: 'thing',
      'test:watch': 'thing'
    })).to.throw(Error)
  })
})
