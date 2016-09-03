import { union } from 'lodash'

import {
  DEPENDENCIES_KEY,
  BEFORE_KEY,
  OPTIONAL_BEFORE_KEY,
  AFTER_KEY,
  OPTIONAL_AFTER_KEY,
  ANYTIME_KEY
} from './configKeys'
import { getRootTaskName } from './paramHelpers'

export default function buildTaskDependencyGraph (tasks, requiredTaskNameSet) {
  const taskMap = orderTasks(tasks, requiredTaskNameSet)
  const orderedTaskObject = convertToObject(taskMap)

  return orderedTaskObject
}

function orderTasks (tasks, requiredTaskNameSet) {
  const taskMap = new Map()

  for (let taskName of requiredTaskNameSet) {
    const task = getTask(taskName, taskMap, tasks)
    const {
      [DEPENDENCIES_KEY]: {
        [BEFORE_KEY]: before,
        [OPTIONAL_BEFORE_KEY]: optionalBefore,
        [AFTER_KEY]: after,
        [OPTIONAL_AFTER_KEY]: optionalAfter
      }
    } = task

    // First map the optional befores to the required befores if they are in the requiredTaskNameSet
    const requiredOptionalBefore = optionalBefore.filter((dependencyName) => requiredTaskNameSet.has(dependencyName))
    // Make sure to set the values on the task object here
    task[DEPENDENCIES_KEY][BEFORE_KEY] = union(before, requiredOptionalBefore)
    task[DEPENDENCIES_KEY][OPTIONAL_BEFORE_KEY] = []

    // For the after keys, we need to lookup the task they are referring to, and add this task to their befores
    for (let dependencies of [after, optionalAfter]) {
      for (let dependencyName of dependencies) {
        // Skip this dep if it's not in the required taskName set
        if (!requiredTaskNameSet.has(dependencyName)) continue

        // Get the task that this dependency is refrencing, and add this task to it's required befores
        const refrencedTask = getTask(dependencyName, taskMap, tasks)
        refrencedTask[DEPENDENCIES_KEY][BEFORE_KEY] = union(refrencedTask[DEPENDENCIES_KEY][BEFORE_KEY], [taskName])
      }
    }
    // And clear out the afters (and the anytime, we already dealt with it before this step) just in case
    task[DEPENDENCIES_KEY][ANYTIME_KEY] = []
    task[DEPENDENCIES_KEY][AFTER_KEY] = []
    task[DEPENDENCIES_KEY][OPTIONAL_AFTER_KEY] = []

    // And then set the task into the taskMap
    taskMap.set(taskName, task)
  }

  return taskMap
}

function convertToObject (taskMap) {
  const taskObject = {}
  for (let [taskName, task] of taskMap) {
    taskObject[taskName] = {
      ...task,
      // Throw the taskName into the object so it can be used later when converted into an array
      taskName,
      // Since the before key should be the only one with anything in it, hoist it up to the
      // dependencies key
      [DEPENDENCIES_KEY]: task[DEPENDENCIES_KEY][BEFORE_KEY]
    }
  }
  return taskObject
}

/**
 * Gets a task either from the taskMap, or the task "object" (called tasks elsewhere)
 * @param  {String} taskName
 * @param  {Map} taskMap
 * @param  {Object} taskObject
 * @return {Object}            the task
 */
function getTask (taskName, taskMap, taskObject) {
  return (taskMap.has(taskName) ? taskMap.get(taskName) : taskObject[getRootTaskName(taskName)])
}
