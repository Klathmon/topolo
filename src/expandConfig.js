import { includes, mapValues, isFunction, isArray, isString, get } from 'lodash'

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
  if (isString(task) || isFunction(task) || isArray(task)) {
    expandedTask[COMMAND_KEY] = task
  } else {
    expandedTask[COMMAND_KEY] = get(task, COMMAND_KEY, [])
    expandedTask[ENV_KEY] = get(task, ENV_KEY, {})
    if (DEPENDENCIES_KEY in task) {
      const dependencies = task[DEPENDENCIES_KEY]
      if (isString(dependencies) || isArray(dependencies)) {
        expandedTask[DEPENDENCIES_KEY][BEFORE_KEY] = wrapInArray(dependencies)
      } else {
        for (let property of [BEFORE_KEY, OPTIONAL_BEFORE_KEY, AFTER_KEY, OPTIONAL_AFTER_KEY, ANYTIME_KEY]) {
          if ((property in dependencies)) {
            expandedTask[DEPENDENCIES_KEY][property] = wrapInArray(dependencies[property])
          }
        }
      }
    }
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
