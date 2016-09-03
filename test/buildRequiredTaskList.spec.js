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
import buildRequiredTaskList from '../src/buildRequiredTaskList'

describe('buildRequiredTaskList.js')
