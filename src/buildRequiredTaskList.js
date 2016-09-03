import {
  DEPENDENCIES_KEY,
  BEFORE_KEY,
  AFTER_KEY,
  ANYTIME_KEY
} from './configKeys'
import { getRootTaskName } from './paramHelpers'
import { fatalError } from './events'

export default function buildRequiredTaskList (tasks, launchTaskNames) {
  const taskNameSet = new Set(launchTaskNames)

  // This loop modifies taskNameSet as it's iterated, adding more as it goes along.
  for (let taskName of taskNameSet) {
    // First strip off any included params on the task name
    const rootTaskName = getRootTaskName(taskName)
    // Throw if the task doesn't exist
    if (!(rootTaskName in tasks)) {
      fatalError(`Required task "${rootTaskName}" not found!`)
    }
    // Grab the dependencies for this task
    const { [DEPENDENCIES_KEY]: dependencies } = tasks[rootTaskName]
    for (let property of [BEFORE_KEY, AFTER_KEY, ANYTIME_KEY]) {
      for (let dependentTaskName of dependencies[property]) {
        taskNameSet.add(dependentTaskName)
      }
    }
  }

  return taskNameSet
}
