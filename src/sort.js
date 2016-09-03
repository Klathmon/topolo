
import { mapValues } from 'lodash'

import {
  DEPENDENCIES_KEY
} from './configKeys'
import { fatalError, logVerbose } from './events'

export default function sortTasks (taskDepGraph, requiredTaskNameSet) {
  const sortedTasks = []
  const nodes = mapValues(taskDepGraph, (task) => ({
    task,
    tempMark: false,
    permaMark: false
  }))

  const topologicalSort = function topologicalSort (taskName) {
    const node = nodes[taskName]

    // A temp mark at this point means that tasks is not a DAG (we hit a set of cyclical dependencies)
    if (node.tempMark === true) {
      fatalError('Cyclical dependencies not allowed')
    }

    // if it's false, we haven't "finished" this one yet, so dive in
    if (node.permaMark === false) {
      // Give it a temp mark to ensure we don't hit any cyclical dependencies
      node.tempMark = true
      // Then loop over the dependencies and do a depth first search in each
      for (let dependentTaskName of node.task[DEPENDENCIES_KEY]) {
        topologicalSort(dependentTaskName)
      }
      // Set the permaMark, unset the tempMark, and push the node's task into the set of sorted tasks
      node.permaMark = true
      node.tempMark = false
      sortedTasks.push(node.task)
    }
  }

  // Now loop over and hit all of the unorderedTaskNames to kick it off!
  for (let taskName of requiredTaskNameSet) {
    topologicalSort(taskName)
  }

  // At this point sortedTasks is an array of tasks in "run first" to "run last" order
  // And we are completely sure that there are no cyclical dependencies
  logVerbose('Sorted Tasks: ' + JSON.stringify(sortedTasks, undefined, 2))
  return sortedTasks
}
