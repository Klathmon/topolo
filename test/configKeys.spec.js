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

describe('Config Keys', () => {
  it('have the expected value for COMMAND_KEY', () => expect(COMMAND_KEY).to.equal('command'))
  it('have the expected value for ENV_KEY', () => expect(ENV_KEY).to.equal('env'))
  it('have the expected value for DEPENDENCIES_KEY', () => expect(DEPENDENCIES_KEY).to.equal('dependencies'))
  it('have the expected value for BEFORE_KEY', () => expect(BEFORE_KEY).to.equal('before'))
  it('have the expected value for OPTIONAL_BEFORE_KEY', () => expect(OPTIONAL_BEFORE_KEY).to.equal('optionalBefore'))
  it('have the expected value for AFTER_KEY', () => expect(AFTER_KEY).to.equal('after'))
  it('have the expected value for OPTIONAL_AFTER_KEY', () => expect(OPTIONAL_AFTER_KEY).to.equal('optionalAfter'))
  it('have the expected value for ANYTIME_KEY', () => expect(ANYTIME_KEY).to.equal('anytime'))
})
