import { mapValues, includes } from 'lodash'
import { logError } from './log'

/**
 * Gets an array of taskNames that must be run this iteration in no perticular order.
 * @param  {Object} tasks           The object holding all tasks. key is the taskName
 * @param  {Array} launchTaskNames  An array of taskNames that were used to launch the command
 * @return {Array}                  An array of taskNames that must be run at some point in no order
 */
export function getUnorderedTaskNames (tasks, launchTaskNames) {
  const unorderedTaskNames = [...launchTaskNames]

  // This loop modifies unorderedTaskNames as it iterates over it, adding more as it goes along
  for (let taskName of unorderedTaskNames) {
    for (let dependentTaskName of tasks[taskName].dependencies) {
      if (!includes(unorderedTaskNames, dependentTaskName)) {
        unorderedTaskNames.push(dependentTaskName)
      }
    }
  }

  return unorderedTaskNames
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
  const nodes = mapValues(tasks, (task, taskName) => {
    return {
      task: {
        ...task,
        // Add the declared dependencies with the optionalDependencies
        dependencies: task.dependencies.concat(task.optionalDependencies.filter((optionalDependency) => {
          // But only include the optional dependencies if they are in the list of unorderedTaskNames
          return includes(unorderedTaskNames, optionalDependency)
        })),
        optionalDependencies: undefined // overwrite the other optionalDependencies
      },
      tempMark: false,
      permaMark: false
    }
  })

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
      for (let dependentTaskName of node.task.dependencies) {
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
  return sortedTasks
}
