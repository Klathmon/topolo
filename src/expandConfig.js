import { includes, mapValues, isObject, isArray } from 'lodash'

import {
  COMMAND_KEY,
  ENV_KEY,
  DEPENDENCIES_KEY,
  BEFORE_KEY,
  OPTIONAL_BEFORE_KEY,
  AFTER_KEY,
  OPTIONAL_AFTER_KEY,
  ANYTIME_KEY
} from './configKeys'
import { SEP } from './paramHelpers'
import { fatalError } from './logging'

export default function expandConfig (config) {
  if (includes(Object.keys(config).join(''), SEP)) {
    fatalError(`Task names cannot include a "${SEP}" character!`)
  }

  return mapValues(config, expandTask)
}

function expandTask (task) {
  const expandedTask = {
    [COMMAND_KEY]: [],
    [ENV_KEY]: {},
    [DEPENDENCIES_KEY]: {
      [BEFORE_KEY]: [],
      [OPTIONAL_BEFORE_KEY]: [],
      [AFTER_KEY]: [],
      [OPTIONAL_AFTER_KEY]: [],
      [ANYTIME_KEY]: []
    }
  }
  if (isObject(task)) {
    if (DEPENDENCIES_KEY in task) {
      if (!isObject(task[DEPENDENCIES_KEY])) {
        expandedTask[DEPENDENCIES_KEY][BEFORE_KEY] = task[DEPENDENCIES_KEY]
      }
      // Ensure each dependencies property is an array
      for (let property of [BEFORE_KEY, OPTIONAL_BEFORE_KEY, AFTER_KEY, OPTIONAL_AFTER_KEY, ANYTIME_KEY]) {
        if (!isArray(expandedTask[DEPENDENCIES_KEY][property])) {
          expandedTask[DEPENDENCIES_KEY][property] = [expandedTask[DEPENDENCIES_KEY][property]]
        }
      }
    }
  } else {
    expandedTask[COMMAND_KEY] = task
  }

  return expandedTask
}
