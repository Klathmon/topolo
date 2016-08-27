import { delimiter, resolve as pathResolve } from 'path'
import spawn from 'cross-spawn'
import spawnArgs from 'spawn-args'
import { without } from 'lodash'

// Constants
const NEVER_RUN = Symbol('NEVER_RUN')
const RUNNING = Symbol('RUNNING')
const DONE = Symbol('DONE')

import { startCommand, logError } from './log'

export default async function runTasks (orderedTasks) {
  // First tag every task with a status of NEVER_RUN
  const taggedTasks = orderedTasks.map((task) => ({ ...task, status: NEVER_RUN }))

  return recurse(taggedTasks)
}

function recurse (tasks) {
  return Promise.all(tasks.map(async function (task) {
    // If the task has no dependencies and has never been run, then run it
    if (task.dependencies.length === 0 && task.status === NEVER_RUN) {
      // Set it to running, then await the command to finish
      task.status = RUNNING
      await runCommand(task.name, task.command, task.env)

      // When it's done, mark it as done then remove it from all other tasks' dependencies
      task.status = DONE
      for (let innerTask of tasks) {
        innerTask.dependencies = without(innerTask.dependencies, task.name)
      }

      // Finally, re-run the recursive function and return it's result
      return recurse(tasks)
    } else {
      // Otherwise just return a resolved promise
      return Promise.resolve()
    }
  }))
}

function runCommand (name, command, env) {
  const endCommand = startCommand(name)
  if (command === null) {
    endCommand()
    return Promise.resolve()
  } else {
    return new Promise((resolve, reject) => {
      const args = spawnArgs(command, { removequotes: 'always' })
      const proc = spawn(args.shift(), args, {
        stdio: 'inherit',
        env: {
          ...process.env,
          PATH: process.env.PATH + delimiter + pathResolve('.', 'node_modules', '.bin'),
          ...env
        }
      })

      proc.on('error', (err) => logError(err))

      proc.on('exit', (code) => {
        // TODO: Handle exit code here
        endCommand()
        resolve()
      })
    })
  }
}
