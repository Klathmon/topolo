import { union, mapValues } from 'lodash'

import {
  COMMAND,
  DEFAULT_VALUES,
  REQ_BEFORE,
  OPT_BEFORE,
  REQ_AFTER,
  OPT_AFTER
} from './configKeys'
import { getCannonicalName, getParams, expandParams } from './taskParams'
import { logError, logVerbose } from './log'

/**
 * Gets an array of taskNames that must be run this iteration in no perticular order.
 * @param  {Object} tasks           The object holding all tasks. key is the taskName
 * @param  {Array} launchTaskNames  An array of taskNames that were used to launch the command
 * @return {Array}                  An array of taskNames that must be run at some point in no order
 */
export function getUnorderedTaskNames (tasks, launchTaskNames) {
  const unorderedTaskSet = new Set(launchTaskNames)

  // This loop modifies unorderedTaskNames as it iterates over it, adding more as it goes along
  for (let taskName of unorderedTaskSet) {
    // First, get the main "task" from it's name (which could have additional params tacked on)
    const task = tasks[getCannonicalName(taskName)]
    // Then we need to loop over every manditory "before" and "after" to ensure we are grabbing everything
    for (let property of [REQ_BEFORE, REQ_AFTER]) {
      for (let dependentTaskName of task[property]) {
        // Check if the dependentTaskName's cannonical name exists in the tasks and throw if it doesn't
        if (!(getCannonicalName(dependentTaskName) in tasks)) {
          logError(`Required task "${getCannonicalName(dependentTaskName)}" not found!`)
        } else {
          unorderedTaskSet.add(dependentTaskName)
        }
      }
    }
  }

  logVerbose('Unordered Task Names:')
  logVerbose(unorderedTaskSet)
  return unorderedTaskSet
}

export function buildTaskList (tasks, unorderedTaskNames) {
  const taskMap = new Map()
  for (let taskName of unorderedTaskNames) {
    // First get the task, if it's in the map then use that, otherwise get it from the tasks object
    const task = _getTask(taskName, taskMap, tasks)
    // Then deal with the before keys first...
    // Loop over any optional "before" dependencies and add them to required if they are included by someone
    const requiredOptionalDependencies = task[OPT_BEFORE].filter((dependencyName) => unorderedTaskNames.has(dependencyName))
    task[REQ_BEFORE] = union(task[REQ_BEFORE], requiredOptionalDependencies)
    // Then clear out the optional before dependencies
    task[OPT_BEFORE] = []

    // Then handle the after keys
    for (let dependencies of [task[REQ_AFTER], task[OPT_AFTER]]) {
      for (let dependencyName of dependencies) {
        // skip this dependency if it's not in the unorderedTaskNames Set (it means it wasn't required)
        if (!unorderedTaskNames.has(dependencyName)) continue

        // Get the task that the dependencyName is referring to
        const afterTask = _getTask(dependencyName, taskMap, tasks)
        // Then add the current "working" task's name to the afterTask's "before dependencies" (if it doesn't exist)
        afterTask[REQ_BEFORE] = union(afterTask[REQ_BEFORE], [taskName])
      }
    }
    // Then clear out all after dependencies
    task[REQ_AFTER] = []
    task[OPT_AFTER] = []

    // Finally, add (or replace) the task in the taskMap
    taskMap.set(taskName, task)
  }

  // Now convert the map into a plain old object that the rest of the program will use
  const builtTasks = {}
  for (let [taskName, task] of taskMap) {
    const command = task[COMMAND]
    const defaultValues = task[DEFAULT_VALUES]
    const params = getParams(taskName)
    builtTasks[taskName] = {
      ...task,
      [COMMAND]: expandParams(command, params, defaultValues)
    }
  }

  logVerbose('Built Tasks:')
  logVerbose(builtTasks)
  return builtTasks
}

/**
 * Sorts the given tasks topologically.
 * We really don't need the results "sorted" but by doing so we ensure that there are no cyclical dependencies
 * See https://en.wikipedia.org/wiki/Topological_sorting for more info.
 * @param  {Object} tasks              The object holding all tasks. Key is the taskName
 * @param  {Array} unorderedTaskNames  An array of taskNames taht must be run in any random order.
 * @return {Array}                     The orderedTasks in "run first" to "run last" order
 */
export function getOrderedTasks (tasks, unorderedTaskNames) {
  const sortedTasks = []
  const nodes = mapValues(tasks, (task) => ({
    task, // TODO: put task name here
    tempMark: false,
    permaMark: false
  }))

  const topologicalSort = function topologicalSort (taskName) {
    if (!(taskName in nodes)) {
      logError(`Task name "${taskName}" not found`)
    }

    const node = nodes[taskName]

    // A temp mark at this point means that tasks is not a DAG (we hit a set of cyclical dependencies)
    if (node.tempMark === true) {
      logError('Cyclical dependencies not allowed')
    }

    // if it's false, we haven't "finished" this one yet, so dive in
    if (node.permaMark === false) {
      // Give it a temp mark to ensure we don't hit any cyclical dependencies
      node.tempMark = true
      // Then loop over the dependencies and do a depth first search in each
      for (let dependentTaskName of node.task[REQ_BEFORE]) {
        topologicalSort(dependentTaskName)
      }
      // Set the permaMark, unset the tempMark, and push the node's task into the set of sorted tasks
      node.permaMark = true
      node.tempMark = false
      sortedTasks.push(node.task)
    }
  }

  // Now loop over and hit all of the unorderedTaskNames to kick it off!
  for (let taskName of unorderedTaskNames) {
    topologicalSort(taskName)
  }

  // At this point sortedTasks is an array of tasks in "run first" to "run last" order
  logVerbose('Sorted Tasks:')
  logVerbose(sortedTasks)
  return sortedTasks
}

function _getTask (taskName, taskMap, taskObject) {
  return (taskMap.has(taskName) ? taskMap.get(taskName) : taskObject[getCannonicalName(taskName)])
}
