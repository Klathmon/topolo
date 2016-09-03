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
    expandedTask[COMMAND_KEY] = task[COMMAND_KEY]
    expandedTask[ENV_KEY] = task[ENV_KEY]
    if (DEPENDENCIES_KEY in task) {
      const dependencies = task[DEPENDENCIES_KEY]
      if (isObject(dependencies)) {
        for (let property of [BEFORE_KEY, OPTIONAL_BEFORE_KEY, AFTER_KEY, OPTIONAL_AFTER_KEY, ANYTIME_KEY]) {
          if ((property in dependencies)) {
            expandedTask[DEPENDENCIES_KEY][property] = wrapInArray(dependencies[property])
          }
        }
      } else {
        expandedTask[DEPENDENCIES_KEY][BEFORE_KEY] = wrapInArray(dependencies)
      }
    }
  } else {
    expandedTask[COMMAND_KEY] = task
  }

  return expandedTask
}

function wrapInArray (val) {
  if (!isArray(val)) {
    return [val]
  } else {
    return val
  }
}
