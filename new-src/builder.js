/**
* Task Types:
* string - command
* parallel-array-obj - run in parallel
* seq-array-obj - run in seq
*/

/**
* Task option flags:
* optional
* silent/quiet
* no-error
*
*/

export const tasks = {}

export function addTask (taskName, taskGenerator, flags) {
  const task = function (...args) {
    task.task = taskGenerator(...args)
  }
  task.taskName = taskName
  task.flags = {
    silent: false,
    ignoreErrors: false,
    ...flags
  }

  Object.defineProperty(task, 'silent', {
    get: function () {
      this.flags.silent = true
      return this
    }
  })
  Object.defineProperty(task, 'ignoreErrors', {
    get: function () {
      this.flags.ignoreErrors = true
      return this
    }
  })
  tasks[taskName] = task
}
