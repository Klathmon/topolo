import { without, isArray, isFunction, isString, isEmpty } from 'lodash'

import {
  COMMAND_KEY,
  ENV_KEY,
  DEPENDENCIES_KEY
} from './configKeys'

// Constants
const NEVER_RUN = Symbol('NEVER_RUN')
const RUNNING = Symbol('RUNNING')
const DONE = Symbol('DONE')

import { runCommand } from './runCommand'
import { startCommand, logError } from './log'

export default async function runTasks (sortedTaskArray) {
  // First tag every task with a status of NEVER_RUN
  const taggedTasks = sortedTaskArray.map((task) => ({ ...task, status: NEVER_RUN }))

  // Then down the rabbit hole we go!
  return recurse(taggedTasks)
}

function recurse (tasks) {
  // We are going to map over every task, and handle each one
  return Promise.all(tasks.map(async function (task) {
    if (task[DEPENDENCIES_KEY].length > 0 || task.status !== NEVER_RUN) {
      return Promise.resolve()
    }
    // If the task has no dependencies and has never been run, then run it
    if (task[DEPENDENCIES_KEY].length === 0 && task.status === NEVER_RUN) {
      // Set it to running, then await the command to finish
      task.status = RUNNING

      await handleTask(task)

      // When it's done, mark it as done then remove it from all other tasks' dependencies
      task.status = DONE
      for (let innerTask of tasks) {
        innerTask[DEPENDENCIES_KEY] = without(innerTask[DEPENDENCIES_KEY], task.name)
      }

      // Finally, re-run the recursive function and return it's result
      return recurse(tasks)
    }
  }))
}

async function handleTask ({ [COMMAND_KEY]: commands, [ENV_KEY]: env }) {
  const name = 'NOT DONE!!!'
  // Ensure commands is an array
  const commandsArray = (isArray(commands) ? commands : [commands])

  for (let command of commandsArray) {
    // If it's a function, invoke it and use the result as the command to execute
    if (isFunction(command)) {
      command = await command()
    }

    if (isString(command) && !isEmpty(command)) {
      await runCommand(command)
    } else {
      logError(`Command for task "${name}" is not a valid string`)
    }
  }
}
